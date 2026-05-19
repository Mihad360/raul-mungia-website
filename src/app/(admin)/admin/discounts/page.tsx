/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Tag,
  Percent,
  Calendar,
  Gift,
  Ticket,
  Clock,
} from "lucide-react";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";
import RmSelect from "@/components/ui/RmSelect";
import RmDatePicker from "@/components/ui/RmDatePicker";
import { message } from "antd";

type Discount = {
  id: string;
  name: string;
  type: "discount" | "coupon";
  discountPercent: number;
  minQuantity?: number;
  maxQuantity?: number;
  code?: string;
  expiryDate?: string;
  status: "active" | "inactive";
};

type ProductDiscount = {
  productId: string;
  productName: string;
  sku: string;
  discount: number;
  minQuantity: number;
  maxQuantity: number;
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

// Discount Card Component
const DiscountCard = ({
  discount,
  onEdit,
  onDelete,
}: {
  discount: Discount;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            {discount.type === "discount" ? (
              <Percent size={20} className="text-red-600" />
            ) : (
              <Ticket size={20} className="text-red-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{discount.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {discount.type === "discount"
                ? "Bulk Discount"
                : `Code: ${discount.code}`}
            </p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
          {discount.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Discount</span>
          <span className="text-lg font-bold text-red-600">
            {discount.discountPercent}%
          </span>
        </div>
        {discount.minQuantity && discount.maxQuantity && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Quantity Range</span>
            <span className="text-sm font-semibold text-gray-900">
              {discount.minQuantity}-{discount.maxQuantity} products
            </span>
          </div>
        )}
        {discount.expiryDate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Expiry Date</span>
            <span className="text-sm font-semibold text-gray-900">
              {discount.expiryDate}
            </span>
          </div>
        )}
      </div>

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

// Product Discount Card Component
const ProductDiscountCard = ({
  product,
  onEditDiscount,
}: {
  product: ProductDiscount;
  onEditDiscount: () => void;
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">
            {product.productName}
          </h3>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            {product.sku}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Our premium package is designed to help you grow your business.
      </p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Product Quantity:</span>
          <span className="text-sm font-semibold text-gray-900">
            {product.minQuantity}-{product.maxQuantity}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Discount:</span>
          <span className="text-lg font-bold text-red-600">
            {product.discount}%
          </span>
        </div>
      </div>

      <button
        onClick={onEditDiscount}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
        style={{ backgroundColor: "#C70A24" }}
      >
        <Tag size={16} />
        Edit Discount
      </button>
    </div>
  );
};

// Add/Edit Discount Modal
const DiscountFormModal = ({
  isOpen,
  onClose,
  discount,
  onSave,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  discount?: Discount | null;
  onSave: (data: any) => void;
  type: "discount" | "coupon";
}) => {
  const isEditing = !!discount;

  const handleSubmit = (data: any) => {
    onSave({
      ...data,
      type,
    });
    onClose();
    message.success(
      isEditing
        ? "Discount updated successfully!"
        : "Discount created successfully!",
    );
  };

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditing
          ? "Edit Discount"
          : type === "discount"
            ? "Create Bulk Discount"
            : "Create Coupon"
      }
      width="max-w-lg"
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
            form="discount-form"
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#C70A24" }}
          >
            {isEditing ? "Update Discount" : "Create Discount"}
          </button>
        </div>
      }
    >
      <RmForm
        id="discount-form"
        onSubmit={handleSubmit}
        defaultValues={{
          name: discount?.name || "",
          discountPercent: discount?.discountPercent || 0,
          minQuantity: discount?.minQuantity || 5,
          maxQuantity: discount?.maxQuantity || 9,
          code: discount?.code || "",
          expiryDate: discount?.expiryDate || "",
        }}
      >
        <div className="space-y-5">
          <RmInput
            name="name"
            label={type === "discount" ? "Discount Name" : "Coupon Name"}
            placeholder={
              type === "discount"
                ? "e.g., Bulk Discount"
                : "e.g., New Year 2027"
            }
            required
          />

          <RmInput
            name="discountPercent"
            label="Discount (%)"
            type="number"
            placeholder="10"
            required
          />

          {type === "discount" && (
            <div className="grid grid-cols-2 gap-4">
              <RmInput
                name="minQuantity"
                label="Min Quantity"
                type="number"
                placeholder="5"
                required
              />
              <RmInput
                name="maxQuantity"
                label="Max Quantity"
                type="number"
                placeholder="9"
                required
              />
            </div>
          )}

          {type === "coupon" && (
            <>
              <RmInput
                name="code"
                label="Coupon Code"
                placeholder="e.g., FIRST15"
                required
              />
              <RmDatePicker name="expiryDate" label="Expiry Date" />
            </>
          )}
        </div>
      </RmForm>
    </RmModal>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  itemName,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  onConfirm: () => void;
}) => {
  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Discount"
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
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      }
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={32} className="text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm Deletion
        </h3>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">{itemName}</span>? This
          action cannot be undone.
        </p>
      </div>
    </RmModal>
  );
};

