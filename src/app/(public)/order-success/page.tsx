/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Package,
  CreditCard,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetMySingleOrderQuery,
  useGetMyLatestOrderQuery,
} from "@/redux/api/orderApi";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  formatDate,
} from "@/utils/orderHelpers";

const OrderSuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  // Fetch by ID if provided, otherwise fall back to latest
  const { data: orderByIdData, isLoading: isLoadingById } =
    useGetMySingleOrderQuery(orderId || "", { skip: !orderId });
  const { data: latestData, isLoading: isLoadingLatest } =
    useGetMyLatestOrderQuery(undefined, { skip: !!orderId });

  const isLoading = orderId ? isLoadingById : isLoadingLatest;
  const order: any = orderByIdData?.data || latestData?.data;

  const [copied, setCopied] = useState(false);
  const copyText = (text: string, label = "Code") => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
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
        <p className="text-gray-500 mb-6">
          We couldn&apos;t find the order you&apos;re looking for.
        </p>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#C70A24" }}
        >
          View My Orders
        </Link>
      </div>
    );
  }

  const isManualPayment =
    !order.paymentMethod?.isAutomated && order.paymentStatus !== "paid";
  const isAlreadyPaid = order.paymentStatus === "paid";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600">
          Thank you for your order. We&apos;ll send you a confirmation email
          shortly.
        </p>
      </div>

      {/* Order number card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Order Number
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900 font-mono">
                {order.orderNumber}
              </p>
              <button
                onClick={() => copyText(order.orderNumber, "Order number")}
                className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                title="Copy order number"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>
      </div>

      {/* Payment instructions or confirmation */}
      {isAlreadyPaid ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={20}
              className="text-green-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">
                Payment Confirmed
              </h3>
              <p className="text-sm text-green-700">
                Your payment has been received. We&apos;ll prepare your order
                for shipment shortly.
              </p>
            </div>
          </div>
        </div>
      ) : isManualPayment ? (
        <ManualPaymentInstructions order={order} onCopy={copyText} />
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <CreditCard
              size={20}
              className="text-blue-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Awaiting Payment
              </h3>
              <p className="text-sm text-blue-700">
                Please complete payment via {order.paymentMethod?.displayName}.
                Your order will be processed once payment is confirmed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Package size={18} />
            Order Summary
          </h2>
        </div>
        <div className="p-6">
          {/* Items */}
          <div className="space-y-3 mb-5">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="relative w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  {item.mainImage ? (
                    <Image
                      src={item.mainImage}
                      alt={item.productName}
                      fill
                      className="object-contain p-1"
                      sizes="56px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={20} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm line-clamp-1">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  ${item.lineTotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
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
            <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
              <span>Total</span>
              <span>${order.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/account/orders/${order._id}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#C70A24" }}
        >
          View Order Details
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/shop"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

// ─── Manual Payment Instructions Component ───────────────────
const ManualPaymentInstructions = ({
  order,
  onCopy,
}: {
  order: any;
  onCopy: (text: string, label?: string) => void;
}) => {
  const method = order.paymentMethod;
  const total = order.total?.toFixed(2);

  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle
          size={22}
          className="text-yellow-700 mt-0.5 flex-shrink-0"
        />
        <div>
          <h3 className="font-bold text-yellow-900 text-lg mb-1">
            Action Required: Complete Your Payment
          </h3>
          <p className="text-sm text-yellow-800">
            Send <strong>${total}</strong> via {method.displayName} to complete
            your order.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 space-y-3 border border-yellow-200">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {method.displayName} Handle
          </p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold font-mono text-gray-900">
              {method.handle}
            </p>
            <button
              onClick={() => onCopy(method.handle, "Handle")}
              className="p-1 rounded hover:bg-gray-100 cursor-pointer"
            >
              <Copy size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Amount
            </p>
            <p className="font-bold text-gray-900">${total}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Note / Memo
            </p>
            <div className="flex items-center gap-2">
              <p className="font-mono font-bold text-gray-900">
                {order.orderNumber}
              </p>
              <button
                onClick={() => onCopy(order.orderNumber, "Order number")}
                className="p-1 rounded hover:bg-gray-100 cursor-pointer"
              >
                <Copy size={12} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-yellow-800 bg-yellow-100 rounded p-3">
        ⏱️ <strong>Important:</strong> Include your order number{" "}
        <span className="font-mono font-bold">{order.orderNumber}</span> in the
        payment note. Orders are typically processed within 24 hours after
        payment confirmation.
      </div>
    </div>
  );
};

// ─── Wrapper with Suspense (for useSearchParams) ──────────────
export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
