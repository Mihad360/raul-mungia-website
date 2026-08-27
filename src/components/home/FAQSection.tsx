"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useGetAllFaqsQuery } from "@/redux/api/settingsApi";
import { Loader } from "@/components/shared/Loader";
import {
  FAQ_CATEGORIES,
  resolveFaqCategory,
  type IFaq,
} from "@/constants/faq";

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>(
    FAQ_CATEGORIES[0],
  );
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const { data, isLoading, isError } = useGetAllFaqsQuery({
    limit: 100,
  });

  const faqs: IFaq[] = Array.isArray(data?.data) ? data.data : [];

  const grouped = useMemo(() => {
    const map: Record<string, IFaq[]> = {};
    for (const faq of faqs) {
      const category = resolveFaqCategory(faq.category);
      if (!map[category]) map[category] = [];
      map[category].push(faq);
    }
    for (const category of Object.keys(map)) {
      map[category].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return map;
  }, [faqs]);

  const visibleCategories = useMemo(() => {
    const known = FAQ_CATEGORIES.filter(
      (category) => (grouped[category]?.length ?? 0) > 0,
    );
    const extra = Object.keys(grouped).filter(
      (category) =>
        !(FAQ_CATEGORIES as readonly string[]).includes(category) &&
        grouped[category].length > 0,
    );
    return [...known, ...extra];
  }, [grouped]);

  useEffect(() => {
    if (visibleCategories.length === 0) return;
    if (!visibleCategories.includes(activeCategory)) {
      setActiveCategory(visibleCategories[0]);
      setExpandedIndex(0);
    }
  }, [visibleCategories, activeCategory]);

  const currentFaqs = grouped[activeCategory] || [];

  if (isLoading) {
    return (
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <Loader size="lg" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600 mb-2">Failed to load FAQs</p>
          <p className="text-sm text-gray-400">Please try again later</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {visibleCategories.length === 0 ? (
          <>
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
            <p className="text-gray-500">No FAQs available yet.</p>
          </>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* ── Left: heading + category nav ── */}
            <div className="lg:w-72 xl:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <h2
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Frequently
                  <br />
                  Asked
                  <br />
                  Questions
                </h2>
                <div className="w-20 h-1 bg-[#C70A24] rounded-full mb-8" />

                {/* Category pills — vertical on desktop, horizontal scroll on mobile */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                  {visibleCategories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setExpandedIndex(0);
                      }}
                      className={`flex-shrink-0 text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeCategory === cat
                          ? "text-white shadow-sm"
                          : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                      }`}
                      style={
                        activeCategory === cat
                          ? { backgroundColor: "#C70A24" }
                          : {}
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: FAQ accordions ── */}
            <div className="flex-1 flex flex-col gap-3">
              {currentFaqs.length > 0 ? (
                currentFaqs.map((item, idx) => (
                  <FaqItem
                    key={item._id}
                    item={item}
                    isOpen={expandedIndex === idx}
                    onToggle={() =>
                      setExpandedIndex(expandedIndex === idx ? null : idx)
                    }
                  />
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No FAQs available for this category
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* ── FAQ accordion item ── */
const FaqItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: IFaq;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full px-6 py-5 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
    >
      <span className="text-base font-semibold text-gray-900 pr-4">
        {item.question}
      </span>
      <ChevronDown
        size={20}
        className={`shrink-0 text-gray-400 transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {isOpen && (
      <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {item.answer}
        </p>
      </div>
    )}
  </div>
);

export default FAQSection;
