/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MapPin,
  Truck,
  CreditCard,
  Tag,
  AlertCircle,
  Check,
  Loader2,
  Sparkles,
  Zap,
  DollarSign,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Loader } from "@/components/shared/Loader";
import { useGetCartSummaryQuery } from "@/redux/api/cartApi";
import { useGetShippingRatesMutation } from "@/redux/api/shippingApi";
import { useGetActivePaymentMethodsQuery } from "@/redux/api/paymentMethodApi";
import { couponStorage } from "@/utils/couponStorage";

/* ─── Types matching backend response ────────────────────── */

interface IShippingOption {
  serviceType: string;
  serviceName: string;
  totalCost: number;
  customerPays: number;
  freeShippingApplied: boolean;
  savings: number;
  currency: string;
  transitDays?: string;
  deliveryDay?: string;
  isCheapest: boolean;
  isFastest: boolean;
}

interface IPaymentMethod {
  _id: string;
  type: "echeck" | "crypto" | "venmo" | "cashapp" | "zelle";
  displayName: string;
  description?: string;
  handle?: string;
  instructionsForCustomer?: string;
  isAutomated: boolean;
  displayOrder?: number;
}

interface IAddress {
  street: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/* ─── US states for dropdown ────────────────────────────── */
const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

/* ═══════════════════════════════════════════════════════════
 *  MAIN CHECKOUT PAGE
 * ═══════════════════════════════════════════════════════════ */

const CheckoutPage = () => {
  const router = useRouter();

  // ─── Address state ────────────────────────────────────────
  const [address, setAddress] = useState<IAddress>({
    street: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  // ─── Shipping state ───────────────────────────────────────
  const [shippingOptions, setShippingOptions] = useState<IShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<IShippingOption | null>(null);
  const [ratesFetched, setRatesFetched] = useState(false);

  // ─── Payment state ────────────────────────────────────────
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<IPaymentMethod | null>(null);

  // ─── Misc state ───────────────────────────────────────────
  const [orderNote, setOrderNote] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");

  // ─── Restore coupon from cart page on mount ──────────────
  useEffect(() => {
    const stored = couponStorage.get();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAppliedCouponCode(stored);
      setCouponInput(stored);
    }
  }, []);

  // ─── API hooks ────────────────────────────────────────────
  const { data: summaryData, isFetching: summaryFetching } =
    useGetCartSummaryQuery({
      couponCode: appliedCouponCode || undefined,
      shippingCost: selectedShipping?.customerPays || 0,
    });

  const [getShippingRates, { isLoading: ratesLoading }] =
    useGetShippingRatesMutation();

  const { data: paymentMethodsData, isLoading: paymentMethodsLoading } =
    useGetActivePaymentMethodsQuery(undefined);

  const summary = summaryData?.data;
  const paymentMethods: IPaymentMethod[] = paymentMethodsData?.data || [];

  // Sort payment methods by displayOrder
  const sortedPaymentMethods = useMemo(
    () =>
      [...paymentMethods].sort(
        (a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99),
      ),
    [paymentMethods],
  );

  // ─── Address handlers ─────────────────────────────────────
  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    // Reset shipping if address changed after fetching rates
    if (ratesFetched) {
      setShippingOptions([]);
      setSelectedShipping(null);
      setRatesFetched(false);
    }
  };

  const isAddressComplete = (): boolean => {
    return Boolean(
      address.street.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      address.postalCode.trim() &&
      address.country.trim(),
    );
  };

  // ─── Fetch shipping rates ─────────────────────────────────
  const handleFetchRates = async () => {
    if (!isAddressComplete()) {
      toast.error("Please fill in all required address fields");
      return;
    }

    const fedexPayload = {
      streetLines: [address.street, address.apartment].filter((s) => s.trim()),
      city: address.city,
      stateOrProvinceCode: address.state,
      postalCode: address.postalCode,
      countryCode: address.country,
    };

    // 🔍 DEBUG: See exactly what's being sent to FedEx
    console.log("FedEx payload:", JSON.stringify(fedexPayload, null, 2));

    try {
      const result = await getShippingRates({
        recipientAddress: fedexPayload,
      }).unwrap();

      const options: IShippingOption[] = result?.data || [];
      setShippingOptions(options);
      setRatesFetched(true);

      const cheapest = options.find((o) => o.isCheapest);
      if (cheapest) setSelectedShipping(cheapest);

      toast.success("Shipping rates loaded");
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to fetch shipping rates");
    }
  };

  // ─── Coupon handlers (persisted to localStorage) ──────────
  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      toast.error("Enter a coupon code");
      return;
    }
    const code = couponInput.trim();
    setAppliedCouponCode(code);
    couponStorage.set(code);
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode("");
    setCouponInput("");
    couponStorage.remove();
  };

  const couponFailed = !!(
    appliedCouponCode &&
    !summaryFetching &&
    summary &&
    !summary.appliedCoupon
  );

  // ─── Place order (stubbed for now) ────────────────────────
  const handlePlaceOrder = () => {
    if (!isAddressComplete()) {
      toast.error("Please complete your shipping address");
      return;
    }
    if (!selectedShipping) {
      toast.error("Please select a shipping method");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (selectedPaymentMethod.isAutomated) {
      toast.error(
        `${selectedPaymentMethod.displayName} is coming soon. Please choose a manual payment method for now.`,
      );
      return;
    }
    if (!termsAgreed) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    // TODO: integrate orderApi.placeOrder mutation
    // On success: couponStorage.remove(); router.push(`/cart/order-success?orderId=${id}`);
    toast.success(
      "Form is complete! Order placement API will be wired in next step.",
    );
    console.log("Order payload preview:", {
      shippingAddress: address,
      shippingMethod: selectedShipping.serviceType,
      shippingCost: selectedShipping.customerPays,
      paymentMethodId: selectedPaymentMethod._id,
      couponCode: appliedCouponCode || undefined,
      customerNote: orderNote || undefined,
    });
  };

  // ─── Empty cart redirect ──────────────────────────────────
  useEffect(() => {
    if (summary && summary.items && summary.items.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
    }
  }, [summary, router]);

  if (!summary) {
    return (
      <main className="min-h-screen bg-white flex justify-center items-center">
        <Loader size="lg" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-4 text-sm font-medium">
          <Link
            href="/cart"
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Shopping Cart
          </Link>
          <span className="text-gray-400">→</span>
          <span className="font-semibold" style={{ color: "#C70A24" }}>
            Checkout
          </span>
          <span className="text-gray-400">→</span>
          <span className="text-gray-600">Order Complete</span>
        </div>
      </div>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ═══ LEFT COLUMN ═══ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Shipping Address */}
            <SectionCard
              icon={MapPin}
              title="Shipping Address"
              step={1}
              done={isAddressComplete()}
            >
              <AddressForm address={address} onChange={handleAddressChange} />
            </SectionCard>

            {/* Section 2: Shipping Method */}
            <SectionCard
              icon={Truck}
              title="Shipping Method"
              step={2}
              done={!!selectedShipping}
            >
              <ShippingSection
                addressComplete={isAddressComplete()}
                ratesFetched={ratesFetched}
                ratesLoading={ratesLoading}
                shippingOptions={shippingOptions}
                selectedShipping={selectedShipping}
                setSelectedShipping={setSelectedShipping}
                onFetchRates={handleFetchRates}
              />
            </SectionCard>

            {/* Section 3: Payment Method */}
            <SectionCard
              icon={CreditCard}
              title="Payment Method"
              step={3}
              done={
                !!selectedPaymentMethod && !selectedPaymentMethod.isAutomated
              }
            >
              <PaymentSection
                methods={sortedPaymentMethods}
                loading={paymentMethodsLoading}
                selected={selectedPaymentMethod}
                onSelect={setSelectedPaymentMethod}
              />
            </SectionCard>

            {/* Order Notes */}
            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Order Notes{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </h3>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                rows={3}
                placeholder="Special instructions, delivery preferences, etc."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors resize-none"
              />
            </div>
          </div>

          {/* ═══ RIGHT COLUMN — Order Summary ═══ */}
          <div className="lg:col-span-1">
            <OrderSummary
              summary={summary}
              selectedShipping={selectedShipping}
              couponInput={couponInput}
              setCouponInput={setCouponInput}
              appliedCouponCode={appliedCouponCode}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              couponFailed={couponFailed}
              summaryFetching={summaryFetching}
              termsAgreed={termsAgreed}
              setTermsAgreed={setTermsAgreed}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutPage;

/* ═══════════════════════════════════════════════════════════
 *  SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════ */

const SectionCard = ({
  icon: Icon,
  title,
  step,
  done,
  children,
}: {
  icon: any;
  title: string;
  step: number;
  done: boolean;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
            done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {done ? <Check size={18} /> : step}
        </div>
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

/* ─── Address Form ──────────────────────────────────────────── */

const AddressForm = ({
  address,
  onChange,
}: {
  address: IAddress;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField label="Country" required>
      <select
        name="country"
        value={address.country}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors bg-white cursor-pointer"
      >
        <option value="US">United States</option>
      </select>
    </FormField>

    <FormField label="Street Address" required className="md:col-span-2">
      <input
        type="text"
        name="street"
        value={address.street}
        onChange={onChange}
        placeholder="123 Main Street"
        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
      />
    </FormField>

    <FormField label="Apartment / Suite" className="md:col-span-2">
      <input
        type="text"
        name="apartment"
        value={address.apartment}
        onChange={onChange}
        placeholder="(optional)"
        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
      />
    </FormField>

    <FormField label="City" required>
      <input
        type="text"
        name="city"
        value={address.city}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
      />
    </FormField>

    <FormField label="State" required>
      <select
        name="state"
        value={address.state}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors bg-white cursor-pointer"
      >
        <option value="">Select state</option>
        {US_STATES.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
    </FormField>

    <FormField label="ZIP Code" required className="md:col-span-2">
      <input
        type="text"
        name="postalCode"
        value={address.postalCode}
        onChange={onChange}
        placeholder="10001"
        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
      />
    </FormField>
  </div>
);

const FormField = ({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <label className="block text-xs font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

/* ─── Shipping Section ──────────────────────────────────────── */

const ShippingSection = ({
  addressComplete,
  ratesFetched,
  ratesLoading,
  shippingOptions,
  selectedShipping,
  setSelectedShipping,
  onFetchRates,
}: {
  addressComplete: boolean;
  ratesFetched: boolean;
  ratesLoading: boolean;
  shippingOptions: IShippingOption[];
  selectedShipping: IShippingOption | null;
  setSelectedShipping: (opt: IShippingOption) => void;
  onFetchRates: () => void;
}) => {
  if (!ratesFetched) {
    return (
      <div className="text-center py-6">
        {!addressComplete ? (
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <Truck size={32} className="text-gray-300" />
            <p className="text-sm">
              Fill in your shipping address above to see available shipping
              options
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-gray-600">
              Your address is ready. Get available shipping options:
            </p>
            <button
              onClick={onFetchRates}
              disabled={ratesLoading}
              className="px-6 py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              style={{ backgroundColor: "#C70A24" }}
            >
              {ratesLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Calculating Rates...
                </>
              ) : (
                <>
                  <Truck size={16} />
                  Get Shipping Rates
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (shippingOptions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        No shipping options available for this address.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {shippingOptions.map((option) => (
        <ShippingOptionRow
          key={option.serviceType}
          option={option}
          selected={selectedShipping?.serviceType === option.serviceType}
          onSelect={() => setSelectedShipping(option)}
        />
      ))}
    </div>
  );
};

const ShippingOptionRow = ({
  option,
  selected,
  onSelect,
}: {
  option: IShippingOption;
  selected: boolean;
  onSelect: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${
        selected
          ? "border-[#C70A24] bg-red-50/50"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            selected ? "border-[#C70A24]" : "border-gray-300"
          }`}
        >
          {selected && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#C70A24]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-gray-900 text-sm">
              {option.serviceName}
            </p>
            {option.freeShippingApplied && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                <Sparkles size={10} /> FREE
              </span>
            )}
            {option.isCheapest && !option.freeShippingApplied && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
                <DollarSign size={10} /> Cheapest
              </span>
            )}
            {option.isFastest && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
                <Zap size={10} /> Fastest
              </span>
            )}
          </div>
          {option.savings > 0 && !option.freeShippingApplied && (
            <p className="text-xs text-green-600 mt-0.5">
              You save ${option.savings.toFixed(2)}
            </p>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          {option.freeShippingApplied ? (
            <p className="font-bold text-green-600">FREE</p>
          ) : (
            <>
              <p className="font-bold text-gray-900">
                ${option.customerPays.toFixed(2)}
              </p>
              {option.savings > 0 && (
                <p className="text-xs text-gray-400 line-through">
                  ${option.totalCost.toFixed(2)}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </button>
  );
};

/* ─── Payment Section ───────────────────────────────────────── */

const PaymentSection = ({
  methods,
  loading,
  selected,
  onSelect,
}: {
  methods: IPaymentMethod[];
  loading: boolean;
  selected: IPaymentMethod | null;
  onSelect: (m: IPaymentMethod) => void;
}) => {
  if (loading) {
    return (
      <div className="py-6 flex justify-center">
        <Loader size="md" />
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        No payment methods available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <PaymentMethodRow
          key={method._id}
          method={method}
          selected={selected?._id === method._id}
          onSelect={() => onSelect(method)}
        />
      ))}

      {selected && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <PaymentMethodDetails method={selected} />
        </div>
      )}
    </div>
  );
};

const PaymentMethodRow = ({
  method,
  selected,
  onSelect,
}: {
  method: IPaymentMethod;
  selected: boolean;
  onSelect: () => void;
}) => {
  const isComingSoon = method.isAutomated; // Bankful pending approval

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${
        selected
          ? "border-[#C70A24] bg-red-50/50"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
            selected ? "border-[#C70A24]" : "border-gray-300"
          }`}
        >
          {selected && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#C70A24]" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-gray-900 text-sm">
              {method.displayName}
            </p>
            {isComingSoon && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                Coming Soon
              </span>
            )}
            {!isComingSoon && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                Manual
              </span>
            )}
          </div>
          {method.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {method.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

const PaymentMethodDetails = ({ method }: { method: IPaymentMethod }) => {
  // Bankful methods — Coming Soon banner
  if (method.isAutomated) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-yellow-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 text-sm mb-1">
              {method.displayName} is coming soon
            </p>
            <p className="text-xs text-yellow-700 leading-relaxed">
              We&apos;re finalizing our integration with Bankful for automated
              payment processing. In the meantime, please use one of our manual
              payment methods (Venmo, Cash App, or Zelle) to complete your
              order.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Manual P2P methods — show preview of post-order instructions
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info size={18} className="text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-blue-800 text-sm mb-2">
            How {method.displayName} payment works
          </p>
          <ol className="text-xs text-blue-800 space-y-1 leading-relaxed list-decimal list-inside">
            <li>Place your order — you&apos;ll get an order number.</li>
            {method.handle && (
              <li>
                Send the total amount to{" "}
                <span className="font-mono font-semibold bg-white px-1.5 py-0.5 rounded">
                  {method.handle}
                </span>{" "}
                on {method.displayName}.
              </li>
            )}
            <li>Include your order number in the payment note.</li>
            <li>
              Our team will confirm payment within 24 hours and ship your order.
            </li>
          </ol>
          {method.instructionsForCustomer && (
            <p className="text-xs text-blue-700 mt-2 italic">
              {method.instructionsForCustomer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Order Summary (right sidebar) ─────────────────────────── */

const OrderSummary = ({
  summary,
  selectedShipping,
  couponInput,
  setCouponInput,
  appliedCouponCode,
  onApplyCoupon,
  onRemoveCoupon,
  couponFailed,
  summaryFetching,
  termsAgreed,
  setTermsAgreed,
  onPlaceOrder,
}: {
  summary: any;
  selectedShipping: IShippingOption | null;
  couponInput: string;
  setCouponInput: (v: string) => void;
  appliedCouponCode: string;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  couponFailed: boolean;
  summaryFetching: boolean;
  termsAgreed: boolean;
  setTermsAgreed: (v: boolean) => void;
  onPlaceOrder: () => void;
}) => {
  const [itemsExpanded, setItemsExpanded] = useState(false);

  const subtotal = summary?.subtotal ?? 0;
  const couponDiscountAmount = summary?.couponDiscountAmount ?? 0;
  const bulkDiscountAmount = summary?.bulkDiscountAmount ?? 0;
  const shippingCost = summary?.shippingCost ?? 0;
  const total = summary?.total ?? 0;
  const items = summary?.items || [];

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 sticky top-20">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">
        Order Summary
      </h3>

      {/* Items list (collapsible) */}
      <div className="mb-5 pb-5 border-b border-gray-100">
        <button
          onClick={() => setItemsExpanded(!itemsExpanded)}
          className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-2 cursor-pointer"
        >
          <span>
            {summary?.totalQuantity ?? 0} item
            {summary?.totalQuantity !== 1 ? "s" : ""}
          </span>
          {itemsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {itemsExpanded && (
          <div className="space-y-3 mt-3">
            {items.map((item: any) => (
              <div key={item._id} className="flex gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded relative overflow-hidden flex-shrink-0">
                  {item.product?.mainImage && (
                    <Image
                      src={item.product.mainImage}
                      alt={item.product.title}
                      fill
                      className="object-contain p-1"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 line-clamp-1">
                    {item.product?.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Size: {item.size} · Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-xs font-semibold text-gray-900">
                  ${item.lineTotal?.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coupon */}
      <div className="mb-5 pb-5 border-b border-gray-100">
        {summary?.appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-green-600" />
              <div>
                <p className="text-xs font-semibold text-green-800">
                  {summary.appliedCoupon.code} applied
                </p>
                <p className="text-xs text-green-600">
                  Saved ${couponDiscountAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-xs text-red-600 hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : couponFailed ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle
                size={16}
                className="text-red-600 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-xs font-semibold text-red-800">
                  Coupon &quot;{appliedCouponCode}&quot; is invalid
                </p>
                <button
                  onClick={onRemoveCoupon}
                  className="text-xs text-red-600 hover:underline cursor-pointer mt-1"
                >
                  Try another
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code"
              disabled={summaryFetching}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors disabled:opacity-60"
            />
            <button
              onClick={onApplyCoupon}
              disabled={summaryFetching || !couponInput.trim()}
              className="px-4 py-2 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: "#C70A24" }}
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-3 mb-5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${subtotal.toFixed(2)}</span>
        </div>

        {bulkDiscountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Bulk discount</span>
            <span className="text-green-600">
              − ${bulkDiscountAmount.toFixed(2)}
            </span>
          </div>
        )}

        {couponDiscountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Coupon</span>
            <span className="text-green-600">
              − ${couponDiscountAmount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
          <span className="text-gray-600">
            Shipping
            {selectedShipping && (
              <span className="block text-xs text-gray-400">
                {selectedShipping.serviceName}
              </span>
            )}
          </span>
          <span className="text-gray-900 font-medium">
            {!selectedShipping ? (
              <span className="text-gray-400">Not selected</span>
            ) : selectedShipping.freeShippingApplied ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
      </div>

      <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200 mb-5">
        <span className="text-gray-900">Total</span>
        <span style={{ color: "#C70A24" }}>${total.toFixed(2)}</span>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2 mb-5 cursor-pointer">
        <input
          type="checkbox"
          checked={termsAgreed}
          onChange={(e) => setTermsAgreed(e.target.checked)}
          className="mt-0.5 accent-[#C70A24] cursor-pointer"
        />
        <span className="text-xs text-gray-600 leading-relaxed">
          I have read and agree to the{" "}
          <Link
            href="/terms"
            className="font-medium hover:underline cursor-pointer"
            style={{ color: "#C70A24" }}
          >
            terms and conditions
          </Link>
        </span>
      </label>

      {/* Place Order */}
      <button
        onClick={onPlaceOrder}
        disabled={summaryFetching}
        className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
        style={{ backgroundColor: "#C70A24" }}
      >
        Place Order
      </button>

      <p className="text-xs text-gray-400 text-center mt-3">
        Secure checkout · Your information is protected
      </p>
    </div>
  );
};
