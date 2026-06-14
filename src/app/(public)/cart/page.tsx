"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const CartPage = () => {
  // TODO: Replace with Redux selector
  // const cartItems = useAppSelector(selectCartItems);
  // const dispatch = useAppDispatch();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "T-Trizenix",
      size: "10 mg",
      price: 49.99,
      quantity: 1,
      image: "/product.jpg",
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 150 ? 0 : 12.99;
  const shippingProtection = 2.99;
  const total = subtotal + shipping + shippingProtection;

  const handleRemoveItem = (id: number) => {
    // TODO: Dispatch removeFromCart(id)
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = () => {
    // TODO: Call API to validate coupon
    if (couponCode.trim()) {
      setCouponApplied(true);
    }
  };

  const freeShippingNeeded = Math.max(0, 150 - subtotal);

  return (
    <main className="min-h-screen bg-white">
      {/* Progress bar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-4 text-sm font-medium">
          <span className="font-semibold" style={{ color: "#C70A24" }}>
            Shopping Cart
          </span>
          <span className="text-gray-400">→</span>
          <span className="text-gray-600">Checkout</span>
          <span className="text-gray-400">→</span>
          <span className="text-gray-600">Order Complete</span>
        </div>
      </div>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left — cart items & coupon */}
          <div className="md:col-span-2 space-y-8">
            {/* Free shipping message */}
            {freeShippingNeeded > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">ⓘ</span>
                  <span className="text-sm text-gray-700">
                    You only need{" "}
                    <strong>${freeShippingNeeded.toFixed(2)}</strong> more to
                    get free shipping
                  </span>
                  <Link
                    href="/shop"
                    className="ml-auto text-sm font-medium hover:underline cursor-pointer"
                    style={{ color: "#C70A24" }}
                  >
                    Continue Shopping
                  </Link>
                </div>
                <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      backgroundColor: "#C70A24",
                      width: `${Math.max(0, (subtotal / 150) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Cart items table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Product
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Quantity
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-4 flex items-center gap-4">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <X size={18} />
                        </button>
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <div
                            className="w-6 h-8 rounded"
                            style={{
                              background:
                                "linear-gradient(180deg, #9ca3af 0%, #6b7280 100%)",
                              borderTop: "2px solid #C70A24",
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">{item.size}</p>
                        </div>
                      </td>
                      <td className="py-4 text-gray-900 font-medium">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-4 text-gray-900">{item.quantity}</td>
                      <td
                        className="py-4 font-medium"
                        style={{ color: "#C70A24" }}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Coupon section */}
            <div className="flex gap-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon Code"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-6 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
                style={{ backgroundColor: "#C70A24" }}
              >
                Apply Coupon
              </button>
            </div>
          </div>

          {/* Right — Cart totals */}
          <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-20">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Cart Totals
            </h3>

            <div className="space-y-4 mb-6">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal :</span>
                <span className="font-medium" style={{ color: "#C70A24" }}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* Shipping options */}
              <div className="space-y-3">
                <p className="font-semibold text-gray-900 text-sm">Shipping</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    defaultChecked
                    className="accent-[#C70A24]"
                  />
                  <div className="flex-1 flex justify-between text-sm">
                    <span className="font-medium text-gray-900">
                      2 days Air
                    </span>
                    <span className="text-gray-600">
                      Shipping ${shipping.toFixed(2)}
                    </span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    className="accent-[#C70A24]"
                  />
                  <div className="flex-1 flex justify-between text-sm">
                    <span className="font-medium text-gray-900">
                      2 days Air
                    </span>
                    <span className="text-gray-600">Shipping $12.99</span>
                  </div>
                </label>
              </div>

              {/* Shipping protection */}
              <div className="flex justify-between text-sm pt-4 border-t border-gray-200">
                <span className="text-gray-600">
                  Route Shipping
                  <br />
                  Protection
                </span>
                <span className="font-medium" style={{ color: "#C70A24" }}>
                  ${shippingProtection.toFixed(2)}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span style={{ color: "#C70A24" }}>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout button */}
            <Link
              href="/cart/checkout"
              className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 block text-center cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;
