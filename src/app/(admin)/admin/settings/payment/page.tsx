/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  CreditCard,
  AlertCircle,
  Loader2,
  Wallet,
  Smartphone,
  Banknote,
  ArrowDownAZ,
  ArrowUpAZ,
} from "lucide-react";
import { message } from "antd";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";
import {
  useGetAllPaymentMethodsAdminQuery,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} from "@/redux/api/adminApi";

// ─── Types ────────────────────────────────────────────────────
type PaymentMethod = {
  _id: string;
  type: string;
  displayName: string;
  description: string;
  isAutomated: boolean;
  handle: string;
  instructionsForCustomer: string;
  displayOrder: number;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── Helpers ──────────────────────────────────────────────────
const getTypeIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t === "crypto") return Wallet;
  if (t === "echeck") return Banknote;
  if (["venmo", "cashapp", "zelle"].includes(t)) return Smartphone;
  return CreditCard;
};

const getTypeColor = (type: string): string => {
  const t = type.toLowerCase();
  if (t === "crypto") return "#f59e0b";
  if (t === "echeck") return "#10b981";
  if (t === "venmo") return "#3b82f6";
  if (t === "cashapp") return "#22c55e";
  if (t === "zelle") return "#a855f7";
  return "#6b7280";
};

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
    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-50 ${
      isActive
        ? "bg-green-50 text-green-700 hover:bg-green-100"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </button>
);

