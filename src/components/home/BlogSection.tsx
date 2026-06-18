"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CTABanner from "@/components/home/CTABanner";
import { useGetAllBlogsQuery } from "@/redux/api/settingsApi";
import { Loader } from "@/components/shared/Loader";

interface IBlog {
  _id: string;
  title: string;
  content: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const BlogPage = () => {
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, isError } = useGetAllBlogsQuery(undefined);

  const blogs: IBlog[] = data?.data || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleReadMore = (blog: IBlog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <section className="max-w-7xl mx-auto px-6 py-20 flex justify-center">
          <Loader size="lg" />
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-white">
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-600 mb-2">Failed to load blogs</p>
          <p className="text-sm text-gray-400">Please try again later</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>{" "}
          / Blog
        </p>
      </section>

      {/* Blog grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No blog posts available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                onClick={() => handleReadMore(blog)}
                className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group cursor-pointer"
              >
                {/* Image */}
                {blog.image && (
                  <div className="relative bg-gray-200 h-56 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-2">
                    {formatDate(blog.createdAt)}
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {blog.content}
                  </p>
                  <span
                    className="text-sm font-semibold hover:underline inline-flex items-center gap-1"
                    style={{ color: "#C70A24" }}
                  >
                    Read More →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <CTABanner />

      {/* Blog Modal */}
      {showModal && selectedBlog && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedBlog.title}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {selectedBlog.image && (
                <div className="relative w-full h-80 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-gray-400 mb-4">
                Published on {formatDate(selectedBlog.createdAt)}
              </p>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedBlog.content}
                </p>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#C70A24" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BlogPage;
