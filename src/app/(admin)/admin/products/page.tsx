/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  Layers,
  Upload,
  X,
  ImageIcon,
  Eye,
  FileCheck2,
  FileX2,
  FileText,
  Calendar,
  Hash,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { message, Modal } from "antd";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";
import RmSelect from "@/components/ui/RmSelect";
import RmPagination from "@/components/ui/RmPagination";
import RmTable from "@/components/ui/RmTable";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import {
  useGetAllProductsAdminQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductCertificateMutation,
  useRemoveProductCertificateMutation,
} from "@/redux/api/adminApi";

// ─── Backend-aligned types ────────────────────────────────────
type Variant = {
  size: string;
  price: number;
  originalPrice?: number;
  stock: number;
  weight: number;
};

type ProductCertificate = {
  url: string;
  publicId?: string;
  fileType: "pdf" | "image";
  batchNumber?: string;
  testDate?: string;
  uploadedAt?: string;
};

type Product = {
  _id: string;
  title: string;
  productCode: string;
  description: string;
  additionalInformation?: string;
  compliance?: string;
  mainImage: string;
  images?: string[];
  category: string | { _id: string; name: string };
  categoryName?: string;
  variants: Variant[];
  lowStockThreshold?: number;
  isActive?: boolean;
  certificate?: ProductCertificate | null;
  createdAt?: string;
};

type ProductStatus = "in-stock" | "low-stock" | "out-of-stock";

type Category = {
  _id: string;
  name: string;
};

// ─── Helpers ──────────────────────────────────────────────────
const getTotalStock = (variants: Variant[]): number =>
  variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

const getProductStatus = (
  totalStock: number,
  threshold = 20,
): ProductStatus => {
  if (totalStock === 0) return "out-of-stock";
  if (totalStock <= threshold) return "low-stock";
  return "in-stock";
};

const getPriceRange = (variants: Variant[]): string => {
  if (!variants?.length) return "$0.00";
  const prices = variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max
    ? `$${min.toFixed(2)}`
    : `$${min.toFixed(2)} – $${max.toFixed(2)}`;
};

const getCategoryName = (product: Product): string => {
  if (product.categoryName) return product.categoryName;
  if (typeof product.category === "object" && product.category?.name)
    return product.category.name;
  return "Uncategorized";
};

