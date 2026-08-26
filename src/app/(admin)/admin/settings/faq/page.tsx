/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { message } from "antd";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";
import RmSelect from "@/components/ui/RmSelect";
import { Loader } from "@/components/shared/Loader";
import {
  FAQ_CATEGORIES,
  FAQ_CATEGORY_OPTIONS,
  resolveFaqCategory,
  type IFaq,
} from "@/constants/faq";
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetAllFaqsAdminQuery,
  useUpdateFaqMutation,
} from "@/redux/api/adminApi";

type FaqFormValues = {
  question: string;
  answer: string;
  category: string;
  order?: number | string;
};

const FaqFormModal = ({
  isOpen,
  onClose,
  faq,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  faq?: IFaq | null;
  onSubmit: (payload: {
    question: string;
    answer: string;
    category: string;
    order?: number;
    isActive: boolean;
  }) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const isEditing = !!faq;
  const [isActive, setIsActive] = useState(faq?.isActive !== false);

  const handleSubmit = async (data: FaqFormValues) => {
    const orderValue =
      data.order === "" || data.order == null ? undefined : Number(data.order);

    await onSubmit({
      question: data.question?.trim(),
      answer: data.answer?.trim(),
      category: data.category,
      order: Number.isFinite(orderValue as number) ? orderValue : undefined,
      isActive,
    });
  };

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit FAQ" : "Add FAQ"}
      width="max-w-lg"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="faq-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#C70A24" }}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update FAQ"
                : "Add FAQ"}
          </button>
        </div>
      }
    >
      <RmForm
        id="faq-form"
        onSubmit={handleSubmit}
        defaultValues={{
          question: faq?.question || "",
          answer: faq?.answer || "",
          category: resolveFaqCategory(faq?.category),
          order: faq?.order ?? "",
        }}
      >
        <div className="space-y-4">
          <RmSelect
            name="category"
            label="Category"
            placeholder="Select a category"
            options={FAQ_CATEGORY_OPTIONS}
            allowClear={false}
          />
          <RmInput
            name="question"
            label="Question"
            placeholder="Enter your question"
            required
          />
          <RmInput
            name="answer"
            label="Answer"
            type="textarea"
            placeholder="Enter your answer..."
            rows={5}
            required
          />
          <RmInput
            name="order"
            label="Display order"
            type="number"
            placeholder="0"
            helpText="Lower numbers appear first within the category"
          />
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Visible on site</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Hidden FAQs stay in the dashboard but are not shown publicly
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive((value) => !value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                isActive ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </RmForm>
    </RmModal>
  );
};

export default function FAQPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<IFaq | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const { data, isLoading, isError } = useGetAllFaqsAdminQuery({
    limit: 100,
  });
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const faqs: IFaq[] = Array.isArray(data?.data) ? data.data : [];

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: faqs.length };
    for (const category of FAQ_CATEGORIES) map[category] = 0;
    for (const faq of faqs) {
      const category = resolveFaqCategory(faq.category);
      map[category] = (map[category] || 0) + 1;
    }
    return map;
  }, [faqs]);

  const visibleFaqs = useMemo(() => {
    const filtered =
      activeCategory === "All"
        ? faqs
        : faqs.filter(
            (faq) => resolveFaqCategory(faq.category) === activeCategory,
          );
    return [...filtered].sort((a, b) => {
      const categoryA = FAQ_CATEGORIES.indexOf(
        resolveFaqCategory(a.category) as (typeof FAQ_CATEGORIES)[number],
      );
      const categoryB = FAQ_CATEGORIES.indexOf(
        resolveFaqCategory(b.category) as (typeof FAQ_CATEGORIES)[number],
      );
      const rankA = categoryA === -1 ? FAQ_CATEGORIES.length : categoryA;
      const rankB = categoryB === -1 ? FAQ_CATEGORIES.length : categoryB;
      if (rankA !== rankB) return rankA - rankB;
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [faqs, activeCategory]);

  const toggleItem = (id: string) => {
    const next = new Set(openItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenItems(next);
  };

  const handleSubmit = async (payload: {
    question: string;
    answer: string;
    category: string;
    order?: number;
    isActive: boolean;
  }) => {
    if (!payload.question || !payload.answer || !payload.category) {
      message.error("Question, answer, and category are required");
      return;
    }

    try {
      if (selectedFAQ) {
        await updateFaq({ id: selectedFAQ._id, body: payload }).unwrap();
        message.success("FAQ updated successfully");
      } else {
        await createFaq(payload).unwrap();
        message.success("FAQ added successfully");
      }
      setIsFormOpen(false);
      setSelectedFAQ(null);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to save FAQ",
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedFAQ) return;
    try {
      await deleteFaq(selectedFAQ._id).unwrap();
      message.success("FAQ deleted successfully");
      setIsDeleteOpen(false);
      setSelectedFAQ(null);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to delete FAQ",
      );
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              These questions appear on the homepage and FAQ page
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedFAQ(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#C70A24" }}
          >
            <Plus size={16} />
            Add FAQ
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {["All", ...FAQ_CATEGORIES].map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === category
                    ? "text-white"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
                style={
                  activeCategory === category
                    ? { backgroundColor: "#C70A24" }
                    : undefined
                }
              >
                {category}
                <span className="ml-1.5 opacity-80">
                  {counts[category] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Loader size="lg" />
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Failed to load FAQs</p>
              <p className="text-sm text-gray-400 mt-1">
                Check that the API is running and try again
              </p>
            </div>
          ) : visibleFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No FAQs in this category yet</p>
              <button
                onClick={() => {
                  setSelectedFAQ(null);
                  setIsFormOpen(true);
                }}
                className="mt-4 text-red-600 hover:text-red-700 font-medium cursor-pointer"
              >
                Create your first FAQ →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleFaqs.map((faq) => (
                <div
                  key={faq._id}
                  className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq._id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="pr-4">
                      <span className="font-semibold text-gray-900">
                        {faq.question}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {resolveFaqCategory(faq.category)}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            faq.isActive !== false
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {faq.isActive !== false ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFAQ(faq);
                          setIsFormOpen(true);
                        }}
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFAQ(faq);
                          setIsDeleteOpen(true);
                        }}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                      {openItems.has(faq._id) ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </div>
                  </button>
                  {openItems.has(faq._id) && (
                    <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50">
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <FaqFormModal
          key={selectedFAQ?._id ?? "create"}
          isOpen={isFormOpen}
          faq={selectedFAQ}
          isSubmitting={isCreating || isUpdating}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedFAQ(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      <RmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedFAQ(null);
        }}
        title="Delete FAQ"
        width="max-w-md"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedFAQ(null);
              }}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Confirm Deletion
          </h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this FAQ? It will no longer appear
            on the website.
          </p>
        </div>
      </RmModal>
    </>
  );
}
