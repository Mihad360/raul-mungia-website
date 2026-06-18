/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Upload,
  AlertCircle,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { message } from "antd";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";
import RmPagination from "@/components/ui/RmPagination";
import RichEditor from "@/components/ui/RichEditor";
import {
  useGetAllBlogsAdminQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "@/redux/api/adminApi";

// ─── Types ────────────────────────────────────────────────────
type Blog = {
  _id: string;
  title: string;
  content: string;
  image: string;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── Helpers ──────────────────────────────────────────────────
const formatDate = (iso?: string): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ─── KPI Card ─────────────────────────────────────────────────
const KPICard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}) => (
  <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
        style={{ backgroundColor: color }}
      >
        <Icon size={24} />
      </div>
    </div>
    <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

// ─── Blog Card (compact) ──────────────────────────────────────
const BlogCard = ({
  blog,
  onView,
  onEdit,
  onDelete,
}: {
  blog: Blog;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
    {/* Image */}
    <div
      onClick={onView}
      className="relative w-full aspect-video bg-gray-50 cursor-pointer overflow-hidden"
    >
      {blog.image ? (
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageIcon size={32} className="text-gray-300" />
        </div>
      )}
      {/* Status overlay */}
      <div className="absolute top-2 right-2">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            blog.isActive
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {blog.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>

    {/* Body */}
    <div className="p-3">
      <h3
        onClick={onView}
        className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1 cursor-pointer hover:text-[#C70A24] transition-colors"
        title={blog.title}
      >
        {blog.title}
      </h3>

      <p className="text-[11px] text-gray-500 mb-3 flex items-center gap-1">
        <Calendar size={10} />
        {formatDate(blog.createdAt)}
      </p>

      {/* Action buttons */}
      <div className="flex gap-1">
        <button
          onClick={onView}
          title="View"
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
        >
          <Eye size={12} />
        </button>
        <button
          onClick={onEdit}
          title="Edit"
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Edit size={12} />
        </button>
        <button
          onClick={onDelete}
          title="Delete"
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  </div>
);

// ─── Blog Form Modal (Create / Edit) ──────────────────────────
// ─── Blog Form Modal (Create / Edit) ──────────────────────────
const BlogFormModal = ({
  isOpen,
  onClose,
  blog,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  blog?: Blog | null;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const isEditing = !!blog;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageFile(null);
      setImagePreview(blog?.image || "");
      setIsActive(blog?.isActive ?? true);
    }
  }, [isOpen, blog]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      message.error("Image must be less than 5MB");
      return;
    }
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (data: any) => {
    if (!data.title?.trim()) {
      message.error("Title is required");
      return;
    }

    if (!data.content?.trim()) {
      message.error("Content cannot be empty");
      return;
    }

    if (!isEditing && !imageFile) {
      message.error("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        title: data.title.trim(),
        content: data.content.trim(),
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
      title={isEditing ? "Edit Blog" : "Create Blog"}
      width="max-w-2xl"
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
            form="blog-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#C70A24" }}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Blog"
                : "Create Blog"}
          </button>
        </div>
      }
    >
      <RmForm
        id="blog-form"
        onSubmit={handleSubmit}
        defaultValues={{
          title: blog?.title || "",
          content: blog?.content || "",
        }}
      >
        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
          <RmInput
            name="title"
            label="Blog Title"
            placeholder="e.g. Understanding Peptide Purity"
            required
          />

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image{" "}
              {!isEditing && <span className="text-red-500">*</span>}
            </label>

            {imagePreview ? (
              <div className="relative inline-block">
                <div className="relative w-64 h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="256px"
                    unoptimized={imagePreview.startsWith("blob:")}
                  />
                </div>
                <label
                  htmlFor="blog-image-replace"
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center cursor-pointer hover:bg-gray-50"
                >
                  <Edit size={14} className="text-gray-600" />
                </label>
                <input
                  id="blog-image-replace"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            ) : (
              <label
                htmlFor="blog-image-upload"
                className="block border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors cursor-pointer"
              >
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Click to upload featured image
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WebP. Max 5MB
                </p>
                <input
                  id="blog-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Content — plain textarea */}
          <RmInput
            name="content"
            label="Content"
            type="textarea"
            placeholder="Write your blog content here..."
            rows={8}
            required
          />

          {/* Active toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Active Status</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Active blogs are visible to the public
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

// ─── Blog View Modal ──────────────────────────────────────────
const BlogViewModal = ({
  isOpen,
  onClose,
  blog,
}: {
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
}) => {
  if (!blog) return null;

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Blog Details"
      width="max-w-3xl"
    >
      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
        {/* Image */}
        {blog.image && (
          <div className="relative w-full aspect-video bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Title + Meta */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {blog.title}
          </h2>
          <div className="flex items-center gap-3 flex-wrap text-sm">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                blog.isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {blog.isActive ? (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle size={11} /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <XCircle size={11} /> Inactive
                </span>
              )}
            </span>
            <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
              <Calendar size={12} />
              Created {formatDate(blog.createdAt)}
            </span>
            {blog.updatedAt !== blog.createdAt && (
              <span className="text-gray-400 text-xs">
                · Updated {formatDate(blog.updatedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Content */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Content
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {blog.content}
          </p>
        </div>

        {/* ID footer */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-[10px] text-gray-400 font-mono">ID: {blog._id}</p>
        </div>
      </div>
    </RmModal>
  );
};

// ─── Delete Confirmation Modal ────────────────────────────────
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  blogTitle,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  blogTitle: string;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}) => (
  <RmModal
    isOpen={isOpen}
    onClose={onClose}
    title="Delete Blog"
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
        <span className="font-semibold text-gray-900">
          &quot;{blogTitle}&quot;
        </span>
        ? This action cannot be undone.
      </p>
    </div>
  </RmModal>
);

// ─── Main Page ────────────────────────────────────────────────
export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 3 rows × 4 columns

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [viewBlog, setViewBlog] = useState<Blog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);

  // API
  const { data: blogsResponse, isLoading } = useGetAllBlogsAdminQuery({
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchQuery || undefined,
  });

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const blogs: Blog[] = blogsResponse?.data || [];
  const meta = blogsResponse?.meta || {
    page: 1,
    limit: 12,
    total: blogs.length,
    totalPage: 1,
  };

  // Reset page on search
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery]);

  // KPIs
  const kpis = {
    total: meta.total ?? blogs.length,
    active: blogs.filter((b) => b.isActive).length,
    inactive: blogs.filter((b) => !b.isActive).length,
    thisMonth: (() => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return blogs.filter((b) => new Date(b.createdAt) >= start).length;
    })(),
  };

  // Handlers
  const handleCreate = async (formData: FormData) => {
    try {
      await createBlog(formData).unwrap();
      message.success("Blog created successfully!");
      setIsFormOpen(false);
      setEditingBlog(null);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to create blog",
      );
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingBlog) return;
    try {
      await updateBlog({ id: editingBlog._id, formData }).unwrap();
      message.success("Blog updated successfully!");
      setIsFormOpen(false);
      setEditingBlog(null);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to update blog",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBlog(deleteTarget._id).unwrap();
      message.success("Blog deleted successfully!");
      setDeleteTarget(null);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to delete blog",
      );
    }
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setIsFormOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    setIsFormOpen(true);
  };

  const openViewModal = (blog: Blog) => {
    setViewBlog(blog);
    setIsViewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Blog Management
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-md font-semibold">
              Total: {meta.total ?? 0}
            </span>
          </div>
          <p className="text-gray-600">Create and manage your blog posts</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "#C70A24" }}
        >
          <Plus size={18} />
          Create Blog
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search blogs by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50"
        />
      </div>

      {/* Blog Grid */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-100 py-20 flex justify-center">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-3 stroke-1" />
          <p className="text-gray-500 mb-1">
            {searchQuery ? "No blogs match your search" : "No blogs yet"}
          </p>
          {!searchQuery && (
            <p className="text-sm text-gray-400">
              Click &quot;Create Blog&quot; to publish your first post
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onView={() => openViewModal(blog)}
                onEdit={() => openEditModal(blog)}
                onDelete={() => setDeleteTarget(blog)}
              />
            ))}
          </div>

          {meta.totalPage > 1 && (
            <RmPagination
              currentPage={currentPage}
              totalPages={meta.totalPage}
              onPageChange={setCurrentPage}
              showFirstLast
            />
          )}
        </>
      )}

      {/* Modals */}
      <BlogFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBlog(null);
        }}
        blog={editingBlog}
        onSubmit={editingBlog ? handleUpdate : handleCreate}
        isSubmitting={isCreating || isUpdating}
      />

      <BlogViewModal
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setViewBlog(null);
        }}
        blog={viewBlog}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        blogTitle={deleteTarget?.title || ""}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
