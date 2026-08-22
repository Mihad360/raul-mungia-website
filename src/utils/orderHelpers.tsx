/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Clock,
  CreditCard,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Hourglass,
  ShieldQuestion,
  Pickaxe,
} from "lucide-react";

export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "processing"
  | "ready_for_pickup"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  /** @deprecated Never set by backend — kept for legacy badge fallback */
  | "paid";

export type PaymentStatus =
  | "pending"
  | "awaiting_confirmation"
  | "paid"
  | "refunded"
  | "failed"
  /** @deprecated Never set by backend — kept for legacy badge fallback */
  | "unpaid";

export const orderStatusConfig: Record<
  OrderStatus,
  { bg: string; text: string; label: string; icon: any }
> = {
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    label: "Pending",
    icon: Clock,
  },
  awaiting_payment: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    label: "Awaiting Payment",
    icon: Hourglass,
  },
  paid: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    label: "Paid",
    icon: CreditCard,
  },
  processing: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    label: "Processing",
    icon: Package,
  },
  ready_for_pickup: {
    label: "Ready for Pickup",
    bg: "bg-amber-100",
    text: "text-amber-800",
    icon: Pickaxe,
  },
  shipped: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    label: "Shipped",
    icon: Truck,
  },
  delivered: {
    bg: "bg-green-50",
    text: "text-green-700",
    label: "Delivered",
    icon: CheckCircle2,
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    label: "Cancelled",
    icon: XCircle,
  },
  refunded: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Refunded",
    icon: RotateCcw,
  },
};

export const paymentStatusConfig: Record<
  PaymentStatus,
  { bg: string; text: string; label: string }
> = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Pending" },
  unpaid: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Unpaid" },
  awaiting_confirmation: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    label: "Awaiting Payment",
  },
  paid: { bg: "bg-green-50", text: "text-green-700", label: "Paid" },
  refunded: { bg: "bg-gray-100", text: "text-gray-700", label: "Refunded" },
  failed: { bg: "bg-red-50", text: "text-red-700", label: "Failed" },
};

export const OrderStatusBadge = ({
  status,
  size = "md",
}: {
  status: OrderStatus;
  size?: "sm" | "md";
}) => {
  const cfg = orderStatusConfig[status] || orderStatusConfig.pending;
  const Icon = cfg.icon;
  const sizeCls =
    size === "sm"
      ? "px-2 py-0.5 text-[10px] gap-1"
      : "px-2.5 py-1 text-xs gap-1.5";
  const iconSize = size === "sm" ? 10 : 12;

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${cfg.bg} ${cfg.text} ${sizeCls}`}
    >
      <Icon size={iconSize} />
      {cfg.label}
    </span>
  );
};

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const cfg = paymentStatusConfig[status] || paymentStatusConfig.unpaid;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
};

export const FulfillmentBadge = ({ type }: { type: "pickup" | "shipping" }) => {
  const isPickup = type === "pickup";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
        isPickup
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-blue-50 text-blue-700 border border-blue-200"
      }`}
    >
      {isPickup ? "🏠 Pickup" : "📦 Ship"}
    </span>
  );
};

export const canCancelOrder = (status: string): boolean => {
  return ["pending", "awaiting_payment"].includes(status);
};

// ─── Payment State Logic ──────────────────────────────────────
export type PaymentAlertType =
  | "needs_payment" // manual method, not paid yet → show Venmo/Cash App/Zelle details
  | "verifying" // reserved (legacy)
  | "paid" // all good
  | "none"; // automated method or cancelled/refunded

const isManualMethod = (method: any): boolean => {
  if (!method) return false;
  return method.isAutomated === false;
};

/**
 * Manual checkout payment is not completed at place-order time.
 * Backend often stores paymentStatus as "awaiting_confirmation" immediately,
 * so we still treat that as "needs payment" until status becomes "paid".
 */
export const getPaymentAlertType = (order: any): PaymentAlertType => {
  if (!order?.paymentMethod) return "none";
  if (["cancelled", "refunded"].includes(order.status)) return "none";
  if (order.paymentStatus === "paid") return "paid";
  if (["refunded", "failed"].includes(order.paymentStatus)) return "none";

  if (isManualMethod(order.paymentMethod)) {
    return "needs_payment";
  }

  return "none";
};

export const formatDate = (iso?: string): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatDateShort = (iso?: string): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Re-export icon used in panels
export { ShieldQuestion };
