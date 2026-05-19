"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { message } from "antd";

export default function ShippingPolicyPage() {
  const [content, setContent] = useState(`# Shipping Policy

## Processing Time
Orders are processed within 1-3 business days after payment confirmation. You will receive a confirmation email once your order has been shipped.

## Shipping Rates
Shipping rates are calculated at checkout based on:
- Order weight and dimensions
- Destination location
- Selected shipping method

Free shipping is available on orders over $100 within the continental United States.

## Delivery Times

### Domestic Shipping (USA)
- Standard Shipping: 3-7 business days
- Express Shipping: 1-3 business days
- Overnight Shipping: Next business day

### International Shipping
- Standard International: 7-21 business days
- Express International: 3-7 business days

## Order Tracking
Once your order ships, you will receive a tracking number via email. You can track your package through our website or the carrier's tracking portal.

## Shipping Restrictions
We currently ship to most countries worldwide. However, some restrictions may apply to certain locations due to local regulations.

## Lost or Damaged Packages
If your package is lost or damaged during transit, please contact our customer support within 7 days of the estimated delivery date. We will investigate and provide a resolution.

## Customs and Import Fees
International orders may be subject to customs fees, import duties, and taxes. These charges are the responsibility of the customer and are not included in the shipping cost.

## Address Changes
Please ensure your shipping address is correct at checkout. Contact us immediately if you need to change your address. We cannot modify addresses once the order has been shipped.

## Contact Us
For shipping-related questions, please contact us at shipping@businesshub.com`);

  const handleSave = () => {
    console.log("Shipping Policy saved:", content);
    message.success("Shipping Policy saved successfully!");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Shipping Policy</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your shipping policy
        </p>
      </div>

      <div className="p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 resize-y min-h-[500px] font-mono"
          placeholder="Enter shipping policy content here..."
        />

        <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#C70A24" }}
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