// ─── Payment Method Card ──────────────────────────────────────
const PaymentMethodCard = ({
  method,
  onEdit,
  onDelete,
  onToggle,
  isUpdating,
}: {
  method: PaymentMethod;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  isUpdating: boolean;
}) => {
  const Icon = getTypeIcon(method.type);
  const color = getTypeColor(method.type);

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-all">
      {/* Top: Icon + Order */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          <Icon size={20} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 font-mono">
            #{method.displayOrder}
          </span>
          <StatusPill
            isActive={method.isActive}
            onToggle={onToggle}
            disabled={isUpdating}
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 text-base line-clamp-1 mb-1">
        {method.displayName}
      </h3>

      {/* Type + Auto badge */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-600">
          {method.type}
        </span>
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
            method.isAutomated
              ? "bg-blue-50 text-blue-700"
              : "bg-orange-50 text-orange-700"
          }`}
        >
          {method.isAutomated ? "Automated" : "Manual"}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
        {method.description}
      </p>

      {/* Handle (if manual) */}
      {!method.isAutomated && method.handle && (
        <p className="text-xs font-mono text-[#C70A24] mb-3 truncate">
          {method.handle}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-1.5 pt-3 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Edit size={12} />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  );
};

// ─── Edit Modal ───────────────────────────────────────────────
const PaymentMethodEditModal = ({
  isOpen,
  onClose,
  method,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  method: PaymentMethod | null;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const [isAutomated, setIsAutomated] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && method) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAutomated(method.isAutomated);
      setIsActive(method.isActive);
    }
  }, [isOpen, method]);

  if (!method) return null;

  const handleSubmit = async (data: any) => {
    if (!data.displayName?.trim()) {
      message.error("Display name is required");
      return;
    }

    await onSubmit({
      displayName: data.displayName.trim(),
      description: data.description?.trim() || "",
      isAutomated,
      handle: isAutomated ? "" : data.handle?.trim() || "",
      instructionsForCustomer: isAutomated
        ? ""
        : data.instructionsForCustomer?.trim() || "",
      displayOrder: Number(data.displayOrder) || 0,
      isActive,
    });
  };

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${method.displayName}`}
      width="max-w-lg"
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
            form="payment-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#C70A24" }}
          >
            {isSubmitting ? "Saving..." : "Update Method"}
          </button>
        </div>
      }
    >
      <RmForm
        id="payment-form"
        onSubmit={handleSubmit}
        defaultValues={{
          displayName: method.displayName || "",
          description: method.description || "",
          handle: method.handle || "",
          instructionsForCustomer: method.instructionsForCustomer || "",
          displayOrder: method.displayOrder ?? 0,
        }}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Type display (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <input
              type="text"
              value={method.type.toUpperCase()}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 cursor-not-allowed font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">Type cannot be changed</p>
          </div>

          <RmInput
            name="displayName"
            label="Display Name"
            placeholder="e.g. Venmo"
            required
          />

          <RmInput
            name="description"
            label="Description"
            type="textarea"
            placeholder="Brief description shown at checkout"
            rows={2}
          />

          <RmInput
            name="displayOrder"
            label="Display Order"
            type="number"
            placeholder="1"
          />

          {/* Automated toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Automated</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Processed by payment gateway vs. manual confirmation
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAutomated(!isAutomated)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                isAutomated ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAutomated ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Manual-only fields */}
          {!isAutomated && (
            <>
              <RmInput
                name="handle"
                label="Handle / Account"
                placeholder="e.g. @raul-peptides"
                helpText="Customer sends payment to this handle"
              />

              <RmInput
                name="instructionsForCustomer"
                label="Instructions for Customer"
                type="textarea"
                placeholder="Step-by-step payment instructions..."
                rows={4}
              />
            </>
          )}

          {/* Active toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Active</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Show this payment method at checkout
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                isActive ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </RmForm>
    </RmModal>
  );
};

// ─── Delete Confirmation Modal ────────────────────────────────
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  methodName,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  methodName: string;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}) => (
  <RmModal
    isOpen={isOpen}
    onClose={onClose}
    title="Delete Payment Method"
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
        <span className="font-semibold text-gray-900">{methodName}</span>? This
        action cannot be undone.
      </p>
    </div>
  </RmModal>
);

// ─── Main Page ────────────────────────────────────────────────
export default function PaymentMethodPage() {
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // API
  const { data: methodsResponse, isLoading } =
    useGetAllPaymentMethodsAdminQuery({});
  const [updateMethod, { isLoading: isUpdating }] =
    useUpdatePaymentMethodMutation();
  const [deleteMethod, { isLoading: isDeleting }] =
    useDeletePaymentMethodMutation();

  const methodsRaw: PaymentMethod[] = methodsResponse?.data || [];
  const meta = methodsResponse?.meta || { total: methodsRaw.length };

  // Sort by displayOrder
  const methods = [...methodsRaw].sort((a, b) =>
    sortAsc ? a.displayOrder - b.displayOrder : b.displayOrder - a.displayOrder,
  );

  // Handlers
  const handleUpdate = async (data: any) => {
    if (!editingMethod) return;
    try {
      await updateMethod({ id: editingMethod._id, body: data }).unwrap();
      message.success("Payment method updated!");
      setIsEditOpen(false);
      setEditingMethod(null);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to update method",
      );
    }
  };

  const handleToggleStatus = async (method: PaymentMethod) => {
    try {
      await updateMethod({
        id: method._id,
        body: { isActive: !method.isActive },
      }).unwrap();
      message.success(
        `${method.displayName} ${!method.isActive ? "activated" : "deactivated"}`,
      );
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMethod(deleteTarget._id).unwrap();
      message.success("Payment method deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Methods
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
              Total: {meta.total ?? 0}
            </span>
          </div>
          <p className="text-gray-600">Manage checkout payment options</p>
        </div>

        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {sortAsc ? <ArrowDownAZ size={14} /> : <ArrowUpAZ size={14} />}
          Order
        </button>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-100 py-20 flex justify-center">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      ) : methods.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <CreditCard
            size={48}
            className="mx-auto text-gray-300 mb-3 stroke-1"
          />
          <p className="text-gray-500">No payment methods configured</p>
          <p className="text-sm text-gray-400 mt-1">
            Payment methods are seeded from the backend.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {methods.map((method) => (
            <PaymentMethodCard
              key={method._id}
              method={method}
              onEdit={() => {
                setEditingMethod(method);
                setIsEditOpen(true);
              }}
              onDelete={() => setDeleteTarget(method)}
              onToggle={() => handleToggleStatus(method)}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <PaymentMethodEditModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingMethod(null);
        }}
        method={editingMethod}
        onSubmit={handleUpdate}
        isSubmitting={isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        methodName={deleteTarget?.displayName || ""}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
