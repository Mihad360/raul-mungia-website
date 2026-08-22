"use client";

import { useMemo } from "react";
import { AlertCircle, Copy } from "lucide-react";
import { toast } from "sonner";
import envConfig from "@/config/envConfig";
import PaymentQrCode, {
  paymentTypeHasQr,
} from "@/components/shared/PaymentQrCode";
import { useGetActivePaymentMethodsQuery } from "@/redux/api/paymentMethodApi";

export type OrderPaymentMethodLike = {
  type?: string;
  displayName?: string;
  handle?: string;
  isAutomated?: boolean;
  instructionsForCustomer?: string;
};

type ManualOrderPaymentCardProps = {
  orderNumber: string;
  total: number;
  paymentMethod?: OrderPaymentMethodLike | null;
  /** Compact layout for order list cards */
  compact?: boolean;
  className?: string;
};

export const isManualPaymentMethod = (
  method?: OrderPaymentMethodLike | null,
): boolean => {
  if (!method) return false;
  return method.isAutomated === false;
};

export const resolvePaymentHandle = (
  method?: OrderPaymentMethodLike | null,
): string | null => {
  if (!method) return null;

  const type = (method.type || "").toLowerCase().replace(/[_-\s]/g, "");

  // Zelle is handle-only — always use the configured handle ($STXResearch1)
  if (type === "zelle") return envConfig.payment.zelle;

  if (method.handle?.trim()) return method.handle.trim();

  if (type === "cashapp" || type === "cash") {
    return envConfig.payment.cashApp;
  }
  if (type === "venmo") return envConfig.payment.venmo;
  return null;
};

const copyText = async (text: string, label = "Text") => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  } catch {
    toast.error("Could not copy");
  }
};

/**
 * Full manual payment instructions for unpaid orders
 * (handle, amount, memo, QR, Cash App / Venmo / Zelle notes).
 */
const ManualOrderPaymentCard = ({
  orderNumber,
  total,
  paymentMethod,
  compact = false,
  className = "",
}: ManualOrderPaymentCardProps) => {
  const { data: methodsData } = useGetActivePaymentMethodsQuery(undefined);

  const enrichedMethod = useMemo(() => {
    if (!paymentMethod) return null;
    const liveMethods = (methodsData?.data || []) as Array<{
      type?: string;
      handle?: string;
      instructionsForCustomer?: string;
      displayName?: string;
    }>;
    const live = liveMethods.find(
      (m) =>
        (m.type || "").toLowerCase() ===
        (paymentMethod.type || "").toLowerCase(),
    );
    if (!live) return paymentMethod;
    return {
      ...paymentMethod,
      handle: paymentMethod.handle || live.handle,
      instructionsForCustomer:
        paymentMethod.instructionsForCustomer || live.instructionsForCustomer,
      displayName: paymentMethod.displayName || live.displayName,
    };
  }, [paymentMethod, methodsData]);

  if (!isManualPaymentMethod(enrichedMethod || paymentMethod)) return null;

  const method = enrichedMethod || paymentMethod;
  const displayName = method?.displayName || "Payment";
  const handle = resolvePaymentHandle(method);
  const type = (method?.type || "").toLowerCase().replace(/[_-\s]/g, "");
  const instructions = method?.instructionsForCustomer;
  const amount = Number(total || 0).toFixed(2);
  const showQr = paymentTypeHasQr(type);

  return (
    <div
      className={`bg-yellow-50 border-2 border-yellow-300 rounded-xl ${
        compact ? "p-3" : "p-5"
      } ${className}`}
    >
      <div className={`flex items-start gap-3 ${compact ? "mb-2" : "mb-4"}`}>
        <AlertCircle
          size={compact ? 16 : 20}
          className="text-yellow-700 mt-0.5 flex-shrink-0"
        />
        <div>
          <h3
            className={`font-bold text-yellow-900 ${
              compact ? "text-xs" : "text-base"
            }`}
          >
            Complete your {displayName} payment
          </h3>
          <p
            className={`text-yellow-800 mt-0.5 ${
              compact ? "text-[11px]" : "text-sm"
            }`}
          >
            Send <strong>${amount}</strong> via {displayName} to finish this
            order. You can pay anytime from this page.
          </p>
        </div>
      </div>

      <div
        className={`bg-white rounded-lg border border-yellow-200 ${
          compact ? "p-2.5" : "p-4"
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
          <div className="flex-1 space-y-3 min-w-0">
            {handle && (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">
                  {displayName} handle
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className={`font-mono font-bold text-gray-900 break-all ${
                      compact ? "text-sm" : "text-lg"
                    }`}
                  >
                    {handle}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyText(handle, "Handle")}
                    className="p-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
                    aria-label="Copy payment handle"
                  >
                    <Copy size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">
                  Amount
                </p>
                <p className="font-bold text-gray-900">${amount}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">
                  Note / Memo
                </p>
                <div className="flex items-center gap-1.5">
                  <p className="font-mono font-bold text-gray-900 text-sm break-all">
                    {orderNumber}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyText(orderNumber, "Order number")}
                    className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                    aria-label="Copy order number"
                  >
                    <Copy size={12} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {!compact && (
              <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside leading-relaxed pt-1">
                <li>
                  Open {displayName}
                  {handle ? " and send the amount to the handle above" : ""}.
                </li>
                <li className="font-semibold text-[#C70A24]">
                  Put only your order number in the payment note — no product
                  names.
                </li>
                <li>
                  We confirm payments within 24 hours and then process your
                  order.
                </li>
              </ol>
            )}

            {instructions && (
              <p className="text-xs text-gray-600 italic border-t border-gray-100 pt-2">
                {instructions}
              </p>
            )}
          </div>

          {showQr && (
            <div className="flex flex-col items-center gap-1.5 mx-auto sm:mx-0">
              <PaymentQrCode
                type={type}
                displayName={displayName}
                size={compact ? 112 : 148}
              />
              <p className="text-[10px] text-gray-500">Scan to pay</p>
            </div>
          )}
          {!showQr && type === "zelle" && handle && (
            <div className="mx-auto sm:mx-0 rounded-xl border border-yellow-200 bg-yellow-50/50 px-3 py-3 text-center min-w-[120px]">
              <p className="text-[10px] uppercase tracking-wide text-yellow-800 mb-1">
                Zelle only
              </p>
              <p className="font-mono font-bold text-yellow-950 text-sm break-all">
                {handle}
              </p>
              <p className="text-[10px] text-yellow-700 mt-1">No QR code</p>
            </div>
          )}
        </div>
      </div>

      <p
        className={`text-[#C70A24] font-semibold mt-3 ${
          compact ? "text-[10px]" : "text-xs"
        }`}
      >
        Important: Include order number{" "}
        <span className="font-mono">{orderNumber}</span> in the payment note. Do
        not send product names.
      </p>
    </div>
  );
};

export default ManualOrderPaymentCard;
