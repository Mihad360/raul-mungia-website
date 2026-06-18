/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Layers,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { message } from "antd";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";
import RmPagination from "@/components/ui/RmPagination";
import { Loader } from "@/components/shared/Loader";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/api/adminApi";

type Category = {
  _id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

// ─── Category Form Modal (Add / Edit) ─────────────────────────
const CategoryFormModal = ({
  isOpen,
  onClose,
  category,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const isEditing = !!category;

  const handleSubmit = async (data: any) => {
    await onSubmit({
      name: data.name?.trim(),
      description: data.description?.trim() || "",
    });
  };

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Category" : "Add New Category"}
      width="max-w-lg"
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="category-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#C70A24" }}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Category"
                : "Add Category"}
          </button>
        </div>
      }
    >
      <RmForm
        id="category-form"
        onSubmit={handleSubmit}
        defaultValues={{
          name: category?.name || "",
          description: category?.description || "",
        }}
      >
        <div className="space-y-4">
          <RmInput
            name="name"
            label="Category Name"
            placeholder="e.g. Research Peptides"
            required
          />

          <RmInput
            name="description"
            label="Description"
            type="textarea"
            placeholder="Brief description of this category..."
            rows={4}
            helpText="Optional — helps customers understand what's in this category"
          />
        </div>
      </RmForm>
    </RmModal>
  );
};

// ─── Delete Confirmation Modal ────────────────────────────────
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  category,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}) => {
  if (!category) return null;

  return (
    <RmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Category"
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
          <span className="font-semibold text-gray-900">{category.name}</span>?
          Products using this category will need to be re-assigned.
        </p>
      </div>
    </RmModal>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const itemsPerPage = 10;

  const { data: categoriesData, isLoading } = useGetAllCategoriesQuery({});
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const categories: Category[] = categoriesData?.data || [];

  // ─── KPI Calculations ────────────────────────────────────────
  const kpis = useMemo(() => {
    const total = categories.length;
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const recentlyAdded = categories.filter(
      (c) => c.createdAt && new Date(c.createdAt).getTime() >= sevenDaysAgo,
    ).length;
    const withDescription = categories.filter(
      (c) => c.description && c.description.trim().length > 0,
    ).length;

    return { total, recentlyAdded, withDescription };
  }, [categories]);

  // ─── Filter & Paginate ──────────────────────────────────────
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        cat.name.toLowerCase().includes(q) ||
        (cat.description || "").toLowerCase().includes(q)
      );
    });
  }, [searchQuery, categories]);

  useMemo(() => {
    // eslint-disable-next-line react-hooks/set-state-in-render
    setCurrentPage(1);
  }, []);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // ─── Handlers ──────────────────────────────────────────────
  const handleAddCategory = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      await createCategory(data).unwrap();
      message.success("Category added successfully!");
      setIsAddModalOpen(false);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to add category",
      );
    }
  };

  const handleEditCategory = async (data: {
    name: string;
    description: string;
  }) => {
    if (!selectedCategory) return;
    try {
      await updateCategory({
        id: selectedCategory._id,
        body: data,
      }).unwrap();
      message.success("Category updated successfully!");
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to update category",
      );
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      message.success("Category deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to delete category",
      );
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Categories Management
          </h1>
          <p className="text-gray-600">
            Organize your product catalog with categories
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "#C70A24" }}
        >
          <Plus size={18} />
          Add New Category
        </button>
      </div>

      {/* Categories Count Text */}
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{kpis.total}</span>{" "}
          Categories
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search categories by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader size="lg" />
          </div>
        ) : paginatedCategories.length === 0 ? (
          <div className="text-center py-16">
            <Layers size={48} className="mx-auto text-gray-300 mb-3 stroke-1" />
            <p className="text-gray-500 mb-1">
              {searchQuery
                ? "No categories match your search"
                : "No categories yet"}
            </p>
            {!searchQuery && (
              <p className="text-sm text-gray-400">
                Click &quot;Add New Category&quot; to create your first one
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {category.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                        {category.description || (
                          <span className="text-gray-400 italic">
                            No description
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {formatDate(category.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCategories.length > itemsPerPage && (
        <RmPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showFirstLast
        />
      )}

      {/* Modals */}
      <CategoryFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCategory}
        isSubmitting={isCreating}
      />

      <CategoryFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSubmit={handleEditCategory}
        isSubmitting={isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onConfirm={handleDeleteCategory}
        isDeleting={isDeleting}
      />
    </div>
  );
}
