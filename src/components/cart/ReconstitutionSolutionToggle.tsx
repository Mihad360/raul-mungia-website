"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FlaskConical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetAllProductsQuery } from "@/redux/api/shopApi";
import {
  useAddToCartMutation,
  useRemoveCartItemMutation,
} from "@/redux/api/cartApi";

type CartItemLike = {
  _id: string;
  product: { _id: string; title?: string } | null;
  size: string;
  quantity: number;
  price?: number;
};

type VariantLike = {
  _id?: string;
  size: string;
  price: number;
  stock: number;
};

type ProductLike = {
  _id: string;
  title: string;
  mainImage?: string;
  variants?: VariantLike[];
};

function isReconstitutionProduct(product: {
  title?: string;
  productCode?: string;
}): boolean {
  const haystack = `${product.title || ""} ${product.productCode || ""}`.toLowerCase();
  return (
    haystack.includes("reconstitution") ||
    haystack.includes("bacteriostatic") ||
    haystack.includes("bac water")
  );
}

type ReconstitutionSolutionToggleProps = {
  cartItems: CartItemLike[];
};

/**
 * Cart/checkout upsell: toggle "Add Reconstitution Solution".
 * Finds the matching catalog product by name; no-ops quietly if missing.
 */
const ReconstitutionSolutionToggle = ({
  cartItems,
}: ReconstitutionSolutionToggleProps) => {
  const { data, isLoading } = useGetAllProductsQuery({
    searchTerm: "reconstitution",
    limit: 20,
  });

  const [addToCart] = useAddToCartMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [busy, setBusy] = useState(false);

  const product = useMemo(() => {
    const list = (data?.data || []) as ProductLike[];
    return (
      list.find((p) => isReconstitutionProduct(p)) ||
      list.find((p) =>
        (p.title || "").toLowerCase().includes("solution"),
      ) ||
      null
    );
  }, [data?.data]);

  const variant = product?.variants?.[0];
  const price = variant?.price ?? 14.99;

  const existingItem = useMemo(() => {
    if (!product) return null;
    return (
      cartItems.find((item) => item.product?._id === product._id) || null
    );
  }, [cartItems, product]);

  const isOn = !!existingItem;

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
        <Loader2 size={16} className="animate-spin" />
        Checking reconstitution solution…
      </div>
    );
  }

  // Product not in catalog yet — hide toggle rather than break checkout
  if (!product || !variant) return null;

  const handleToggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (isOn && existingItem) {
        await removeCartItem(existingItem._id).unwrap();
        toast.success("Reconstitution Solution removed");
      } else {
        if (variant.stock <= 0) {
          toast.error("Reconstitution Solution is out of stock");
          return;
        }
        await addToCart({
          productId: product._id,
          size: variant.size,
          quantity: 1,
        }).unwrap();
        toast.success("Reconstitution Solution added");
      }
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Could not update cart");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 relative overflow-hidden flex-shrink-0 flex items-center justify-center">
          {product.mainImage ? (
            <Image
              src={product.mainImage}
              alt={product.title}
              fill
              className="object-contain p-1"
            />
          ) : (
            <FlaskConical size={20} className="text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Add Reconstitution Solution
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Recommended for reconstituting research peptides.{" "}
                <span className="font-medium text-gray-700">
                  ${price.toFixed(2)}
                </span>
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isOn}
              aria-label="Add reconstitution solution"
              disabled={busy}
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                isOn ? "bg-[#C70A24]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  isOn ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {busy && (
            <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" />
              Updating cart…
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReconstitutionSolutionToggle;
