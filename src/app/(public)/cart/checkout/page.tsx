"use client";

import { useState } from "react";
import Link from "next/link";

const CheckoutPage = () => {
  // TODO: Replace with Redux selector for cart totals
  const cartTotal = 69.99;
  const subtotal = 49.99;
  const shipping = 12.99;
  const shippingProtection = 2.99;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    address: "",
    phone: "",
    email: "",
  });

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);

    // TODO: Call checkout API
    // const response = await fetch("/api/checkout", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // });

    setTimeout(() => {
      setLoading(false);
      // Redirect to order complete page
      window.location.href = "/order-complete";
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-white">

      {/* Progress bar */}
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
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left — billing form */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Billing Address
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First name */}
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
              />

              {/* Last name */}
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
              />

              {/* Company */}
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name (optional )"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
              />

              {/* Country */}
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors bg-white cursor-pointer"
              >
                <option value="">Country</option>
                <option value="usa">United States</option>
                <option value="canada">Canada</option>
                <option value="uk">United Kingdom</option>
              </select>

              {/* City */}
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Town/City"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
              />

              {/* State */}
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors bg-white cursor-pointer"
              >
                <option value="">State</option>
                <option value="ca">California</option>
                <option value="ny">New York</option>
                <option value="tx">Texas</option>
              </select>

              {/* Zip code */}
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="Zip Code"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
              />

              {/* Address */}
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="State Adress"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
              />

              {/* Phone */}
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
              />

              {/* Payment section */}
              <div className="pt-6 border-t border-gray-200 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Options
                </h3>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="accent-[#C70A24]"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Credit card Baneful
                  </span>
                </label>
              </div>

              {/* Terms agreement */}
              <div className="flex items-start gap-3 pt-6 border-t border-gray-200 mt-8">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 accent-[#C70A24] cursor-pointer"
                  required
                />
                <span className="text-xs text-gray-600">
                  I have read and agree to the website{" "}
                  <Link
                    href="/terms"
                    className="font-medium hover:underline cursor-pointer"
                    style={{ color: "#C70A24" }}
                  >
                    terms and
                    <br />
                    conditions
                  </Link>
                </span>
              </div>

              {/* Submit button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: "#C70A24" }}
                >
                  {loading ? "Processing..." : "Proceed to Bankful"}
                </button>
              </div>
            </form>
          </div>

          {/* Right — Cart totals */}
          <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-20">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Cart Totals
            </h3>

            <div className="space-y-3 mb-6">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal :</span>
                <span style={{ color: "#C70A24" }}>${subtotal.toFixed(2)}</span>
              </div>

              {/* Shipping */}
              <div className="space-y-2">
                <p className="font-semibold text-gray-900 text-sm">Shipping</p>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="shipping"
                    defaultChecked
                    className="accent-[#C70A24]"
                  />
                  <span className="text-gray-900">2 days Air</span>
                  <span className="text-gray-600 ml-auto">
                    Shipping ${shipping.toFixed(2)}
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="shipping"
                    className="accent-[#C70A24]"
                  />
                  <span className="text-gray-900">2 days Air</span>
                  <span className="text-gray-600 ml-auto">Shipping $12.99</span>
                </label>
              </div>

              {/* Route Protection */}
              <div className="flex justify-between text-sm pt-3 border-t border-gray-200">
                <span className="text-gray-600">
                  Route Shipping
                  <br />
                  Protection
                </span>
                <span style={{ color: "#C70A24" }}>
                  ${shippingProtection.toFixed(2)}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span style={{ color: "#C70A24" }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default CheckoutPage;