export default function DiscountsCouponsPage() {
  const [activeTab, setActiveTab] = useState("discounts");
  const [isAddDiscountModalOpen, setIsAddDiscountModalOpen] = useState(false);
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null,
  );
  const [selectedItemName, setSelectedItemName] = useState("");

  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: "1",
      name: "10% Discounts",
      type: "discount",
      discountPercent: 10,
      minQuantity: 5,
      maxQuantity: 9,
      status: "active",
    },
    {
      id: "2",
      name: "15% Discounts",
      type: "discount",
      discountPercent: 15,
      minQuantity: 10,
      maxQuantity: 50,
      status: "active",
    },
  ]);

  const [coupons, setCoupons] = useState<Discount[]>([
    {
      id: "3",
      name: "First15",
      type: "coupon",
      discountPercent: 10,
      code: "FIRST15",
      expiryDate: "2026-05-15",
      status: "active",
    },
    {
      id: "4",
      name: "New year 2027",
      type: "coupon",
      discountPercent: 10,
      code: "NY2027",
      expiryDate: "2026-12-29",
      status: "active",
    },
  ]);

  const productDiscounts: ProductDiscount[] = [
    {
      productId: "1",
      productName: "Premium Package",
      sku: "PRD-001",
      discount: 10,
      minQuantity: 5,
      maxQuantity: 9,
    },
    {
      productId: "2",
      productName: "Enterprise Suite",
      sku: "PRD-003",
      discount: 15,
      minQuantity: 10,
      maxQuantity: 50,
    },
  ];

  const kpis = {
    totalDiscounts: discounts.length + coupons.length,
    activeDiscounts: [...discounts, ...coupons].filter(
      (d) => d.status === "active",
    ).length,
    totalCoupons: coupons.length,
    bulkDiscounts: discounts.length,
  };

  const handleAddDiscount = (data: any) => {
    const newDiscount: Discount = {
      id: (discounts.length + 1).toString(),
      name: data.name,
      type: "discount",
      discountPercent: data.discountPercent,
      minQuantity: data.minQuantity,
      maxQuantity: data.maxQuantity,
      status: "active",
    };
    setDiscounts([...discounts, newDiscount]);
  };

  const handleAddCoupon = (data: any) => {
    const newCoupon: Discount = {
      id: (coupons.length + 1).toString(),
      name: data.name,
      type: "coupon",
      discountPercent: data.discountPercent,
      code: data.code,
      expiryDate: data.expiryDate,
      status: "active",
    };
    setCoupons([...coupons, newCoupon]);
  };

  const handleEditDiscount = (data: any) => {
    if (!selectedDiscount) return;
    if (selectedDiscount.type === "discount") {
      const updated = discounts.map((d) =>
        d.id === selectedDiscount.id ? { ...d, ...data } : d,
      );
      setDiscounts(updated);
    } else {
      const updated = coupons.map((c) =>
        c.id === selectedDiscount.id ? { ...c, ...data } : c,
      );
      setCoupons(updated);
    }
    message.success("Discount updated successfully!");
  };

  const handleDeleteDiscount = () => {
    if (!selectedDiscount) return;
    if (selectedDiscount.type === "discount") {
      setDiscounts(discounts.filter((d) => d.id !== selectedDiscount.id));
    } else {
      setCoupons(coupons.filter((c) => c.id !== selectedDiscount.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedDiscount(null);
    message.success("Discount deleted successfully!");
  };

  const openEditModal = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (discount: Discount) => {
    setSelectedDiscount(discount);
    setSelectedItemName(discount.name);
    setIsDeleteModalOpen(true);
  };

  const currentItems = activeTab === "discounts" ? discounts : coupons;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discounts & Coupons
          </h1>
          <p className="text-gray-600">
            Manage your promotional offers and customer discounts
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddDiscountModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#C70A24" }}
          >
            <Percent size={18} />
            Create Discount
          </button>
          <button
            onClick={() => setIsAddCouponModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#10b981" }}
          >
            <Gift size={18} />
            Create Coupon
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Offers"
          value={kpis.totalDiscounts}
          icon={Tag}
          color="#3b82f6"
        />
        <KPICard
          title="Active Offers"
          value={kpis.activeDiscounts}
          icon={Ticket}
          color="#10b981"
        />
        <KPICard
          title="Total Coupons"
          value={kpis.totalCoupons}
          icon={Gift}
          color="#a855f7"
        />
        <KPICard
          title="Bulk Discounts"
          value={kpis.bulkDiscounts}
          icon={Percent}
          color="#f59e0b"
        />
      </div>

      {/* Product Discounts Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Product Discounts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productDiscounts.map((product) => (
            <ProductDiscountCard
              key={product.productId}
              product={product}
              onEditDiscount={() => {
                setSelectedDiscount({
                  id: product.productId,
                  name: product.productName,
                  type: "discount",
                  discountPercent: product.discount,
                  minQuantity: product.minQuantity,
                  maxQuantity: product.maxQuantity,
                  status: "active",
                });
                setIsEditModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-gray-200 pb-0">
        <button
          onClick={() => setActiveTab("discounts")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === "discounts"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Bulk Discounts ({discounts.length})
        </button>
        <button
          onClick={() => setActiveTab("coupons")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === "coupons"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Coupons ({coupons.length})
        </button>
      </div>

      {/* Discounts/Coupons Grid */}
      {currentItems.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No {activeTab} found</p>
          <button
            onClick={() =>
              activeTab === "discounts"
                ? setIsAddDiscountModalOpen(true)
                : setIsAddCouponModalOpen(true)
            }
            className="mt-4 text-red-600 hover:text-red-700 font-medium cursor-pointer"
          >
            Create your first{" "}
            {activeTab === "discounts" ? "bulk discount" : "coupon"} →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <DiscountCard
              key={item.id}
              discount={item}
              onEdit={() => openEditModal(item)}
              onDelete={() => openDeleteModal(item)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <DiscountFormModal
        isOpen={isAddDiscountModalOpen}
        onClose={() => setIsAddDiscountModalOpen(false)}
        onSave={handleAddDiscount}
        type="discount"
      />

      <DiscountFormModal
        isOpen={isAddCouponModalOpen}
        onClose={() => setIsAddCouponModalOpen(false)}
        onSave={handleAddCoupon}
        type="coupon"
      />

      <DiscountFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDiscount(null);
        }}
        discount={selectedDiscount}
        onSave={handleEditDiscount}
        type={selectedDiscount?.type || "discount"}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDiscount(null);
        }}
        itemName={selectedItemName}
        onConfirm={handleDeleteDiscount}
      />
    </div>
  );
}
