"use client";

import { Home, Clock, Phone } from "lucide-react";
import { useGetPickupLocationQuery } from "@/redux/api/shippingApi";
import {
  FALLBACK_PICKUP_LOCATION,
  type IPickupLocation,
} from "@/constants/pickup";

type PickupLocationBlockProps = {
  variant?: "checkout" | "ready" | "compact";
  orderNumber?: string;
};

const unwrapLocation = (payload: unknown): IPickupLocation | null => {
  if (!payload || typeof payload !== "object") return null;
  const body = payload as { data?: unknown; street?: string; name?: string };
  const raw =
    body.data && typeof body.data === "object" && "street" in (body.data as object)
      ? (body.data as IPickupLocation)
      : (body as IPickupLocation);
  if (!raw?.name && !raw?.street) return null;
  return raw;
};

export default function PickupLocationBlock({
  variant = "checkout",
  orderNumber,
}: PickupLocationBlockProps) {
  const { data, isLoading } = useGetPickupLocationQuery(undefined);
  const location = unwrapLocation(data) || FALLBACK_PICKUP_LOCATION;

  if (isLoading) {
    return (
      <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-700">
        Loading pickup details…
      </div>
    );
  }

  const cityLine = [location.city, location.state, location.postalCode]
    .filter(Boolean)
    .join(", ");

  if (variant === "compact") {
    return (
      <div className="text-xs text-emerald-900 leading-relaxed">
        <p className="font-semibold">{location.name}</p>
        {location.street && <p>{location.street}</p>}
        {cityLine && <p>{cityLine}</p>}
        <p className="text-emerald-700 mt-1">Hours: {location.hours}</p>
      </div>
    );
  }

  const isReady = variant === "ready";

  return (
    <div className="rounded-lg p-4 bg-emerald-50 border border-emerald-200">
      <div className="flex items-start gap-3">
        <Home
          size={18}
          className="text-emerald-700 mt-0.5 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-emerald-900 mb-1">
            {isReady ? "Ready for pickup" : "Pickup Information"}
          </p>
          <p className="text-xs font-semibold text-emerald-900">
            {location.name}
          </p>
          <p className="text-xs text-emerald-800 leading-relaxed mt-1">
            {location.street}
            {location.street && cityLine ? <br /> : null}
            {cityLine}
          </p>
          <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1.5">
            <Clock size={12} className="shrink-0" />
            Hours: {location.hours}
          </p>
          {location.phone && (
            <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1.5">
              <Phone size={12} className="shrink-0" />
              {location.phone}
            </p>
          )}
          {isReady && orderNumber && (
            <p className="text-xs text-emerald-800 mt-2 font-medium">
              Bring order number {orderNumber} when you arrive.
            </p>
          )}
          {!isReady && (
            <p className="text-xs text-emerald-700 mt-2 italic">
              We&apos;ll email you with these pickup instructions when your
              order is ready.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
