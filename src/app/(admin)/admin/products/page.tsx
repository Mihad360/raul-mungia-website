/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  Layers,
  Upload,
} from "lucide-react";
import { message } from "antd";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";
import RmSelect from "@/components/ui/RmSelect";
import RmPagination from "@/components/ui/RmPagination";

type Product = {
  id: string;
  title: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  sizes: string[];
  category: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  image?: string;
  additionalInfo?: string;
  compliance?: string;
  createdAt?: string;
};

// Status Badge Component
const StatusBadge = ({ status }: { status: Product["status"] }) => {
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

// KPI Card Component
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
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-white`}
          style={{ backgroundColor: color }}
        >
          <Icon size={24} />
        </div>
      </div>
      <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// Product Card Component
const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-all">
      {/* Header with Title and SKU */}
      <div className="mb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {product.title}
            </h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              {product.sku}
            </p>
          </div>
          <StatusBadge status={product.status} />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {product.description}
      </p>

      {/* Price and Stock inline */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Price</p>
          <p className="text-xl font-bold text-gray-900">
            ${product.price.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Stock</p>
          <p
            className={`text-xl font-bold ${product.stock < 10 ? "text-red-600" : "text-gray-900"}`}
          >
            {product.stock}
          </p>
        </div>
      </div>

      {/* Size Selector */}
      {product.sizes.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Size</p>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 bg-gray-50 cursor-pointer"
          >
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Edit size={16} />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

// Add/Edit Product Modal with RmForm
const ProductFormModal = ({
  isOpen,
  onClose,
  product,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (data: Partial<Product>) => void;
}) => {
  const isEditing = !!product;

  const categoryOptions = [
    { label: "Premium", value: "Premium" },
    { label: "Standard", value: "Standard" },
    { label: "Enterprise", value: "Enterprise" },
    { label: "Basic", value: "Basic" },
    { label: "Professional", value: "Professional" },
    { label: "Starter", value: "Starter" },
  ];

  const handleSubmit = (data: any) => {
    onSave({
      title: data.title,
      price: data.price,
      stock: data.stock,
      sizes: data.sizes
        ? data.sizes.split(",").map((s: string) => s.trim())
        : [],
      category: data.category,
      description: data.description,
      additionalInfo: data.additionalInfo,
      compliance: data.compliance,
    });
    onClose();
    message.success(
      isEditing
        ? "Product updated successfully!"
        : "Product added successfully!",
    );
  };

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Product" : "Add New Product"}
      width="max-w-2xl"
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#C70A24" }}
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </div>
      }
    >
      <RmForm
        id="product-form"
        onSubmit={handleSubmit}
        defaultValues={{
          title: product?.title || "",
          price: product?.price || 0,
          stock: product?.stock || 0,
          sizes: product?.sizes?.join(", ") || "",
          category: product?.category || "Premium",
          description: product?.description || "",
          additionalInfo: product?.additionalInfo || "",
          compliance: product?.compliance || "",
        }}
      >
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="space-y-4">
              <RmInput
                name="title"
                label="Title"
                placeholder="Enter product title"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <RmInput
                  name="price"
                  label="Price"
                  type="number"
                  placeholder="$0.00"
                  required
                />
                <RmInput
                  name="stock"
                  label="Quantity"
                  type="number"
                  placeholder="0"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <RmInput
                  name="sizes"
                  label="Size"
                  placeholder="10 mg, 30 mg, 50 mg, 100 mg"
                  helpText="Separate sizes with commas"
                />
                <RmSelect
                  name="category"
                  label="Category"
                  options={categoryOptions}
                  placeholder="Select category"
                />
              </div>
            </div>
          </div>

          {/* Product Icon */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Icon
            </h3>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Click or drag to upload image
              </p>
            </div>
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
              name="additionalInfo"
              type="textarea"
              placeholder="Enter additional product information, features, or specifications..."
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Include features, benefits, what's included, support details, etc.
            </p>
          </div>

          {/* Compliance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Compliance
            </h3>
            <RmInput
              name="compliance"
              type="textarea"
              placeholder="Enter compliance information, certifications, and standards..."
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Include regulatory compliance, certifications (GDPR, SOC 2, ISO,
              HIPAA), security standards, etc.
            </p>
          </div>
        </div>
      </RmForm>
    </RmModal>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  product,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: () => void;
}) => {
  if (!product) return null;

  const handleConfirm = () => {
    onConfirm();
    message.success("Product deleted successfully!");
  };

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
            className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
          >
            Delete
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

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const itemsPerPage = 6;

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      title: "Premium Package",
      sku: "PRD-001",
      description:
        "Our premium package includes all essential features for growing businesses. Perfect for teams of 10-50",
      price: 299,
      stock: 45,
      sizes: ["10 mg", "30 mg", "50 mg", "100 mg"],
      category: "Premium",
      status: "in-stock",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Standard Plan",
      sku: "PRD-002",
      description:
        "Perfect for small to medium businesses. Includes core features and standard support.",
      price: 149,
      stock: 120,
      sizes: ["10 mg", "30 mg", "50 mg", "100 mg"],
      category: "Standard",
      status: "in-stock",
      createdAt: "2024-02-20",
    },
    {
      id: "3",
      title: "Enterprise Suite",
      sku: "PRD-003",
      description:
        "Complete enterprise solution with unlimited users and advanced features. Custom integrations available.",
      price: 599,
      stock: 28,
      sizes: ["10 mg", "30 mg", "50 mg", "100 mg"],
      category: "Enterprise",
      status: "low-stock",
      createdAt: "2024-01-10",
    },
    {
      id: "4",
      title: "Basic Package",
      sku: "PRD-004",
      description:
        "Starter package for individuals and small teams. Get started with essential features.",
      price: 99,
      stock: 200,
      sizes: ["10 mg", "30 mg", "50 mg", "100 mg"],
      category: "Basic",
      status: "in-stock",
      createdAt: "2024-03-05",
    },
    {
      id: "5",
      title: "Professional",
      sku: "PRD-005",
      description:
        "Advanced features for professional teams. Enhanced analytics and reporting tools included.",
      price: 399,
      stock: 67,
      sizes: ["10 mg", "30 mg", "50 mg", "100 mg"],
      category: "Professional",
      status: "in-stock",
      createdAt: "2024-02-28",
    },
    {
      id: "6",
      title: "Starter",
      sku: "PRD-006",
      description:
        "Budget-friendly option for getting started. Limited features with room to upgrade.",
      price: 49,
      stock: 350,
      sizes: ["10 mg", "30 mg", "50 mg", "100 mg"],
      category: "Starter",
      status: "in-stock",
      createdAt: "2024-03-10",
    },
  ]);

  // KPI Calculations
  const kpis = {
    totalProducts: products.length,
    inStock: products.filter((p) => p.status === "in-stock").length,
    lowStock: products.filter((p) => p.status === "low-stock").length,
    categories: new Set(products.map((p) => p.category)).size,
  };

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, products]);

  // Reset to first page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleAddProduct = (data: Partial<Product>) => {
    const newProduct: Product = {
      id: (products.length + 1).toString(),
      title: data.title || "",
      sku: `PRD-${String(products.length + 1).padStart(3, "0")}`,
      description: data.description || "",
      price: data.price || 0,
      stock: data.stock || 0,
      sizes: data.sizes || [],
      category: data.category || "Uncategorized",
      status:
        (data.stock || 0) > 20
          ? "in-stock"
          : (data.stock || 0) > 0
            ? "low-stock"
            : "out-of-stock",
      additionalInfo: data.additionalInfo,
      compliance: data.compliance,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProducts([...products, newProduct]);
  };

  const handleEditProduct = (data: Partial<Product>) => {
    if (!selectedProduct) return;
    const updatedProducts = products.map((p) =>
      p.id === selectedProduct.id
        ? {
            ...p,
            title: data.title || p.title,
            price: data.price || p.price,
            stock: data.stock || p.stock,
            sizes: data.sizes || p.sizes,
            category: data.category || p.category,
            description: data.description || p.description,
            additionalInfo: data.additionalInfo,
            compliance: data.compliance,
            status:
              (data.stock || p.stock) > 20
                ? "in-stock"
                : (data.stock || p.stock) > 0
                  ? "low-stock"
                  : "out-of-stock",
          }
        : p,
    );
    setProducts(updatedProducts);
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    setProducts(products.filter((p) => p.id !== selectedProduct.id));
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

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

      {/* KPI Cards Grid */}
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
          title="Categories"
          value={kpis.categories}
          icon={Layers}
          color="#a855f7"
        />
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search products by title, SKU or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 cursor-text"
          />
        </div>
      </div>

      {/* Products Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => openEditModal(product)}
                onDelete={() => openDeleteModal(product)}
              />
            ))}
          </div>

          {/* Pagination */}
          {filteredProducts.length > itemsPerPage && (
            <RmPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showFirstLast
            />
          )}
        </>
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
      />

      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSave={handleEditProduct}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
}
