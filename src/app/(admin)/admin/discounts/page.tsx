/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Tag,
  Percent,
  Gift,
  Ticket,
  Plus,
  AlertCircle,
  Calendar,
  Copy,
  Check,
} from "lucide-react";
import { message } from "antd";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";
import RmTable from "@/components/ui/RmTable";
import {
  useGetAllCouponsAdminQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useGetAllDiscountsAdminQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} from "@/redux/api/adminApi";

// ─── Types (backend-aligned) ──────────────────────────────────
type Tier = {
  minQuantity: number;
  maxQuantity: number | null;
  discountPercent: number;
};

type BulkDiscount = {
  _id: string;
  name: string;
  description?: string;
  tiers: Tier[];
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type Coupon = {
  _id: string;
  code: string;
  discountPercent: number;
  expiryDate?: string;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
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

// ─── Status Pill (toggleable) ─────────────────────────────────
const StatusPill = ({
  isActive,
  onToggle,
  disabled,
}: {
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
    disabled={disabled}
    title="Click to toggle status"
    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 ${
      isActive
        ? "bg-green-50 text-green-700 hover:bg-green-100"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </button>
);

// ─── Tier Editor Row (for Bulk Discount form) ────────────────
const TierRow = ({
  tier,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  tier: Tier;
  index: number;
  onChange: (idx: number, field: keyof Tier, value: any) => void;
  onRemove: (idx: number) => void;
  canRemove: boolean;
}) => (
  <div className="grid grid-cols-12 gap-2 items-end p-3 border border-gray-200 rounded-lg bg-gray-50">
    <div className="col-span-3">
      <label className="text-xs text-gray-600 mb-1 block">Min Qty</label>
      <input
        type="number"
        value={tier.minQuantity || ""}
        onChange={(e) => onChange(index, "minQuantity", Number(e.target.value))}
        placeholder="3"
        className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
      />
    </div>
    <div className="col-span-4">
      <label className="text-xs text-gray-600 mb-1 block">
        Max Qty (blank = ∞)
      </label>
      <input
        type="number"
        value={tier.maxQuantity ?? ""}
        onChange={(e) =>
          onChange(
            index,
            "maxQuantity",
            e.target.value === "" ? null : Number(e.target.value),
          )
        }
        placeholder="Unlimited"
        className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
      />
    </div>
    <div className="col-span-3">
      <label className="text-xs text-gray-600 mb-1 block">Discount %</label>
      <input
        type="number"
        value={tier.discountPercent || ""}
        onChange={(e) =>
          onChange(index, "discountPercent", Number(e.target.value))
        }
        placeholder="10"
        className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
      />
    </div>
    <div className="col-span-2 flex justify-end">
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Remove tier"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

// ─── Bulk Discount Form Modal ─────────────────────────────────
const BulkDiscountFormModal = ({
  isOpen,
  onClose,
  discount,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  discount?: BulkDiscount | null;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const isEditing = !!discount;
  const [tiers, setTiers] = useState<Tier[]>(
    discount?.tiers?.length
      ? discount.tiers
      : [{ minQuantity: 0, maxQuantity: null, discountPercent: 0 }],
  );

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTiers(
        discount?.tiers?.length
          ? discount.tiers
          : [{ minQuantity: 0, maxQuantity: null, discountPercent: 0 }],
      );
    }
  }, [isOpen, discount]);

  const handleTierChange = (idx: number, field: keyof Tier, value: any) => {
    setTiers((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleAddTier = () => {
    // Smart default: continue from previous tier's max
    const last = tiers[tiers.length - 1];
    const nextMin = last?.maxQuantity ? last.maxQuantity + 1 : 1;
    setTiers((prev) => [
      ...prev,
      {
        minQuantity: nextMin,
        maxQuantity: null,
        discountPercent: 0,
      },
    ]);
  };

  const handleRemoveTier = (idx: number) => {
    setTiers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (data: any) => {
    if (!data.name?.trim()) {
      message.error("Discount name is required");
      return;
    }

    if (tiers.length === 0) {
      message.error("Add at least one tier");
      return;
    }

    // Validate each tier
    for (let i = 0; i < tiers.length; i++) {
      const t = tiers[i];
      if (!t.minQuantity || t.minQuantity < 1) {
        message.error(`Tier ${i + 1}: Min quantity must be at least 1`);
        return;
      }
      if (
        t.maxQuantity !== null &&
        t.maxQuantity !== undefined &&
        t.maxQuantity < t.minQuantity
      ) {
        message.error(
          `Tier ${i + 1}: Max quantity must be greater than min quantity`,
        );
        return;
      }
      if (
        !t.discountPercent ||
        t.discountPercent <= 0 ||
        t.discountPercent > 100
      ) {
        message.error(
          `Tier ${i + 1}: Discount percent must be between 1 and 100`,
        );
        return;
      }
    }

    await onSubmit({
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      tiers: tiers.map((t) => ({
        minQuantity: Number(t.minQuantity),
        maxQuantity: t.maxQuantity === null ? null : Number(t.maxQuantity),
        discountPercent: Number(t.discountPercent),
      })),
      isActive: discount?.isActive ?? true,
    });
  };

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Bulk Discount" : "Create Bulk Discount"}
      width="max-w-2xl"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="discount-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#C70A24" }}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Discount"
                : "Create Discount"}
          </button>
        </div>
      }
    >
      <RmForm
        id="discount-form"
        onSubmit={handleSubmit}
        defaultValues={{
          name: discount?.name || "",
          description: discount?.description || "",
        }}
      >
        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
          <RmInput
            name="name"
            label="Discount Name"
            placeholder="e.g. Standard Bulk Discount"
            required
          />

          <RmInput
            name="description"
            label="Description"
            placeholder="e.g. Save more when you buy more peptides"
            type="textarea"
            rows={2}
          />

          {/* Tiers Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Discount Tiers <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Customer gets % discount when their cart matches the quantity
                  range
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddTier}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "#C70A24" }}
              >
                <Plus size={14} />
                Add Tier
              </button>
            </div>

            <div className="space-y-2">
              {tiers.map((tier, idx) => (
                <TierRow
                  key={idx}
                  tier={tier}
                  index={idx}
                  onChange={handleTierChange}
                  onRemove={handleRemoveTier}
                  canRemove={tiers.length > 1}
                />
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 mt-3">
              💡 Example: Buy 3–5 items = 10% off, Buy 6–9 items = 15% off, Buy
              10+ items = 20% off
            </div>
          </div>
        </div>
      </RmForm>
    </RmModal>
  );
};

// ─── Coupon Form Modal ────────────────────────────────────────
const CouponFormModal = ({
  isOpen,
  onClose,
  coupon,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  coupon?: Coupon | null;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const isEditing = !!coupon;

  const handleSubmit = async (data: any) => {
    if (!data.code?.trim()) {
      message.error("Coupon code is required");
      return;
    }
    if (
      !data.discountPercent ||
      Number(data.discountPercent) <= 0 ||
      Number(data.discountPercent) > 100
    ) {
      message.error("Discount must be between 1 and 100%");
      return;
    }

    await onSubmit({
      code: data.code.trim().toUpperCase(),
      discountPercent: Number(data.discountPercent),
      expiryDate: data.expiryDate || undefined,
      isActive: coupon?.isActive ?? true,
    });
  };

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Coupon" : "Create Coupon"}
      width="max-w-md"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="coupon-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#C70A24" }}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Coupon"
                : "Create Coupon"}
          </button>
        </div>
      }
    >
      <RmForm
        id="coupon-form"
        onSubmit={handleSubmit}
        defaultValues={{
          code: coupon?.code || "",
          discountPercent: coupon?.discountPercent || "",
          expiryDate: coupon?.expiryDate?.slice(0, 10) || "",
        }}
      >
        <div className="space-y-4">
          <RmInput
            name="code"
            label="Coupon Code"
            placeholder="e.g. SAVE10"
            required
            helpText="Customers enter this at checkout (auto-uppercased)"
          />

          <RmInput
            name="discountPercent"
            label="Discount Percentage (%)"
            type="number"
            placeholder="10"
            required
          />

          <RmInput
            name="expiryDate"
            label="Expiry Date"
            type="date"
            helpText="Leave empty for no expiry"
          />
        </div>
      </RmForm>
    </RmModal>
  );
};

// ─── Coupon Card ──────────────────────────────────────────────
// ─── Coupon Card (Compact) ────────────────────────────────────
const CouponCard = ({
  coupon,
  onEdit,
  onDelete,
  onToggle,
  isUpdating,
}: {
  coupon: Coupon;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  isUpdating: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    message.success(`Copied "${coupon.code}"`);
    setTimeout(() => setCopied(false), 2000);
  };

  const expired = coupon.expiryDate
    ? new Date(coupon.expiryDate) < new Date()
    : false;

  const daysUntilExpiry = coupon.expiryDate
    ? Math.ceil(
        (new Date(coupon.expiryDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-all relative ${
        !coupon.isActive || expired ? "opacity-75" : ""
      }`}
    >
      {/* Status pill */}
      <div className="absolute top-2 right-2 z-10">
        <StatusPill
          isActive={coupon.isActive && !expired}
          onToggle={onToggle}
          disabled={isUpdating}
        />
      </div>

      {/* Top: red header with code */}
      <div
        className="px-4 py-3 relative"
        style={{ backgroundColor: "#C70A24" }}
      >
        <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
          Promo Code
        </p>
        <div className="flex items-center gap-1 pr-16">
          <p className="text-white text-base font-bold font-mono tracking-wider line-clamp-1">
            {coupon.code}
          </p>
          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>

        {/* Decorative dots */}
        <div className="absolute -bottom-1.5 left-0 right-0 flex justify-between px-1">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
          ))}
        </div>
      </div>

      {/* Discount + Expiry combined */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-baseline gap-1">
          <p className="text-3xl font-bold text-gray-900 leading-none">
            {coupon.discountPercent}
          </p>
          <span className="text-base text-gray-400 font-semibold">%</span>
          <span className="text-xs text-gray-500 uppercase ml-1">off</span>
        </div>

        {coupon.expiryDate && (
          <div className="flex items-center gap-1 mt-2 text-[11px]">
            <Calendar size={10} className="text-gray-400 flex-shrink-0" />
            {expired ? (
              <span className="text-red-600 font-semibold">Expired</span>
            ) : daysUntilExpiry !== null && daysUntilExpiry <= 7 ? (
              <span className="text-yellow-600 font-semibold">
                Expires in {daysUntilExpiry}d
              </span>
            ) : (
              <span className="text-gray-500">
                Until {new Date(coupon.expiryDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 py-2 border-t border-gray-100 flex gap-1.5 bg-gray-50">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Edit size={12} />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-red-600 border border-red-200 bg-white hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  );
};

// ─── Delete Confirmation Modal ────────────────────────────────
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  itemName,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}) => (
  <RmModal
    isOpen={isOpen}
    onClose={onClose}
    title="Delete Item"
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
        <span className="font-semibold text-gray-900">{itemName}</span>? This
        action cannot be undone.
      </p>
    </div>
  </RmModal>
);

// ─── Main Page ────────────────────────────────────────────────
export default function DiscountsCouponsPage() {
  // ─── Modal state ─────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"discounts" | "coupons">(
    "discounts",
  );
  const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [isDiscountFormOpen, setIsDiscountFormOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<BulkDiscount | null>(
    null,
  );

  const [deleteTarget, setDeleteTarget] = useState<{
    type: "coupon" | "discount";
    id: string;
    name: string;
  } | null>(null);

  // ─── API hooks ───────────────────────────────────────────────
  const { data: couponsData, isLoading: isLoadingCoupons } =
    useGetAllCouponsAdminQuery({});
  const { data: discountsData, isLoading: isLoadingDiscounts } =
    useGetAllDiscountsAdminQuery({});

  const [createCoupon, { isLoading: isCreatingCoupon }] =
    useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdatingCoupon }] =
    useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: isDeletingCoupon }] =
    useDeleteCouponMutation();

  const [createDiscount, { isLoading: isCreatingDiscount }] =
    useCreateDiscountMutation();
  const [updateDiscount, { isLoading: isUpdatingDiscount }] =
    useUpdateDiscountMutation();
  const [deleteDiscount, { isLoading: isDeletingDiscount }] =
    useDeleteDiscountMutation();

  const coupons: Coupon[] = couponsData?.data || [];
  const discounts: BulkDiscount[] = discountsData?.data || [];

  // ─── KPIs ────────────────────────────────────────────────────
  const kpis = {
    totalOffers: coupons.length + discounts.length,
    activeCoupons: coupons.filter(
      (c) =>
        c.isActive && (!c.expiryDate || new Date(c.expiryDate) >= new Date()),
    ).length,
    totalTiers: discounts.reduce((sum, d) => sum + (d.tiers?.length || 0), 0),
    activeBulkDiscounts: discounts.filter((d) => d.isActive).length,
  };

  // ─── Coupon handlers ─────────────────────────────────────────
  const handleCouponSubmit = async (data: any) => {
    try {
      if (editingCoupon) {
        await updateCoupon({ id: editingCoupon._id, data }).unwrap();
        message.success("Coupon updated successfully!");
      } else {
        await createCoupon(data).unwrap();
        message.success("Coupon created successfully!");
      }
      setIsCouponFormOpen(false);
      setEditingCoupon(null);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to save coupon",
      );
    }
  };

  const handleToggleCouponStatus = async (coupon: Coupon) => {
    try {
      await updateCoupon({
        id: coupon._id,
        data: { isActive: !coupon.isActive },
      }).unwrap();
      message.success(
        `Coupon ${!coupon.isActive ? "activated" : "deactivated"}`,
      );
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update status");
    }
  };

  // ─── Discount handlers ───────────────────────────────────────
  const handleDiscountSubmit = async (data: any) => {
    try {
      if (editingDiscount) {
        await updateDiscount({ id: editingDiscount._id, data }).unwrap();
        message.success("Bulk discount updated successfully!");
      } else {
        await createDiscount(data).unwrap();
        message.success("Bulk discount created successfully!");
      }
      setIsDiscountFormOpen(false);
      setEditingDiscount(null);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to save discount",
      );
    }
  };

  const handleToggleDiscountStatus = async (discount: BulkDiscount) => {
    try {
      await updateDiscount({
        id: discount._id,
        data: { isActive: !discount.isActive },
      }).unwrap();
      message.success(
        `Discount ${!discount.isActive ? "activated" : "deactivated"}`,
      );
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update status");
    }
  };

  // ─── Delete handler ──────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "coupon") {
        await deleteCoupon(deleteTarget.id).unwrap();
        message.success("Coupon deleted");
      } else {
        await deleteDiscount(deleteTarget.id).unwrap();
        message.success("Bulk discount deleted");
      }
      setDeleteTarget(null);
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete");
    }
  };

  // ─── Bulk Discount Table Columns ────────────────────────────
  const discountColumns = [
    {
      key: "name",
      title: "Name",
      render: (d: BulkDiscount) => (
        <div className="min-w-[160px]">
          <p className="font-semibold text-gray-900">{d.name}</p>
          {d.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
              {d.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "tiers",
      title: "Tiers",
      render: (d: BulkDiscount) => (
        <div className="flex flex-wrap gap-1.5">
          {d.tiers?.map((t, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700"
              title={`Buy ${t.minQuantity}${
                t.maxQuantity ? `–${t.maxQuantity}` : "+"
              } items → ${t.discountPercent}% off`}
            >
              <span>
                {t.minQuantity}
                {t.maxQuantity ? `–${t.maxQuantity}` : "+"}
              </span>
              <span className="text-gray-400">→</span>
              <span className="text-red-600 font-bold">
                {t.discountPercent}%
              </span>
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "tierCount",
      title: "# Tiers",
      align: "center" as const,
      render: (d: BulkDiscount) => (
        <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
          {d.tiers?.length || 0}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (d: BulkDiscount) => (
        <StatusPill
          isActive={d.isActive}
          onToggle={() => handleToggleDiscountStatus(d)}
          disabled={isUpdatingDiscount}
        />
      ),
    },
    {
      key: "actions",
      title: "Actions",
      align: "right" as const,
      render: (d: BulkDiscount) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setEditingDiscount(d);
              setIsDiscountFormOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Edit size={14} />
            Edit
          </button>
          <button
            onClick={() =>
              setDeleteTarget({
                type: "discount",
                id: d._id,
                name: d.name,
              })
            }
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discounts & Coupons
          </h1>
          <p className="text-gray-600">
            Manage promotional offers and customer discounts
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Offers"
          value={kpis.totalOffers}
          icon={Tag}
          color="#3b82f6"
        />
        <KPICard
          title="Active Coupons"
          value={kpis.activeCoupons}
          icon={Ticket}
          color="#10b981"
        />
        <KPICard
          title="Bulk Tiers"
          value={kpis.totalTiers}
          icon={Percent}
          color="#f59e0b"
        />
        <KPICard
          title="Active Bulk Discounts"
          value={kpis.activeBulkDiscounts}
          icon={Gift}
          color="#a855f7"
        />
      </div>

      {/* ─── Bulk Discounts Section ───────────────────── */}
      {/* ─── Tabs ─────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("discounts")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "discounts"
                ? "border-[#C70A24] text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Bulk Discounts ({discounts.length})
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "coupons"
                ? "border-[#C70A24] text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Coupons ({coupons.length})
          </button>
        </div>

        {/* Active tab's create button */}
        {activeTab === "discounts" ? (
          <button
            onClick={() => {
              setEditingDiscount(null);
              setIsDiscountFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer mb-2"
            style={{ backgroundColor: "#C70A24" }}
          >
            <Plus size={18} />
            Create Bulk Discount
          </button>
        ) : (
          <button
            onClick={() => {
              setEditingCoupon(null);
              setIsCouponFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer mb-2"
            style={{ backgroundColor: "#10b981" }}
          >
            <Plus size={18} />
            Create Coupon
          </button>
        )}
      </div>

      {/* ─── Active Tab Content ─────────────────────── */}
      {activeTab === "discounts" ? (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Quantity-based tiered discounts applied automatically at checkout
          </p>
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <RmTable
              columns={discountColumns}
              data={discounts}
              loading={isLoadingDiscounts}
              emptyText="No bulk discounts yet. Click 'Create Bulk Discount' to set up tiered discounts."
            />
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Promo codes customers can enter at checkout
          </p>

          {isLoadingCoupons ? (
            <div className="bg-white rounded-lg border border-gray-100 py-12 flex justify-center">
              <p className="text-gray-400 text-sm animate-pulse">
                Loading coupons...
              </p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
              <Gift size={48} className="mx-auto text-gray-300 mb-3 stroke-1" />
              <p className="text-gray-500 mb-1">No coupons yet</p>
              <p className="text-sm text-gray-400">
                Click &quot;Create Coupon&quot; to add your first promo code
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {coupons.map((coupon) => (
                <CouponCard
                  key={coupon._id}
                  coupon={coupon}
                  onEdit={() => {
                    setEditingCoupon(coupon);
                    setIsCouponFormOpen(true);
                  }}
                  onDelete={() =>
                    setDeleteTarget({
                      type: "coupon",
                      id: coupon._id,
                      name: coupon.code,
                    })
                  }
                  onToggle={() => handleToggleCouponStatus(coupon)}
                  isUpdating={isUpdatingCoupon}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Modals ─────────────────────────────────── */}
      <BulkDiscountFormModal
        isOpen={isDiscountFormOpen}
        onClose={() => {
          setIsDiscountFormOpen(false);
          setEditingDiscount(null);
        }}
        discount={editingDiscount}
        onSubmit={handleDiscountSubmit}
        isSubmitting={isCreatingDiscount || isUpdatingDiscount}
      />

      <CouponFormModal
        isOpen={isCouponFormOpen}
        onClose={() => {
          setIsCouponFormOpen(false);
          setEditingCoupon(null);
        }}
        coupon={editingCoupon}
        onSubmit={handleCouponSubmit}
        isSubmitting={isCreatingCoupon || isUpdatingCoupon}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        itemName={deleteTarget?.name || ""}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeletingCoupon || isDeletingDiscount}
      />
    </div>
  );
}