const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ─── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }: { status: ProductStatus }) => {
  const config = {
    "in-stock": {
      bg: "bg-green-50",
      text: "text-green-700",
      label: "In Stock",
    },
    "low-stock": {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      label: "Low Stock",
    },
    "out-of-stock": {
      bg: "bg-red-50",
      text: "text-red-700",
      label: "Out of Stock",
    },
  };
  const { bg, text, label } = config[status];
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

// ─── COA Indicator (small badge for table) ────────────────────
const CoaIndicator = ({ hasCertificate }: { hasCertificate: boolean }) => {
  if (hasCertificate) {
    return (
      <span
        title="Has Certificate of Analysis"
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-green-700"
      >
        <FileCheck2 size={11} />
        COA
      </span>
    );
  }
  return (
    <span
      title="No Certificate of Analysis"
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700"
    >
      <FileX2 size={11} />
      No COA
    </span>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────
const KPICard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}) => (
  <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
        style={{ backgroundColor: color }}
      >
        <Icon size={24} />
      </div>
    </div>
    <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

// ─── Variant Editor Row ───────────────────────────────────────
const VariantRow = ({
  variant,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  variant: Variant;
  index: number;
  onChange: (idx: number, field: keyof Variant, value: any) => void;
  onRemove: (idx: number) => void;
  canRemove: boolean;
}) => (
  <div className="grid grid-cols-12 gap-2 items-end p-3 border border-gray-200 rounded-lg bg-gray-50">
    <div className="col-span-2">
      <label className="text-xs text-gray-600 mb-1 block">Size</label>
      <input
        type="text"
        value={variant.size}
        onChange={(e) => onChange(index, "size", e.target.value)}
        placeholder="10mg"
        className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
      />
    </div>
    <div className="col-span-2">
      <label className="text-xs text-gray-600 mb-1 block">Price</label>
      <input
        type="number"
        step="0.01"
        value={variant.price || ""}
        onChange={(e) => onChange(index, "price", Number(e.target.value))}
        placeholder="29.95"
        className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
      />
    </div>
    <div className="col-span-2">
      <label className="text-xs text-gray-600 mb-1 block">Original $</label>
      <input
        type="number"
        step="0.01"
        value={variant.originalPrice || ""}
        onChange={(e) =>
          onChange(index, "originalPrice", Number(e.target.value))
        }
        placeholder="—"
        className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
      />
    </div>
    <div className="col-span-2">
      <label className="text-xs text-gray-600 mb-1 block">Stock</label>
      <input
        type="number"
        value={variant.stock || ""}
        onChange={(e) => onChange(index, "stock", Number(e.target.value))}
        placeholder="100"
        className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
      />
    </div>
    <div className="col-span-2">
      <label className="text-xs text-gray-600 mb-1 block">Weight (lbs)</label>
      <input
        type="number"
        step="0.01"
        value={variant.weight || ""}
        onChange={(e) => onChange(index, "weight", Number(e.target.value))}
        placeholder="0.5"
        className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
      />
    </div>
    <div className="col-span-2 flex justify-end">
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Remove variant"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

// ─── Product Form Modal ───────────────────────────────────────
const ProductFormModal = ({
  isOpen,
  onClose,
  product,
  categories,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  categories: Category[];
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const isEditing = !!product;

  const [variants, setVariants] = useState<Variant[]>(
    product?.variants?.length
      ? product.variants
      : [{ size: "", price: 0, stock: 0, weight: 0.5 }],
  );

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>(
    product?.mainImage || "",
  );
  // Existing Cloudinary URLs (edit mode) kept separate from newly picked Files
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(
    product?.images || [],
  );
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

  const galleryPreviews = [...existingGalleryUrls, ...newGalleryPreviews];

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVariants(
        product?.variants?.length
          ? product.variants
          : [{ size: "", price: 0, stock: 0, weight: 0.5 }],
      );
      setMainImageFile(null);
      setGalleryFiles([]);
      setMainImagePreview(product?.mainImage || "");
      setExistingGalleryUrls(product?.images || []);
      setNewGalleryPreviews([]);
    }
  }, [isOpen, product]);

  useEffect(() => {
    return () => {
      if (mainImagePreview.startsWith("blob:"))
        URL.revokeObjectURL(mainImagePreview);
      newGalleryPreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, []);

  const handleVariantChange = (
    idx: number,
    field: keyof Variant,
    value: any,
  ) => {
    setVariants((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: "", price: 0, stock: 0, weight: 0.5 },
    ]);
  };

  const handleRemoveVariant = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (mainImagePreview.startsWith("blob:"))
      URL.revokeObjectURL(mainImagePreview);
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setGalleryFiles((prev) => [...prev, ...files]);
    setNewGalleryPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveGalleryImage = (idx: number) => {
    if (idx < existingGalleryUrls.length) {
      setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== idx));
      return;
    }

    const newIdx = idx - existingGalleryUrls.length;
    setNewGalleryPreviews((prev) => {
      const url = prev[newIdx];
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== newIdx);
    });
    setGalleryFiles((prev) => prev.filter((_, i) => i !== newIdx));
  };

  const handleSubmit = async (data: any) => {
    if (variants.length === 0) {
      message.error("Add at least one variant");
      return;
    }
    const invalidVariant = variants.find(
      (v) => !v.size?.trim() || !v.price || v.stock === undefined,
    );
    if (invalidVariant) {
      message.error("Each variant needs a size, price, and stock value");
      return;
    }

    if (!isEditing && !mainImageFile) {
      message.error("Main image is required");
      return;
    }

    if (!data.category) {
      message.error("Please select a category");
      return;
    }

    const originalGallery = product?.images || [];
    const removeImages = originalGallery.filter(
      (url) => !existingGalleryUrls.includes(url),
    );

    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify({
        title: data.title?.trim(),
        category: data.category,
        description: data.description?.trim() || "",
        additionalInformation: data.additionalInformation?.trim() || "",
        compliance: data.compliance?.trim() || "",
        lowStockThreshold: Number(data.lowStockThreshold) || 20,
        variants: variants.map((v) => ({
          size: v.size.trim(),
          price: Number(v.price),
          originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
          stock: Number(v.stock),
          weight: Number(v.weight) || 0.5,
        })),
        ...(isEditing && removeImages.length > 0 ? { removeImages } : {}),
      }),
    );

    if (mainImageFile) formData.append("mainImage", mainImageFile);
    galleryFiles.forEach((file) => formData.append("images", file));

    await onSubmit(formData);
  };

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c._id,
  }));

  const currentCategoryId =
    typeof product?.category === "object"
      ? product.category._id
      : (product?.category as string) || "";

  const formDefaultValues = useMemo(
    () => ({
      title: product?.title || "",
      category: currentCategoryId,
      description: product?.description || "",
      additionalInformation: product?.additionalInformation || "",
      compliance: product?.compliance || "",
      lowStockThreshold: product?.lowStockThreshold || 20,
    }),
    // Reset form fields only when opening for a different product / create flow
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen, product?._id],
  );

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Product" : "Add New Product"}
      width="max-w-4xl"
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#C70A24" }}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Product"
                : "Add Product"}
          </button>
        </div>
      }
    >
      <RmForm
        key={`${isOpen}-${product?._id ?? "new"}`}
        id="product-form"
        onSubmit={handleSubmit}
        defaultValues={formDefaultValues}
      >
        <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="space-y-4">
              <RmInput
                name="title"
                label="Product Title"
                placeholder="e.g. BPC-157"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <RmSelect
                  name="category"
                  label="Category"
                  options={categoryOptions}
                  placeholder="Select category"
                />
                <RmInput
                  name="lowStockThreshold"
                  label="Low Stock Threshold"
                  type="number"
                  placeholder="20"
                  helpText="Below this stock, product shows 'Low Stock'"
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Variants <span className="text-red-500">*</span>
              </h3>
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "#C70A24" }}
              >
                <Plus size={14} />
                Add Variant
              </button>
            </div>
            <div className="space-y-2">
              {variants.map((variant, idx) => (
                <VariantRow
                  key={idx}
                  variant={variant}
                  index={idx}
                  onChange={handleVariantChange}
                  onRemove={handleRemoveVariant}
                  canRemove={variants.length > 1}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Each size has its own price, stock, and weight (in pounds for
              FedEx)
            </p>
          </div>

          {/* Main Image */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Main Image {!isEditing && <span className="text-red-500">*</span>}
            </h3>
            {mainImagePreview ? (
              <div className="relative inline-block">
                <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <Image
                    src={mainImagePreview}
                    alt="Main preview"
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <label
                  htmlFor="main-image-replace"
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center cursor-pointer hover:bg-gray-50"
                >
                  <Edit size={14} className="text-gray-600" />
                </label>
                <input
                  id="main-image-replace"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                />
              </div>
            ) : (
              <label
                htmlFor="main-image-upload"
                className="block border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors cursor-pointer"
              >
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Click to upload main image
                </p>
                <input
                  id="main-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Gallery Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gallery Images
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {galleryPreviews.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group"
                >
                  <Image
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X size={12} className="text-red-600" />
                  </button>
                </div>
              ))}

              {galleryPreviews.length < 10 && (
                <label
                  htmlFor="gallery-upload"
                  className="w-full aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <Plus size={24} className="text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Add</span>
                  <input
                    id="gallery-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Up to 10 additional images
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Description
            </h3>
            <RmInput
              name="description"
              type="textarea"
              placeholder="Enter product description..."
              rows={4}
            />
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Information
            </h3>
            <RmInput
              name="additionalInformation"
              type="textarea"
              placeholder="Reconstitution guide, storage instructions, etc..."
              rows={4}
            />
          </div>

          {/* Compliance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Compliance
            </h3>
            <RmInput
              name="compliance"
              type="textarea"
              placeholder="Research-use-only disclaimers, certifications, regulatory notes..."
              rows={4}
            />
          </div>

          {/* Hint about COA */}
          {!isEditing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 flex items-start gap-2">
              <FileText size={14} className="mt-0.5 flex-shrink-0" />
              <p>
                You can upload the{" "}
                <strong>Certificate of Analysis (COA)</strong> after creating
                the product, from the product details view.
              </p>
            </div>
          )}
        </div>
      </RmForm>
    </RmModal>
  );
};

// ─── COA Management Section (inside Details Modal) ────────────
const CoaManagementSection = ({
  product,
  onUpdated,
}: {
  product: Product;
  onUpdated: (updated: Product) => void;
}) => {
  const hasCert = !!product.certificate?.url;

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [batchNumber, setBatchNumber] = useState("");
  const [testDate, setTestDate] = useState("");

  const [uploadCert, { isLoading: isUploading }] =
    useUploadProductCertificateMutation();
  const [removeCert, { isLoading: isRemoving }] =
    useRemoveProductCertificateMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!allowed.includes(file.type)) {
      message.error("Only PDF or image files (JPG, PNG, WEBP) are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      message.error("File must be less than 10MB");
      return;
    }

    setUploadFile(file);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      message.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append(
      "data",
      JSON.stringify({
        batchNumber: batchNumber.trim() || undefined,
        testDate: testDate || undefined,
      }),
    );

    try {
      const response = await uploadCert({
        id: product._id,
        formData,
      }).unwrap();

      message.success("Certificate uploaded successfully");
      setUploadFile(null);
      setBatchNumber("");
      setTestDate("");

      // Update parent view state with fresh product
      const updatedProduct = response?.data || response;
      if (updatedProduct) onUpdated(updatedProduct);
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to upload certificate");
    }
  };

  const handleRemove = () => {
    Modal.confirm({
      title: "Remove Certificate of Analysis?",
      content:
        "This will remove the COA from this product. Customers won't be able to view it until you upload a new one.",
      okText: "Yes, Remove",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const response = await removeCert(product._id).unwrap();
          message.success("Certificate removed");

          const updatedProduct = response?.data || response;
          if (updatedProduct) onUpdated(updatedProduct);
        } catch (err: any) {
          message.error(err?.data?.message || "Failed to remove certificate");
        }
      },
    });
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <FileText size={18} />
          Certificate of Analysis
        </h4>
        <CoaIndicator hasCertificate={hasCert} />
      </div>

      {/* Current COA */}
      {hasCert && product.certificate && (
        <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck2 size={16} className="text-green-600" />
                <p className="font-semibold text-gray-900 text-sm">
                  Active Certificate
                </p>
                <span className="text-xs text-gray-500 uppercase font-mono px-1.5 py-0.5 bg-gray-100 rounded">
                  {product.certificate.fileType}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-500 mb-0.5 flex items-center gap-1">
                    <Hash size={10} /> Batch
                  </p>
                  <p className="font-mono text-gray-900">
                    {product.certificate.batchNumber || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5 flex items-center gap-1">
                    <Calendar size={10} /> Tested
                  </p>
                  <p className="font-mono text-gray-900">
                    {formatDate(product.certificate.testDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5 flex items-center gap-1">
                    <Upload size={10} /> Uploaded
                  </p>
                  <p className="font-mono text-gray-900">
                    {formatDate(product.certificate.uploadedAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={product.certificate.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#C70A24" }}
              >
                View <ExternalLink size={11} />
              </a>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isRemoving}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={11} />
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload / Replace */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">
          {hasCert ? "Replace Certificate" : "Upload Certificate"}
        </p>

        <div className="space-y-3">
          {/* File picker */}
          <label
            htmlFor="coa-upload"
            className={`block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              uploadFile
                ? "border-green-300 bg-green-50"
                : "border-gray-300 hover:border-gray-400 bg-white"
            }`}
          >
            {uploadFile ? (
              <div className="flex items-center justify-center gap-2 text-sm">
                <FileCheck2 size={18} className="text-green-600" />
                <span className="font-medium text-gray-900">
                  {uploadFile.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Upload size={24} className="text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to upload PDF or image
                </p>
                <p className="text-xs text-gray-400">
                  Max 10MB · PDF, JPG, PNG, WEBP
                </p>
              </div>
            )}
            <input
              id="coa-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Metadata fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                <Hash size={10} />
                Batch Number{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. BATCH-2025-04"
                className="w-full px-3 py-2 rounded border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                <Calendar size={10} />
                Test Date{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
              />
            </div>
          </div>

          {/* Upload button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={!uploadFile || isUploading}
            className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: "#C70A24" }}
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={14} />
                {hasCert ? "Replace Certificate" : "Upload Certificate"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirmation Modal ────────────────────────────────
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}) => {
  if (!product) return null;

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Product"
      width="max-w-md"
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      }
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} className="text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm Deletion
        </h3>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">{product.title}</span>?
          This action cannot be undone.
        </p>
      </div>
    </RmModal>
  );
};

// ─── Product Details Modal (View) ─────────────────────────────
const ProductDetailsModal = ({
  isOpen,
  onClose,
  product,
  onProductUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onProductUpdated: (updated: Product) => void;
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveImageIdx(0);
    }
  }, [isOpen, product?._id]);

  if (!product) return null;

  const allImages = [product.mainImage, ...(product.images || [])].filter(
    Boolean,
  );
  const totalStock = getTotalStock(product.variants);
  const status = getProductStatus(totalStock, product.lowStockThreshold || 20);

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Details"
      width="max-w-4xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Top section: Image + Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image gallery */}
          <div>
            <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
              {allImages[activeImageIdx] ? (
                <Image
                  src={allImages[activeImageIdx]}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={64} className="text-gray-300" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded border-2 overflow-hidden transition-colors ${
                      activeImageIdx === idx
                        ? "border-[#C70A24]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right info column */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 font-mono">
                {product.productCode}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {product.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />
              <span className="text-sm text-gray-600 inline-flex items-center gap-1">
                <Layers size={14} />
                {getCategoryName(product)}
              </span>
              <CoaIndicator hasCertificate={!!product.certificate?.url} />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Price Range</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">
                  {getPriceRange(product.variants)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Stock</p>
                <p
                  className={`font-bold text-lg mt-0.5 ${
                    totalStock < 10 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {totalStock} units
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Variants</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">
                  {product.variants?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Low Stock Alert</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">
                  ≤ {product.lowStockThreshold || 20}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COA Management — placed prominently after main info */}
        <CoaManagementSection product={product} onUpdated={onProductUpdated} />

        {/* Variants Table */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Variants</h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                    Size
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                    Stock
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                    Weight
                  </th>
                </tr>
              </thead>
              <tbody>
                {product.variants?.map((v, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-100 last:border-0"
                  >
                    <td className="px-4 py-2.5 font-medium text-gray-900">
                      {v.size}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-semibold text-gray-900">
                        ${v.price.toFixed(2)}
                      </span>
                      {v.originalPrice && (
                        <span className="ml-2 text-xs text-gray-400 line-through">
                          ${v.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={
                          v.stock < 10
                            ? "text-red-600 font-semibold"
                            : "text-gray-700"
                        }
                      >
                        {v.stock}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">
                      {v.weight} lbs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Additional Information */}
        {product.additionalInformation && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Additional Information
            </h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {product.additionalInformation}
            </p>
          </div>
        )}

        {/* Compliance */}
        {product.compliance && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Compliance</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {product.compliance}
            </p>
          </div>
        )}
      </div>
    </RmModal>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export default function ProductsPage() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const itemsPerPage = 10;

  // ─── API queries & mutations ────────────────────────────────
  const { data: productsResponse, isLoading: isLoadingProducts } =
    useGetAllProductsAdminQuery({
      page: currentPage,
      limit: itemsPerPage,
      searchTerm: searchQuery || undefined,
    });

  const { data: categoriesData } = useGetAllCategoriesQuery({});

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products: Product[] =
    productsResponse?.data?.result || productsResponse?.data || [];
  const meta = productsResponse?.data?.meta || {
    page: 1,
    limit: 10,
    total: products.length,
    totalPage: 1,
  };
  const categories: Category[] =
    categoriesData?.data?.result || categoriesData?.data || [];

  // Reset page on search change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery]);

  // ─── KPI calculations ────────────────────────────────────────
  const kpis = useMemo(() => {
    const totalProducts = meta.total ?? products.length;
    const inStock = products.filter(
      (p) =>
        getProductStatus(
          getTotalStock(p.variants),
          p.lowStockThreshold || 20,
        ) === "in-stock",
    ).length;
    const lowStock = products.filter(
      (p) =>
        getProductStatus(
          getTotalStock(p.variants),
          p.lowStockThreshold || 20,
        ) === "low-stock",
    ).length;
    const missingCoa = products.filter((p) => !p.certificate?.url).length;

    return { totalProducts, inStock, lowStock, missingCoa };
  }, [products, meta.total]);

  // ─── Handlers ───────────────────────────────────────────────
  const handleAddProduct = async (formData: FormData) => {
    try {
      await createProduct(formData).unwrap();
      message.success("Product added successfully!");
      setIsAddModalOpen(false);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to add product",
      );
    }
  };

  const openViewModal = (product: Product) => {
    setViewProduct(product);
    setIsViewModalOpen(true);
  };

  const handleEditProduct = async (formData: FormData) => {
    if (!selectedProduct) return;
    try {
      await updateProduct({
        id: selectedProduct._id,
        formData,
      }).unwrap();
      message.success("Product updated successfully!");
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to update product",
      );
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct._id).unwrap();
      message.success("Product deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to delete product",
      );
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // ─── Table Columns ──────────────────────────────────────────
  const columns = [
    {
      key: "image",
      title: "Image",
      width: 80,
      render: (product: Product) => (
        <div className="relative w-12 h-12 bg-gray-50 rounded overflow-hidden border border-gray-100">
          {product.mainImage ? (
            <Image
              src={product.mainImage}
              alt={product.title}
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={20} className="text-gray-300" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      title: "Product",
      render: (product: Product) => (
        <div className="min-w-[180px]">
          <p className="font-semibold text-gray-900 line-clamp-1">
            {product.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-gray-500 font-mono">
              {product.productCode}
            </p>
            <CoaIndicator hasCertificate={!!product.certificate?.url} />
          </div>
        </div>
      ),
    },
    {
      key: "category",
      title: "Category",
      render: (product: Product) => (
        <span className="text-sm text-gray-700">
          {getCategoryName(product)}
        </span>
      ),
    },
    {
      key: "variants",
      title: "Variants",
      align: "center" as const,
      render: (product: Product) => (
        <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
          {product.variants?.length || 0}
        </span>
      ),
    },
    {
      key: "price",
      title: "Price",
      render: (product: Product) => (
        <span className="font-semibold text-gray-900 whitespace-nowrap">
          {getPriceRange(product.variants)}
        </span>
      ),
    },
    {
      key: "stock",
      title: "Stock",
      align: "center" as const,
      render: (product: Product) => {
        const total = getTotalStock(product.variants);
        return (
          <span
            className={`font-semibold ${total < 10 ? "text-red-600" : "text-gray-900"}`}
          >
            {total}
          </span>
        );
      },
    },
    {
      key: "status",
      title: "Status",
      render: (product: Product) => {
        const totalStock = getTotalStock(product.variants);
        const status = getProductStatus(
          totalStock,
          product.lowStockThreshold || 20,
        );
        return <StatusBadge status={status} />;
      },
    },
    {
      key: "actions",
      title: "Actions",
      align: "right" as const,
      render: (product: Product) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => openViewModal(product)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <Eye size={14} />
            View
          </button>
          <button
            onClick={() => openEditModal(product)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Edit size={14} />
            Edit
          </button>
          <button
            onClick={() => openDeleteModal(product)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      ),
    },
  ];

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Products Management
          </h1>
          <p className="text-gray-600">
            Manage your product catalog and inventory
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "#C70A24" }}
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Products"
          value={kpis.totalProducts}
          icon={Package}
          color="#10b981"
        />
        <KPICard
          title="In Stock"
          value={kpis.inStock}
          icon={Package}
          color="#3b82f6"
        />
        <KPICard
          title="Low Stock"
          value={kpis.lowStock}
          icon={AlertCircle}
          color="#f59e0b"
        />
        <KPICard
          title="Missing COA"
          value={kpis.missingCoa}
          icon={FileX2}
          color="#dc2626"
        />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search products by title, code, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <RmTable
          columns={columns}
          data={products}
          loading={isLoadingProducts}
          emptyText={
            searchQuery
              ? "No products match your search"
              : "No products yet. Click 'Add New Product' to create your first one."
          }
        />
      </div>

      {/* Pagination */}
      {meta.totalPage > 1 && (
        <RmPagination
          currentPage={currentPage}
          totalPages={meta.totalPage}
          onPageChange={setCurrentPage}
          showFirstLast
        />
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onSubmit={handleAddProduct}
        isSubmitting={isCreating}
      />

      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        categories={categories}
        onSubmit={handleEditProduct}
        isSubmitting={isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onConfirm={handleDeleteProduct}
        isDeleting={isDeleting}
      />

      <ProductDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewProduct(null);
        }}
        product={viewProduct}
        onProductUpdated={(updated) => setViewProduct(updated)}
      />
    </div>
  );
}
