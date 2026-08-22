"use client";

import { useEffect, useMemo, useState } from "react";
import { QrCode } from "lucide-react";

/**
 * Static QR assets in /public/qr/
 * Cash App + Venmo have real QRs. Zelle intentionally has NO QR.
 */
const QR_BY_TYPE: Record<string, string> = {
  cashapp: "/qr/cashapp.png",
  cash_app: "/qr/cashapp.png",
  "cash-app": "/qr/cashapp.png",
  cash: "/qr/cashapp.png",
  venmo: "/qr/venmo.png",
};

/** Normalize API type / display name into a lookup key */
export const normalizePaymentType = (value?: string | null): string =>
  (value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "")
    .replace(/-/g, "");

export const paymentTypeHasQr = (type?: string | null): boolean => {
  const key = normalizePaymentType(type);
  if (!key || key === "zelle") return false;
  return Boolean(
    QR_BY_TYPE[key] ||
      QR_BY_TYPE[type?.toLowerCase() || ""] ||
      (key.includes("cash") ? QR_BY_TYPE.cashapp : null) ||
      (key.includes("venmo") ? QR_BY_TYPE.venmo : null),
  );
};

const resolveQrSrc = (type?: string | null): string | undefined => {
  if (!type) return undefined;
  const raw = type.toLowerCase().trim();
  const compact = normalizePaymentType(type);

  if (compact === "zelle" || raw === "zelle") return undefined;

  return (
    QR_BY_TYPE[raw] ||
    QR_BY_TYPE[compact] ||
    (compact.includes("cash") ? QR_BY_TYPE.cashapp : undefined) ||
    (compact.includes("venmo") ? QR_BY_TYPE.venmo : undefined)
  );
};

type PaymentQrCodeProps = {
  type?: string | null;
  displayName?: string;
  size?: number;
  className?: string;
};

/**
 * Shows the real QR from /public/qr when available.
 * Returns null for Zelle (handle-only). Placeholder only if a QR type is expected but the file fails.
 */
const PaymentQrCode = ({
  type,
  displayName = "payment",
  size = 168,
  className = "",
}: PaymentQrCodeProps) => {
  const src = useMemo(() => resolveQrSrc(type), [type]);
  const [failed, setFailed] = useState(false);

  // Reset error when switching payment methods (e.g. Zelle → Cash App)
  useEffect(() => {
    setFailed(false);
  }, [src]);

  // Zelle (and unknown types without assets): render nothing — parent shows handle only
  if (!src) return null;

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-center px-3 ${className}`}
        style={{ width: size, height: size }}
        aria-label={`${displayName} QR unavailable`}
      >
        <QrCode size={28} className="text-gray-300 mb-2" />
        <p className="text-[11px] font-medium text-gray-500 leading-snug">
          {displayName} QR
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">Unavailable</p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white p-2 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Plain img avoids Next/Image quirks with local QR assets */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Scan to pay with ${displayName}`}
        width={size - 16}
        height={size - 16}
        className="w-full h-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
};

export default PaymentQrCode;
