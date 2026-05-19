"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { message } from "antd";

export default function TermsConditionsPage() {
  const [content, setContent] = useState(`# Terms & Conditions

## 1. Acceptance of Terms
By accessing and using this website, you accept and agree to be bound by the terms and conditions outlined here.

## 2. Use of Services
You agree to use our services only for lawful purposes and in accordance with these terms.

## 3. Intellectual Property
All content, trademarks, and data on this website are the property of Business Hub and are protected by copyright laws.

## 4. User Accounts
You are responsible for maintaining the confidentiality of your account credentials.

## 5. Privacy
Your use of our services is also governed by our Privacy Policy.

## 6. Limitations of Liability
Business Hub shall not be liable for any indirect, incidental, or consequential damages.

## 7. Changes to Terms
We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance of updated terms.

## 8. Contact Information
For questions about these terms, please contact us at legal@businesshub.com`);

  const handleSave = () => {
    console.log("Terms & Conditions saved:", content);
    message.success("Terms & Conditions saved successfully!");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          Terms & Conditions
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your terms and conditions
        </p>
      </div>

      <div className="p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 resize-y min-h-[500px] font-mono"
          placeholder="Enter terms and conditions content here..."
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
