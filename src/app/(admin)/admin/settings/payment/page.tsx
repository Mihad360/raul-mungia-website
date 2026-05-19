/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Banknote,
  CreditCard,
} from "lucide-react";
import { message } from "antd";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";

type PaymentMethod = {
  id: string;
  bankName: string;
  size: string;
  image: string | null;
  date: string;
};

export default function PaymentMethodPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      bankName: "Bank of America",
      size: "Standard",
      image: null,
      date: "2024-01-15",
    },
    {
      id: "2",
      bankName: "Chase Bank",
      size: "Premium",
      image: null,
      date: "2024-02-20",
    },
    {
      id: "3",
      bankName: "Wells Fargo",
      size: "Business",
      image: null,
      date: "2024-03-10",
    },
  ]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "add" | "edit",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        message.error("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "add") {
          setImagePreview(reader.result as string);
        } else {
          setEditImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMethod = (data: any) => {
    const newMethod: PaymentMethod = {
      id: (paymentMethods.length + 1).toString(),
      bankName: data.bankName,
      size: data.size,
      image: imagePreview,
      date: new Date().toISOString().split("T")[0],
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    message.success("Payment method added successfully!");
    setIsAddModalOpen(false);
    setImagePreview(null);
  };

  const handleEditMethod = (data: any) => {
    if (!selectedMethod) return;
    const updatedMethods = paymentMethods.map((method) =>
      method.id === selectedMethod.id
        ? {
            ...method,
            bankName: data.bankName,
            size: data.size,
            image: editImagePreview || method.image,
          }
        : method,
    );
    setPaymentMethods(updatedMethods);
    message.success("Payment method updated successfully!");
    setIsEditModalOpen(false);
    setSelectedMethod(null);
    setEditImagePreview(null);
  };

  const handleDeleteMethod = () => {
    if (!selectedMethod) return;
    setPaymentMethods(
      paymentMethods.filter((method) => method.id !== selectedMethod.id),
    );
    message.success("Payment method deleted successfully!");
    setIsDeleteModalOpen(false);
    setSelectedMethod(null);
  };

  const openEditModal = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setEditImagePreview(method.image);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Payment Method
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your payment methods
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#C70A24" }}
          >
            <Plus size={16} />
            Add Method
          </button>
        </div>

        <div className="p-6">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No payment methods yet</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 text-red-600 hover:text-red-700 font-medium cursor-pointer"
              >
                Add your first payment method →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                      {method.image ? (
                        <img
                          src={method.image}
                          alt={method.bankName}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        <CreditCard size={24} className="text-red-600" />
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{method.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {method.bankName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Size: {method.size}
                  </p>
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(method)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(method)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <RmModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setImagePreview(null);
        }}
        title="Add Payment Method"
        width="max-w-lg"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setImagePreview(null);
              }}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-payment-form"
              className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Add Method
            </button>
          </div>
        }
      >
        <RmForm id="add-payment-form" onSubmit={handleAddMethod}>
          <div className="space-y-5">
            <RmInput
              name="bankName"
              label="Enter Bank Name"
              placeholder="Enter bank name"
              required
            />
            <RmInput
              name="size"
              label="Size"
              placeholder="Enter size"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Click or drag to upload image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={(e) => handleImageChange(e, "add")}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </RmForm>
      </RmModal>

      {/* Edit Payment Method Modal */}
      <RmModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMethod(null);
          setEditImagePreview(null);
        }}
        title="Edit Payment Method"
        width="max-w-lg"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedMethod(null);
                setEditImagePreview(null);
              }}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-payment-form"
              className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Update Method
            </button>
          </div>
        }
      >
        <RmForm
          id="edit-payment-form"
          onSubmit={handleEditMethod}
          defaultValues={{
            bankName: selectedMethod?.bankName || "",
            size: selectedMethod?.size || "",
          }}
        >
          <div className="space-y-5">
            <RmInput
              name="bankName"
              label="Enter Bank Name"
              placeholder="Enter bank name"
              required
            />
            <RmInput
              name="size"
              label="Size"
              placeholder="Enter size"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                {editImagePreview ? (
                  <div className="relative">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setEditImagePreview(null)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Click or drag to upload image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={(e) => handleImageChange(e, "edit")}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </RmForm>
      </RmModal>

      {/* Delete Confirmation Modal */}
      <RmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMethod(null);
        }}
        title="Delete Payment Method"
        width="max-w-md"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedMethod(null);
              }}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteMethod}
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
            Are you sure you want to delete "
            <span className="font-semibold text-gray-900">
              {selectedMethod?.bankName}
            </span>
            "? This action cannot be undone.
          </p>
        </div>
      </RmModal>
    </>
  );
}
