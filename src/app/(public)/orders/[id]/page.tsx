/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  XCircle,
  ExternalLink,
  Copy,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import RmModal from "@/components/ui/RmModal";
import {
  useGetMySingleOrderQuery,
  useCancelMyOrderMutation,
} from "@/redux/api/orderApi";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  formatDate,
  formatDateShort,
  canCancelOrder,
} from "@/utils/orderHelpers";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: orderResponse, isLoading } = useGetMySingleOrderQuery(id);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelMyOrderMutation();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const order: any = orderResponse?.data;

  const copyText = (text: string, label = "Text") => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    try {
      await cancelOrder({ id, reason: cancelReason.trim() }).unwrap();
      toast.success("Order cancelled successfully");
      setIsCancelModalOpen(false);
      setCancelReason("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel order");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order not found
        </h2>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg text-white font-semibold"
          style={{ backgroundColor: "#C70A24" }}
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  const isCancelEligible = canCancelOrder(order.status);
  const isManualPaymentPending =
    !order.paymentMethod?.isAutomated && order.paymentStatus === "unpaid";

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Back link */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to My Orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-mono mb-2">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-gray-500">
            Placed {formatDate(order.createdAt)}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        {isCancelEligible && (
          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <XCircle size={16} />
            Cancel Order
          </button>
        )}
      </div>

      {/* Cancellation banner if cancelled */}
      {order.status === "cancelled" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Order Cancelled</p>
            {order.cancellationReason && (
              <p className="text-sm text-red-700 mt-0.5">
                Reason: {order.cancellationReason}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Manual payment pending banner */}
      {isManualPaymentPending && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-yellow-700 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900 mb-1">
                Payment Pending
              </h3>
              <p className="text-sm text-yellow-800 mb-3">
                Please send <strong>${order.total?.toFixed(2)}</strong> via{" "}
                {order.paymentMethod.displayName} to{" "}
                <span className="font-mono font-bold">
                  {order.paymentMethod.handle}
                </span>{" "}
                with note{" "}
                <span className="font-mono font-bold">{order.orderNumber}</span>
                .
              </p>
              <button
                onClick={() => copyText(order.paymentMethod.handle, "Handle")}
                className="text-xs font-semibold text-yellow-900 underline hover:no-underline cursor-pointer"
              >
                Copy handle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Timeline */}
      <StatusTimeline order={order} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items + Tracking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Section
            title="Items"
            icon={<Package size={18} />}
            count={order.items?.length}
          >
            <div className="space-y-4">
              {order.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    {item.mainImage ? (
                      <Image
                        src={item.mainImage}
                        alt={item.productName}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    ) : (
                      <Package size={20} className="text-gray-300 m-auto" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {item.productCode}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {item.size} · Qty: {item.quantity} · $
                      {item.priceAtPurchase?.toFixed(2)} each
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">
                    ${item.lineTotal?.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* Tracking */}
          {order.trackingNumber && (
            <Section title="Tracking" icon={<Truck size={18} />}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Tracking Number
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-gray-900">
                        {order.trackingNumber}
                      </p>
                      <button
                        onClick={() =>
                          copyText(order.trackingNumber, "Tracking")
                        }
                        className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <Copy size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <a
                    href={`https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#C70A24" }}
                  >
                    Track on FedEx
                    <ExternalLink size={12} />
                  </a>
                </div>
                <div className="text-xs text-gray-500">
                  Shipped via {order.shippingMethod}
                  {order.shippedAt && ` on ${formatDateShort(order.shippedAt)}`}
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* Right: Sidebar (Pricing, Address, Payment) */}
        <div className="space-y-6">
          {/* Pricing */}
          <Section title="Pricing">
            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={`$${order.subtotal?.toFixed(2)}`} />
              {order.bulkDiscountAmount > 0 && (
                <Row
                  label={`Bulk Discount (${order.appliedDiscount?.discountPercent}%)`}
                  value={`−$${order.bulkDiscountAmount.toFixed(2)}`}
                  green
                />
              )}
              {order.couponDiscountAmount > 0 && (
                <Row
                  label={`Coupon (${order.appliedCoupon?.code})`}
                  value={`−$${order.couponDiscountAmount.toFixed(2)}`}
                  green
                />
              )}
              <Row
                label="Shipping"
                value={
                  order.shippingCost === 0
                    ? "FREE"
                    : `$${order.shippingCost?.toFixed(2)}`
                }
              />
              <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </Section>

          {/* Shipping Address */}
          <Section title="Shipping Address" icon={<MapPin size={18} />}>
            <div className="text-sm text-gray-700 space-y-0.5">
              <p className="font-semibold text-gray-900">
                {order.shippingAddress?.fullName}
              </p>
              <p>{order.shippingAddress?.street}</p>
              {order.shippingAddress?.apartment && (
                <p>{order.shippingAddress.apartment}</p>
              )}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="pt-2 text-xs text-gray-500">
                {order.shippingAddress?.email}
              </p>
              <p className="text-xs text-gray-500">
                {order.shippingAddress?.phone}
              </p>
            </div>
          </Section>

          {/* Payment Method */}
          <Section title="Payment Method" icon={<CreditCard size={18} />}>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">
                {order.paymentMethod?.displayName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {order.paymentMethod?.type}
              </p>
              {order.paymentMethod?.handle && (
                <p className="text-xs font-mono text-gray-700 mt-2">
                  {order.paymentMethod.handle}
                </p>
              )}
            </div>
          </Section>

          {/* Customer Note */}
          {order.customerNote && (
            <Section title="Your Note">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {order.customerNote}
              </p>
            </Section>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <RmModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setCancelReason("");
        }}
        title="Cancel Order"
        width="max-w-md"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsCancelModalOpen(false);
                setCancelReason("");
              }}
              disabled={isCancelling}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Keep Order
            </button>
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="flex-1 py-2.5 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isCancelling ? "Cancelling..." : "Confirm Cancel"}
            </button>
          </div>
        }
      >
        <div className="py-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertCircle
              size={16}
              className="text-yellow-700 mt-0.5 flex-shrink-0"
            />
            <p className="text-xs text-yellow-800">
              Cancelling cannot be undone. Refunds (if applicable) will be
              processed within 5-10 business days.
            </p>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for cancellation <span className="text-red-500">*</span>
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Please tell us why you're cancelling..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 resize-none"
          />
        </div>
      </RmModal>
    </div>
  );
}

// ─── Status Timeline ──────────────────────────────────────────
const StatusTimeline = ({ order }: { order: any }) => {
  if (order.status === "cancelled" || order.status === "refunded") return null;

  const steps = [
    { key: "placed", label: "Placed", date: order.createdAt },
    { key: "paid", label: "Paid", date: order.paidAt },
    { key: "shipped", label: "Shipped", date: order.shippedAt },
    { key: "delivered", label: "Delivered", date: order.deliveredAt },
  ];

  // Determine which step we're at
  const currentStepIndex = steps.findIndex((s) => !s.date);
  const activeIndex =
    currentStepIndex === -1 ? steps.length - 1 : currentStepIndex - 1;

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-0">
          <div
            className="h-full transition-all"
            style={{
              backgroundColor: "#C70A24",
              width: `${(activeIndex / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx <= activeIndex;
          return (
            <div
              key={step.key}
              className="flex flex-col items-center gap-2 relative z-10"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompleted ? "" : "bg-white border-2 border-gray-200"
                }`}
                style={isCompleted ? { backgroundColor: "#C70A24" } : undefined}
              >
                {isCompleted && (
                  <CheckCircle2 size={14} className="text-white" />
                )}
              </div>
              <div className="text-center">
                <p
                  className={`text-xs font-semibold ${
                    isCompleted ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {formatDateShort(step.date)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Helper components ────────────────────────────────────────
const Section = ({
  title,
  icon,
  count,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  count?: number;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
    <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
      {icon}
      <h2 className="font-semibold text-gray-900">{title}</h2>
      {count !== undefined && (
        <span className="ml-auto text-xs text-gray-500">{count} items</span>
      )}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Row = ({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) => (
  <div
    className={`flex justify-between ${green ? "text-green-600" : "text-gray-600"}`}
  >
    <span>{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);
