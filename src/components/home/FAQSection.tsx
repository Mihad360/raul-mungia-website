"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const categories = [
  "General Information",
  "Usage & Research",
  "Quality & Testing",
  "Shipping & Delivery",
  "Order & Returns",
];

// Fixed and deduplicated FAQ data
const faqData = {
  "General Information": [
    {
      q: "What are research peptides and how are they intended to be used?",
      a: "Research peptides are chemical compounds supplied exclusively for laboratory and scientific research. They are designed for analytical, experimental, or educational use in controlled research environments and are not intended for personal, medical, or recreational use.",
    },
    {
      q: "What is the legal status of research peptides?",
      a: "Research peptides are legal to purchase and use for laboratory research purposes. However, regulations may vary by jurisdiction. It is your responsibility to comply with all applicable laws and regulations.",
    },
    {
      q: "Who can purchase research peptides?",
      a: "Research peptides are sold to qualified researchers, laboratories, and educational institutions for scientific purposes only. Proof of research status may be required for certain products.",
    },
  ],
  "Usage & Research": [
    {
      q: "How should research peptides be stored?",
      a: "Store in a cool, dry place away from direct sunlight and moisture. Most peptides should be kept at -20°C or -80°C for long-term storage. Refer to the specific product's Certificate of Analysis (COA) for detailed storage instructions.",
    },
    {
      q: "What is the typical reconstitution process for peptides?",
      a: "Peptides are typically reconstituted using sterile water or bacteriostatic water. Always follow the specific protocol provided with your product. Handle with sterile equipment and avoid introducing contaminants.",
    },
    {
      q: "What are common applications of research peptides in studies?",
      a: "Research peptides are used to study cellular signaling, protein interactions, metabolic pathways, and various biological processes. Specific applications vary by peptide type and research objectives.",
    },
  ],
  "Quality & Testing": [
    {
      q: "Are your peptides third-party tested?",
      a: "Yes, all our peptides undergo rigorous third-party testing for purity, identity, and quality. Each product comes with a Certificate of Analysis (COA) from an independent laboratory.",
    },
    {
      q: "What is the purity guarantee?",
      a: "We guarantee 99% purity for all our research peptides. If any product falls below this standard, we offer a full refund or replacement as outlined in our quality assurance policy.",
    },
    {
      q: "How often are products tested?",
      a: "Every batch of every product is tested before release. We maintain strict quality control protocols and retain samples for ongoing quality verification.",
    },
  ],
  "Shipping & Delivery": [
    {
      q: "How long does shipping take?",
      a: "Orders are processed within 24-48 hours. Standard shipping takes 3-7 business days domestically. International shipping may take 7-14 business days depending on customs clearance.",
    },
    {
      q: "Do you offer international shipping?",
      a: "Yes, we ship to most countries worldwide. International customers are responsible for any customs duties, taxes, or import fees. Please check your local regulations before ordering.",
    },
    {
      q: "How can I track my order?",
      a: "Once your order ships, you will receive a tracking number via email. You can track your package through our website or the carrier's tracking portal.",
    },
  ],
  "Order & Returns": [
    {
      q: "What is your return policy?",
      a: "We offer a 30-day return policy for unopened, undamaged products. If purity falls below 99% as verified by independent testing, we offer a full refund. Contact our support team to initiate a return.",
    },
    {
      q: "How can I cancel or modify my order?",
      a: "Orders can be cancelled or modified within 2 hours of placement. Once processed for shipping, cancellations may not be possible. Contact customer support immediately for assistance.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for qualifying institutions. All payments are processed securely.",
    },
  ],
};

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState("General Information");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const currentFaqs = faqData[activeCategory as keyof typeof faqData] || [];

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with left alignment */}
        <div className="mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Frequently Asked
            <br />
            Questions
          </h2>
          <div className="w-20 h-1 bg-[#C70A24] rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left — category tabs (horizontal wrap like chips) */}
          <div>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setExpandedIndex(null);
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "text-white shadow-md"
                      : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                  }`}
                  style={
                    activeCategory === cat ? { backgroundColor: "#C70A24" } : {}
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right — accordion */}
          <div className="flex flex-col gap-4">
            {currentFaqs.length > 0 ? (
              currentFaqs.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all"
                >
                  {/* Question button */}
                  <button
                    onClick={() =>
                      setExpandedIndex(expandedIndex === idx ? null : idx)
                    }
                    className="w-full px-6 py-5 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-base font-semibold text-gray-900 pr-4">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-gray-400 transition-transform duration-300 ${
                        expandedIndex === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Answer — expand/collapse */}
                  {expandedIndex === idx && (
                    <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                No FAQs available for this category
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
