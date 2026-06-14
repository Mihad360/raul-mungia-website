/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { message } from "antd";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";
import Image from "next/image";

type Certification = {
  id: string;
  title: string;
  size: string;
  image: string | null;
  date: string;
};

export default function CertificationPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] =
    useState<Certification | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "1",
      title: "ISO 9001:2024",
      size: "A4",
      image: null,
      date: "2024-01-15",
    },
    {
      id: "2",
      title: "GMP Certification",
      size: "A3",
      image: null,
      date: "2024-02-20",
    },
    {
      id: "3",
      title: "FDA Approved",
      size: "Letter",
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

  const handleAddCertification = (data: any) => {
    const newCertification: Certification = {
      id: (certifications.length + 1).toString(),
      title: data.title,
      size: data.size,
      image: imagePreview,
      date: new Date().toISOString().split("T")[0],
    };
    setCertifications([...certifications, newCertification]);
    message.success("Certification added successfully!");
    setIsAddModalOpen(false);
    setImagePreview(null);
  };

  const handleEditCertification = (data: any) => {
    if (!selectedCertification) return;
    const updatedCertifications = certifications.map((cert) =>
      cert.id === selectedCertification.id
        ? {
            ...cert,
            title: data.title,
            size: data.size,
            image: editImagePreview || cert.image,
          }
        : cert,
    );
    setCertifications(updatedCertifications);
    message.success("Certification updated successfully!");
    setIsEditModalOpen(false);
    setSelectedCertification(null);
    setEditImagePreview(null);
  };

  const handleDeleteCertification = () => {
    if (!selectedCertification) return;
    setCertifications(
      certifications.filter((cert) => cert.id !== selectedCertification.id),
    );
    message.success("Certification deleted successfully!");
    setIsDeleteModalOpen(false);
    setSelectedCertification(null);
  };

  const openEditModal = (certification: Certification) => {
    setSelectedCertification(certification);
    setEditImagePreview(certification.image);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (certification: Certification) => {
    setSelectedCertification(certification);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Certification
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your certifications and credentials
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#C70A24" }}
          >
            <Plus size={16} />
            Add Certification
          </button>
        </div>

        <div className="p-6">
          {certifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No certifications yet</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 text-red-600 hover:text-red-700 font-medium cursor-pointer"
              >
                Create your first certification →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-all"
                >
                  {cert.image ? (
                    <div className="mb-4">
                      <Image
                        src={cert.image}
                        alt="Preview"
                        fill
                        className="object-contain rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Upload size={32} className="text-gray-400" />
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Size: {cert.size}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Added: {cert.date}
                  </p>
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(cert)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(cert)}
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

      {/* Add Certification Modal */}
      <RmModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setImagePreview(null);
        }}
        title="Add Certification"
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
              form="add-certification-form"
              className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Add Certification
            </button>
          </div>
        }
      >
        <RmForm id="add-certification-form" onSubmit={handleAddCertification}>
          <div className="space-y-5">
            <RmInput
              name="title"
              label="Certification Title"
              placeholder="Enter certification title"
              required
            />
            <RmInput
              name="size"
              label="Size"
              placeholder="Enter size (e.g., A4, A3, Letter)"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                      Click or drag to upload certification
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG or PDF. Max size 2MB
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,application/pdf"
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

      {/* Edit Certification Modal */}
      <RmModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCertification(null);
          setEditImagePreview(null);
        }}
        title="Edit Certification"
        width="max-w-lg"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedCertification(null);
                setEditImagePreview(null);
              }}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-certification-form"
              className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Update Certification
            </button>
          </div>
        }
      >
        <RmForm
          id="edit-certification-form"
          onSubmit={handleEditCertification}
          defaultValues={{
            title: selectedCertification?.title || "",
            size: selectedCertification?.size || "",
          }}
        >
          <div className="space-y-5">
            <RmInput
              name="title"
              label="Certification Title"
              placeholder="Enter certification title"
              required
            />
            <RmInput
              name="size"
              label="Size"
              placeholder="Enter size (e.g., A4, A3, Letter)"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                {editImagePreview ? (
                  <div className="relative">
                    <Image
                      src={editImagePreview}
                      alt="Preview"
                      fill
                      className="object-contain rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                      Click or drag to upload certification
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG or PDF. Max size 2MB
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,application/pdf"
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
          setSelectedCertification(null);
        }}
        title="Delete Certification"
        width="max-w-md"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedCertification(null);
              }}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCertification}
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
              {selectedCertification?.title}
            </span>
            "? This action cannot be undone.
          </p>
        </div>
      </RmModal>
    </>
  );
}
