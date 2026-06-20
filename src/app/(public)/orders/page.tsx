/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Search,
  Calendar,
  Loader2,
  Eye,
  Sparkles,
  AlertCircle,
  Copy,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import RmPagination from "@/components/ui/RmPagination";
import {
  useGetMyOrdersQuery,
  useGetMyLatestOrderQuery,
} from "@/redux/api/orderApi";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  formatDateShort,
  formatDate,
  getPaymentAlertType,
  OrderStatus,
} from "@/utils/orderHelpers";

const STATUS_FILTERS: (
  | { value: ""; label: string }
  | { value: OrderStatus; label: string }
)[] = [
  { value: "", label: "All" },
  { value: "awaiting_payment", label: "Awaiting Payment" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function MyOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ordersResponse, isLoading: ordersLoading } =
    useGetMyOrdersQuery({
      page: currentPage,
      limit: 10,
      status: statusFilter || undefined,
      searchTerm: searchQuery || undefined,
    });

  const { data: latestResponse, isLoading: latestLoading } =
    useGetMyLatestOrderQuery(undefined);

  const orders: any[] = ordersResponse?.data || [];
  const meta = ordersResponse?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };
  const latestOrder: any = latestResponse?.data;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">My Orders</h1>
          <p className="text-gray-600 text-sm">
            {meta.total} total order{meta.total !== 1 ? "s" : ""} ·{" "}
            <span className="text-gray-400">
              Track, manage, and review your purchases
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ═════════ LEFT — Orders Table ═════════ */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-gray-100 p-4 space-y-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by order number or tracking number..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value || "all"}
                  onClick={() => {
                    setStatusFilter(f.value);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                    statusFilter === f.value
                      ? "text-white"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                  style={
                    statusFilter === f.value
                      ? { backgroundColor: "#C70A24" }
                      : undefined
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {ordersLoading ? (
            <div className="bg-white rounded-lg border border-gray-100 py-20 flex justify-center">
              <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
              <Package
                size={48}
                className="mx-auto text-gray-300 mb-3 stroke-1"
              />
              <p className="text-gray-500 mb-1">
                {statusFilter || searchQuery
                  ? "No orders match your filters"
                  : "You haven't placed any orders yet"}
              </p>
              {!statusFilter && !searchQuery && (
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#C70A24" }}
                >
                  Start Shopping
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                  <div className="col-span-5">Order</div>
                  <div className="col-span-2 text-center">Items</div>
                  <div className="col-span-2 text-right">Total</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-1 text-center">View</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <OrderTableRow key={order._id} order={order} />
                  ))}
                </div>
              </div>

              {meta.totalPage > 1 && (
                <div className="flex justify-center">
                  <RmPagination
                    currentPage={currentPage}
                    totalPages={meta.totalPage}
                    onPageChange={setCurrentPage}
                    showFirstLast
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* ═════════ RIGHT — Latest Order Panel ═════════ */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            {latestLoading ? (
              <div className="bg-white rounded-lg border border-gray-100 py-20 flex justify-center">
                <Loader2 size={28} className="animate-spin text-gray-400" />
              </div>
            ) : !latestOrder ? (
              <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
                <Sparkles
                  size={36}
                  className="mx-auto text-gray-300 mb-2 stroke-1"
                />
                <p className="text-sm text-gray-500">No orders yet</p>
              </div>
            ) : (
              <LatestOrderPanel order={latestOrder} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Table Row ─────────────────────────────────────────────────
const OrderTableRow = ({ order }: { order: any }) => {
  const firstItem = order.items?.[0];

  return (
    <Link
      href={`/orders/${order._id}`}
      className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-gray-50 transition-colors items-center cursor-pointer group"
    >
      <div className="col-span-5 flex items-center gap-3 min-w-0">
        <div className="relative w-10 h-10 bg-gray-50 rounded overflow-hidden flex-shrink-0">
          {firstItem?.mainImage ? (
            <Image
              src={firstItem.mainImage}
              alt={firstItem.productName}
              fill
              className="object-contain p-0.5"
              sizes="40px"
            />
          ) : (
            <Package
              size={18}
              className="text-gray-300 absolute inset-0 m-auto"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-mono font-semibold text-gray-900 text-xs truncate">
            {order.orderNumber}
          </p>
          <p className="text-[11px] text-gray-500 flex items-center gap-1">
            <Calendar size={9} />
            {formatDateShort(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="col-span-2 text-center">
        <p className="text-sm font-medium text-gray-900">
          {order.totalQuantity}
        </p>
        <p className="text-[10px] text-gray-500">
          {order.items?.length || 1}{" "}
          {order.items?.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="col-span-2 text-right">
        <p className="font-bold text-gray-900 text-sm">
          ${order.total?.toFixed(2)}
        </p>
      </div>

      <div className="col-span-2 flex justify-center">
        <OrderStatusBadge status={order.status} size="sm" />
      </div>

      <div className="col-span-1 flex justify-center">
        <Eye
          size={14}
          className="text-gray-300 group-hover:text-[#C70A24] transition-colors"
        />
      </div>
    </Link>
  );
};

// ─── Latest Order Panel ───────────────────────────────────────
const LatestOrderPanel = ({ order }: { order: any }) => {
  const alertType = getPaymentAlertType(order);

  const copyText = (text: string, label = "Text") => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <div className="space-y-3">
      {/* Header Card with gradient */}
      <div
        className="rounded-lg p-5 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #C70A24 0%, #9d0820 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <Sparkles size={14} />
            <p className="text-[11px] uppercase tracking-wide font-semibold">
              Latest Order
            </p>
          </div>
          <p className="text-xs opacity-80 mb-1">Order Number</p>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xl font-bold font-mono">{order.orderNumber}</p>
            <button
              onClick={() => copyText(order.orderNumber, "Order number")}
              className="p-1 rounded hover:bg-white/10 cursor-pointer"
            >
              <Copy size={12} />
            </button>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-80">{formatDate(order.createdAt)}</span>
            <span className="font-bold text-base">
              ${order.total?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex gap-2 flex-wrap">
        <OrderStatusBadge status={order.status} />
        <PaymentStatusBadge status={order.paymentStatus} />
      </div>

      {/* Status Timeline */}
      {!["cancelled", "refunded"].includes(order.status) && (
        <CompactTimeline order={order} />
      )}

      {/* Cancellation banner */}
      {order.status === "cancelled" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
          <p className="font-semibold mb-0.5">Order Cancelled</p>
          {order.cancellationReason && (
            <p className="text-[11px]">{order.cancellationReason}</p>
          )}
        </div>
      )}

      {/* ─── PAYMENT ALERTS ──────────────────────────────────── */}

      {/* Needs Payment — customer must send money */}
      {alertType === "needs_payment" && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle
              size={14}
              className="text-yellow-700 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-xs font-bold text-yellow-900">
                Complete Your Payment
              </p>
              <p className="text-[11px] text-yellow-800 mt-0.5">
                Send <strong>${order.total?.toFixed(2)}</strong> via{" "}
                {order.paymentMethod.displayName}
              </p>
            </div>
          </div>

          <div className="bg-white rounded p-2 space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Handle:</span>
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold">
                  {order.paymentMethod.handle}
                </span>
                <button
                  onClick={() => copyText(order.paymentMethod.handle, "Handle")}
                  className="p-0.5 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <Copy size={10} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Memo:</span>
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold">{order.orderNumber}</span>
                <button
                  onClick={() => copyText(order.orderNumber, "Memo")}
                  className="p-0.5 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <Copy size={10} />
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-yellow-800 mt-2 italic">
            ⏱ Include order number in payment note. We verify within 24 hours.
          </p>
        </div>
      )}

      {/* Verifying — payment sent, awaiting admin confirmation */}
      {alertType === "verifying" && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Clock
              size={14}
              className="text-blue-700 mt-0.5 flex-shrink-0 animate-pulse"
            />
            <div>
              <p className="text-xs font-bold text-blue-900">
                Verifying Your Payment
              </p>
              <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                We&apos;ve received your payment notification via{" "}
                {order.paymentMethod?.displayName}. Our team is confirming it —
                usually within 24 hours. You&apos;ll get an email once verified.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Paid — confirmation */}
      {alertType === "paid" && order.status === "paid" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
          <CheckCircle2
            size={14}
            className="text-green-600 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-xs font-bold text-green-900">
              Payment Confirmed
            </p>
            <p className="text-[11px] text-green-700">
              We&apos;re preparing your order for shipment.
            </p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-3">
          Items ({order.items?.length || 0})
        </p>
        <div className="space-y-2.5">
          {order.items?.slice(0, 3).map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                {item.mainImage ? (
                  <Image
                    src={item.mainImage}
                    alt={item.productName}
                    fill
                    className="object-contain p-0.5"
                    sizes="40px"
                  />
                ) : (
                  <Package
                    size={16}
                    className="text-gray-300 absolute inset-0 m-auto"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 line-clamp-1">
                  {item.productName}
                </p>
                <p className="text-[10px] text-gray-500">
                  {item.size} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-xs font-semibold text-gray-900">
                ${item.lineTotal?.toFixed(2)}
              </p>
            </div>
          ))}
          {order.items?.length > 3 && (
            <p className="text-[11px] text-gray-500 text-center pt-1">
              +{order.items.length - 3} more item
              {order.items.length - 3 > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Pricing breakdown */}
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-3">
          Summary
        </p>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${order.subtotal?.toFixed(2)}</span>
          </div>
          {order.bulkDiscountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>
                Bulk discount ({order.appliedDiscount?.discountPercent}%)
              </span>
              <span>−${order.bulkDiscountAmount.toFixed(2)}</span>
            </div>
          )}
          {order.couponDiscountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon ({order.appliedCoupon?.code})</span>
              <span>−${order.couponDiscountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>
              {order.shippingCost === 0
                ? "FREE"
                : `$${order.shippingCost?.toFixed(2)}`}
            </span>
          </div>
          {order.freeShippingApplied && order.freeShippingSavings > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Free shipping savings</span>
              <span>−${order.freeShippingSavings.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 pt-2 mt-2 border-t border-gray-100">
            <span>Total</span>
            <span style={{ color: "#C70A24" }}>${order.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tracking */}
      {order.trackingNumber && (
        <a
          href={`https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-purple-50 border border-purple-200 rounded-lg p-3 hover:bg-purple-100 transition-colors"
        >
          <p className="text-[10px] uppercase tracking-wide text-purple-700 font-semibold mb-1">
            Tracking
          </p>
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs font-bold text-purple-900">
              {order.trackingNumber}
            </p>
            <ArrowRight size={12} className="text-purple-600" />
          </div>
        </a>
      )}

      {/* CTA */}
      <Link
        href={`/orders/${order._id}`}
        className="block w-full text-center py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#C70A24" }}
      >
        View Full Details
      </Link>
    </div>
  );
};

// ─── Compact Timeline ──────────────────────────────────────────
const CompactTimeline = ({ order }: { order: any }) => {
  const steps = [
    { key: "placed", label: "Placed", date: order.createdAt },
    { key: "paid", label: "Paid", date: order.paidAt },
    { key: "shipped", label: "Shipped", date: order.shippedAt },
    { key: "delivered", label: "Delivered", date: order.deliveredAt },
  ];

  const currentStepIndex = steps.findIndex((s) => !s.date);
  const activeIndex =
    currentStepIndex === -1 ? steps.length - 1 : currentStepIndex - 1;

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Progress
      </p>
      <div className="flex items-center justify-between relative px-1">
        <div className="absolute top-2.5 left-3 right-3 h-0.5 bg-gray-200 -z-0">
          <div
            className="h-full transition-all"
            style={{
              backgroundColor: "#C70A24",
              width: `${activeIndex >= 0 ? (activeIndex / (steps.length - 1)) * 100 : 0}%`,
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx <= activeIndex;
          return (
            <div
              key={step.key}
              className="flex flex-col items-center gap-1 relative z-10"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isCompleted ? "" : "bg-white border-2 border-gray-200"
                }`}
                style={isCompleted ? { backgroundColor: "#C70A24" } : undefined}
              >
                {isCompleted && (
                  <CheckCircle2 size={11} className="text-white" />
                )}
              </div>
              <p
                className={`text-[9px] font-medium ${
                  isCompleted ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
