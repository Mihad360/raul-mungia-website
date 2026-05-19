/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { Edit, Trash2, Plus, Calendar } from "lucide-react";
import { message } from "antd";
import RmModal from "@/components/ui/RmModal";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";

type BlogPost = {
  id: string;
  title: string;
  date: string;
  content: string;
  image?: string;
};

export default function BlogPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Understanding Peptide Purity, Stability, and Consistency",
      date: "25 May, 2026",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
    {
      id: "2",
      title: "Understanding Peptide Purity, Stability, and Consistency",
      date: "25 May, 2026",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
  ]);

  const handleAddPost = (data: any) => {
    const newPost: BlogPost = {
      id: (blogPosts.length + 1).toString(),
      title: data.title,
      date: new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      content: data.content,
    };
    setBlogPosts([newPost, ...blogPosts]);
    message.success("Blog post created successfully!");
    setIsAddModalOpen(false);
  };

  const handleEditPost = (data: any) => {
    if (!selectedPost) return;
    const updatedPosts = blogPosts.map((post) =>
      post.id === selectedPost.id
        ? { ...post, title: data.title, content: data.content }
        : post,
    );
    setBlogPosts(updatedPosts);
    message.success("Blog post updated successfully!");
    setIsEditModalOpen(false);
    setSelectedPost(null);
  };

  const handleDeletePost = () => {
    if (!selectedPost) return;
    setBlogPosts(blogPosts.filter((post) => post.id !== selectedPost.id));
    message.success("Blog post deleted successfully!");
    setIsDeleteModalOpen(false);
    setSelectedPost(null);
  };

  const openEditModal = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Blog</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your blog posts</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#C70A24" }}
          >
            <Plus size={16} />
            Add New Post
          </button>
        </div>

        <div className="p-6">
          {blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No blog posts yet</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 text-red-600 hover:text-red-700 font-medium cursor-pointer"
              >
                Create your first post →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar size={14} />
                        <span>{post.date}</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEditModal(post)}
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(post)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Blog Post Modal */}
      <RmModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Blog Post"
        width="max-w-2xl"
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
              form="blog-form"
              className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Create Post
            </button>
          </div>
        }
      >
        <RmForm id="blog-form" onSubmit={handleAddPost}>
          <div className="space-y-4">
            <RmInput
              name="title"
              label="Title"
              placeholder="Enter blog post title"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                name="content"
                placeholder="Enter blog post content..."
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 resize-none"
              />
            </div>
          </div>
        </RmForm>
      </RmModal>

      {/* Edit Blog Post Modal */}
      <RmModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPost(null);
        }}
        title="Edit Blog Post"
        width="max-w-2xl"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedPost(null);
              }}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-blog-form"
              className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Update Post
            </button>
          </div>
        }
      >
        <RmForm
          id="edit-blog-form"
          onSubmit={handleEditPost}
          defaultValues={{
            title: selectedPost?.title || "",
            content: selectedPost?.content || "",
          }}
        >
          <div className="space-y-4">
            <RmInput
              name="title"
              label="Title"
              placeholder="Enter blog post title"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                name="content"
                placeholder="Enter blog post content..."
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 resize-none"
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
          setSelectedPost(null);
        }}
        title="Delete Blog Post"
        width="max-w-md"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedPost(null);
              }}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeletePost}
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
              {selectedPost?.title}
            </span>
            "? This action cannot be undone.
          </p>
        </div>
      </RmModal>
    </>
  );
}
