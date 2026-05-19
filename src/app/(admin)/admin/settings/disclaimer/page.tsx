"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { message } from "antd";

export default function DisclaimerPage() {
  const [content, setContent] = useState(`# Disclaimer

## General Information
The information provided by Business Hub on this website is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.

## Professional Advice
The site cannot and does not contain professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice.

## External Links
Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with Business Hub. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.

## Limitation of Liability
Under no circumstance shall Business Hub be liable for any loss or damage incurred as a result of the use of the site or reliance on any information provided on the site.

## Product Disclaimer
All products displayed on this website are for informational purposes. Actual products may vary in appearance, packaging, and specifications.

## Medical Disclaimer
The information provided on this site is not intended to diagnose, treat, cure, or prevent any disease. Always consult with a qualified healthcare professional before making any decisions about your health.

## Testimonials
Testimonials on this site are individual experiences and may not be representative of all users. Results may vary.

## Contact Us
If you have any questions about this disclaimer, please contact us at legal@businesshub.com`);

  const handleSave = () => {
    console.log("Disclaimer saved:", content);
    message.success("Disclaimer saved successfully!");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Disclaimer</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your disclaimer content
        </p>
      </div>

      <div className="p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 resize-y min-h-[500px] font-mono"
          placeholder="Enter disclaimer content here..."
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
