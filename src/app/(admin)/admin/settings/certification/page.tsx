/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  FileText,
  Award,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { message } from "antd";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";
import {
  useGetAllCertificationsAdminQuery,
  useCreateCertificationMutation,
  useUpdateCertificationMutation,
  useDeleteCertificationMutation,
} from "@/redux/api/adminApi";

// ─── Types ────────────────────────────────────────────────────
type Certification = {
  _id: string;
  title: string;
  size: string;
  image: string;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── Helpers ──────────────────────────────────────────────────
const isPdf = (url: string): boolean =>
  url?.toLowerCase().endsWith(".pdf") || false;

// ─── Status Pill ──────────────────────────────────────────────
const StatusPill = ({
  isActive,
  onToggle,
  disabled,
}: {
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
    disabled={disabled}
    title="Click to toggle status"
    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-50 ${
      isActive
        ? "bg-green-50 text-green-700 hover:bg-green-100"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </button>
);

// ─── Certification Card ───────────────────────────────────────
const CertificationCard = ({
  cert,
  onEdit,
  onDelete,
  onToggle,
  isUpdating,
}: {
  cert: Certification;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  isUpdating: boolean;
}) => {
  const isPdfFile = isPdf(cert.image);

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
      {/* Preview - FIXED: Removed extra <a> tag and href attribute from div */}
      <div
        onClick={() => window.open(cert.image, "_blank")}
        className="relative w-full aspect-square bg-gray-50 cursor-pointer overflow-hidden"
      >
        {cert.image ? (
          isPdfFile ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
              <FileText size={40} className="text-red-600 mb-2" />
              <span className="text-xs font-semibold text-red-700">PDF</span>
              <span className="text-[10px] text-red-600 mt-1 flex items-center gap-1">
                Click to open
                <ExternalLink size={9} />
              </span>
            </div>
          ) : (
            <Image
              src={cert.image}
              alt={cert.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Award size={32} className="text-gray-300" />
          </div>
        )}

        {/* Status overlay */}
        <div className="absolute top-2 right-2">
          <StatusPill
            isActive={cert.isActive}
            onToggle={onToggle}
            disabled={isUpdating}
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-0.5">
          {cert.title}
        </h3>
        <p className="text-[11px] text-gray-500 mb-3 line-clamp-1">
          {cert.size}
        </p>

        {/* Actions */}
        <div className="flex gap-1.5">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Edit size={12} />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Certification Form Modal ─────────────────────────────────
const CertificationFormModal = ({
  isOpen,
  onClose,
  cert,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  cert?: Certification | null;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const isEditing = !!cert;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [previewIsPdf, setPreviewIsPdf] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageFile(null);
      setImagePreview(cert?.image || "");
      setPreviewIsPdf(cert ? isPdf(cert.image) : false);
      setIsActive(cert?.isActive ?? true);
    }
  }, [isOpen, cert]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      message.error("File must be less than 5MB");
      return;
    }
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setPreviewIsPdf(file.type === "application/pdf");
  };

  const handleSubmit = async (data: any) => {
    if (!data.title?.trim()) {
      message.error("Title is required");
      return;
    }
    if (!data.size?.trim()) {
      message.error("Size is required");
      return;
    }
    if (!isEditing && !imageFile) {
      message.error("Certificate file is required");
      return;
    }

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        title: data.title.trim(),
        size: data.size.trim(),
        isActive,
      }),
    );
    if (imageFile) {
      formData.append("image", imageFile);
    }

    await onSubmit(formData);
  };

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Certification" : "Add Certification"}
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
            form="cert-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#C70A24" }}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update"
                : "Add Certification"}
          </button>
        </div>
      }
    >
      <RmForm
        id="cert-form"
        onSubmit={handleSubmit}
        defaultValues={{
          title: cert?.title || "",
          size: cert?.size || "",
        }}
      >
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          <RmInput
            name="title"
            label="Certification Title"
            placeholder="e.g. BPC-157"
            required
          />

          <RmInput
            name="size"
            label="Size"
            placeholder="e.g. 10 mg / Vial"
            required
          />

          {/* File upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate File{" "}
              {!isEditing && <span className="text-red-500">*</span>}
            </label>

            {imagePreview ? (
              <div className="relative inline-block">
                <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  {previewIsPdf ? (
                    <div
                      onClick={() => window.open(imagePreview, "_blank")}
                      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 cursor-pointer"
                    >
                      <FileText size={48} className="text-red-600 mb-2" />
                      <span className="text-sm font-semibold text-red-700">
                        PDF
                      </span>
                      <span className="text-xs text-red-600 mt-1">
                        Click to preview
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain p-2"
                      sizes="192px"
                      unoptimized={imagePreview.startsWith("blob:")}
                    />
                  )}
                </div>
                <label
                  htmlFor="cert-file-replace"
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center cursor-pointer hover:bg-gray-50"
                >
                  <Edit size={14} className="text-gray-600" />
                </label>
                <input
                  id="cert-file-replace"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <label
                htmlFor="cert-file-upload"
                className="block border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors cursor-pointer"
              >
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Click to upload certificate
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WebP, or PDF. Max 5MB
                </p>
                <input
                  id="cert-file-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Active Status</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Show this certificate on the public site
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
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

// ─── Delete Confirmation Modal ────────────────────────────────
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  certTitle,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  certTitle: string;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}) => (
  <RmModal
    isOpen={isOpen}
    onClose={onClose}
    title="Delete Certification"
    width="max-w-md"
    footer={
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
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
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-900">"{certTitle}"</span>? This
        action cannot be undone.
      </p>
    </div>
  </RmModal>
);

// ─── Main Page ────────────────────────────────────────────────
export default function CertificationPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Certification | null>(null);

  // API
  const { data: certsResponse, isLoading } = useGetAllCertificationsAdminQuery(
    {},
  );
  const [createCert, { isLoading: isCreating }] =
    useCreateCertificationMutation();
  const [updateCert, { isLoading: isUpdating }] =
    useUpdateCertificationMutation();
  const [deleteCert, { isLoading: isDeleting }] =
    useDeleteCertificationMutation();

  const certs: Certification[] = certsResponse?.data || [];
  const meta = certsResponse?.meta || { total: certs.length };

  // Handlers
  const handleCreate = async (formData: FormData) => {
    try {
      await createCert(formData).unwrap();
      message.success("Certification added!");
      setIsFormOpen(false);
      setEditingCert(null);
    } catch (err: any) {
      message.error(err?.data?.message || err?.message || "Failed to create");
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingCert) return;
    try {
      await updateCert({ id: editingCert._id, formData }).unwrap();
      message.success("Certification updated!");
      setIsFormOpen(false);
      setEditingCert(null);
    } catch (err: any) {
      message.error(err?.data?.message || err?.message || "Failed to update");
    }
  };

  const handleToggleStatus = async (cert: Certification) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ isActive: !cert.isActive }));
      await updateCert({ id: cert._id, formData }).unwrap();
      message.success(
        `${cert.title} ${!cert.isActive ? "activated" : "deactivated"}`,
      );
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCert(deleteTarget._id).unwrap();
      message.success("Certification deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Certifications</h1>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
              Total: {meta.total ?? 0}
            </span>
          </div>
          <p className="text-gray-600">
            Manage product certifications and credentials
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCert(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "#C70A24" }}
        >
          <Plus size={18} />
          Add Certification
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-100 py-20 flex justify-center">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      ) : certs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <Award size={48} className="mx-auto text-gray-300 mb-3 stroke-1" />
          <p className="text-gray-500 mb-1">No certifications yet</p>
          <p className="text-sm text-gray-400">
            Click "Add Certification" to upload your first one
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {certs.map((cert) => (
            <CertificationCard
              key={cert._id}
              cert={cert}
              onEdit={() => {
                setEditingCert(cert);
                setIsFormOpen(true);
              }}
              onDelete={() => setDeleteTarget(cert)}
              onToggle={() => handleToggleStatus(cert)}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CertificationFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCert(null);
        }}
        cert={editingCert}
        onSubmit={editingCert ? handleUpdate : handleCreate}
        isSubmitting={isCreating || isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        certTitle={deleteTarget?.title || ""}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
