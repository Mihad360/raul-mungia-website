/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { message } from "antd";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export default function FAQPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: "1",
      question: "How do I place an order?",
      answer:
        "You can place an order through our mobile app by selecting the services you need and choosing a pickup time.",
      order: 1,
    },
    {
      id: "2",
      question: "How do I place an order?",
      answer:
        "You can place an order through our mobile app by selecting services you need and choosing a pickup time.",
      order: 2,
    },
    {
      id: "3",
      question: "How do I place an order?",
      answer:
        "You can select a service from the list of available services. You can also choose to add a custom service.",
      order: 3,
    },
  ]);

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const handleAddFAQ = (data: any) => {
    const newFAQ: FAQ = {
      id: (faqs.length + 1).toString(),
      question: data.question,
      answer: data.answer,
      order: faqs.length + 1,
    };
    setFaqs([...faqs, newFAQ]);
    message.success("FAQ added successfully!");
    setIsAddModalOpen(false);
  };

  const handleEditFAQ = (data: any) => {
    if (!selectedFAQ) return;
    const updatedFaqs = faqs.map((faq) =>
      faq.id === selectedFAQ.id
        ? { ...faq, question: data.question, answer: data.answer }
        : faq,
    );
    setFaqs(updatedFaqs);
    message.success("FAQ updated successfully!");
    setIsEditModalOpen(false);
    setSelectedFAQ(null);
  };

  const handleDeleteFAQ = () => {
    if (!selectedFAQ) return;
    setFaqs(faqs.filter((faq) => faq.id !== selectedFAQ.id));
    message.success("FAQ deleted successfully!");
    setIsDeleteModalOpen(false);
    setSelectedFAQ(null);
  };

  const openEditModal = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsDeleteModalOpen(true);
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
              Manage your frequently asked questions
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#C70A24" }}
          >
            <Plus size={16} />
            Add FAQ
          </button>
        </div>

        <div className="p-6">
          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No FAQs yet</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 text-red-600 hover:text-red-700 font-medium cursor-pointer"
              >
                Create your first FAQ →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-gray-900">
                      {faq.question}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(faq);
                        }}
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(faq);
                        }}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                      {openItems.has(faq.id) ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </div>
                  </button>
                  {openItems.has(faq.id) && (
                    <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50">
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add FAQ Modal */}
      <RmModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add FAQ"
        width="max-w-lg"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-faq-form"
              className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Add FAQ
            </button>
          </div>
        }
      >
        <RmForm id="add-faq-form" onSubmit={handleAddFAQ}>
          <div className="space-y-5">
            <RmInput
              name="question"
              label="Question"
              placeholder="Enter your question"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                name="answer"
                placeholder="Enter your answer..."
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 resize-none"
                required
              />
            </div>
          </div>
        </RmForm>
      </RmModal>

      {/* Edit FAQ Modal */}
      <RmModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFAQ(null);
        }}
        title="Edit FAQ"
        width="max-w-lg"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedFAQ(null);
              }}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-faq-form"
              className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Update FAQ
            </button>
          </div>
        }
      >
        <RmForm
          id="edit-faq-form"
          onSubmit={handleEditFAQ}
          defaultValues={{
            question: selectedFAQ?.question || "",
            answer: selectedFAQ?.answer || "",
          }}
        >
          <div className="space-y-5">
            <RmInput
              name="question"
              label="Question"
              placeholder="Enter your question"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                name="answer"
                placeholder="Enter your answer..."
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 resize-none"
                required
              />
            </div>
          </div>
        </RmForm>
      </RmModal>

      {/* Delete Confirmation Modal */}
      <RmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFAQ(null);
        }}
        title="Delete FAQ"
        width="max-w-md"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedFAQ(null);
              }}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteFAQ}
              className="flex-1 py-2.5 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Confirm Deletion
          </h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this FAQ? This action cannot be
            undone.
          </p>
        </div>
      </RmModal>
    </>
  );
}
