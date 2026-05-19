"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { message } from "antd";

export default function ExplorePurityPage() {
  const [content, setContent] = useState(`# Explore Purity

## Our Commitment to Purity
At Business Hub, purity is not just a standard—it's our promise. We are committed to providing products of the highest purity levels, backed by rigorous testing and quality assurance protocols.

## What is Purity?
Purity refers to the percentage of active ingredient in a product, free from contaminants, impurities, or diluents. Higher purity means better efficacy and safety.

## Our Purity Standards

### 99%+ Purity Guarantee
All our products undergo multiple rounds of testing to ensure they meet or exceed 99% purity standards.

### Third-Party Testing
We partner with independent, ISO-certified laboratories to verify the purity of every batch before it reaches our customers.

### Heavy Metal Testing
Every product is screened for heavy metals including lead, mercury, arsenic, and cadmium.

### Residual Solvent Analysis
We test for residual solvents to ensure complete removal during the manufacturing process.

## Certifications

### ISO 9001:2024
Quality management system certification ensuring consistent product quality.

### GMP Compliance
Good Manufacturing Practices certified facility for pharmaceutical-grade production.

### FDA Registered Facility
Our manufacturing facility is registered with the FDA and follows strict guidelines.

## Quality Control Process

1. **Raw Material Testing** - All incoming materials are tested before production
2. **In-Process Testing** - Samples are taken during production for real-time quality checks
3. **Final Product Testing** - Every batch undergoes comprehensive purity analysis
4. **Stability Testing** - Products are tested over time to ensure purity remains consistent
5. **Certificate of Analysis** - Each order includes a detailed CoA with purity results

## Why Purity Matters

### Safety
Higher purity means fewer contaminants that could cause adverse reactions.

### Efficacy
Pure compounds perform predictably and deliver consistent results.

### Reliability
Standardized purity ensures you get the same quality every time you order.

## Transparency
We believe in complete transparency. You can request the Certificate of Analysis for any product batch by contacting our support team.

## Our Promise
Every product you receive from Business Hub comes with:
- Verified purity of 99% or higher
- Complete chain of custody documentation
- Batch-specific test results available upon request
- Money-back guarantee if purity standards aren't met

## Contact Our Quality Team
For detailed purity reports or questions about our testing protocols, contact our quality assurance team at quality@businesshub.com`);

  const handleSave = () => {
    console.log("Explore Purity saved:", content);
    message.success("Explore Purity saved successfully!");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Explore Purity</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your purity information and standards
        </p>
      </div>

      <div className="p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 resize-y min-h-[500px] font-mono"
          placeholder="Enter explore purity content here..."
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
