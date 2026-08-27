"use client";

import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";

/** Normalize API type / display name into a lookup key */
export const normalizePaymentType = (value?: string | null): string =>
  (value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "")
    .replace(/-/g, "");

/** Prefer API QR URL; Zelle stays handle-only. */
export const paymentTypeHasQr = (
  type?: string | null,
  qrCodeUrl?: string | null,
): boolean => {
  const key = normalizePaymentType(type);
  if (!key || key === "zelle") return false;
  return Boolean(qrCodeUrl?.trim());
};

type PaymentQrCodeProps = {
  /** Cloudinary / API QR image URL */
  src?: string | null;
  type?: string | null;
  displayName?: string;
  size?: number;
  className?: string;
};

/**
 * Shows the QR image from the payment-method API (`qrCodeUrl`).
 * Returns null when no URL (e.g. Zelle) — parent shows handle only.
 */
const PaymentQrCode = ({
  src,
  type,
  displayName = "payment",
  size = 168,
  className = "",
}: PaymentQrCodeProps) => {
  const typeKey = normalizePaymentType(type);
  const resolvedSrc =
    typeKey === "zelle" ? undefined : src?.trim() || undefined;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [resolvedSrc]);

  if (!resolvedSrc) return null;

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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedSrc}
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
