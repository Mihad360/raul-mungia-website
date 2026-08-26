"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

type BlogSectionProps = {
  variant?: "page" | "home";
};

const BlogSection = ({ variant = "page" }: BlogSectionProps) => {
  const isHome = variant === "home";
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, isError } = useGetAllBlogsQuery(undefined);

  const blogs: IBlog[] = data?.data || [];
  const visibleBlogs = isHome ? blogs.slice(0, 3) : blogs;

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
      <section className={isHome ? "w-full bg-white py-14" : "min-h-screen bg-white"}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex justify-center">
          <Loader size="lg" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={isHome ? "w-full bg-white py-14" : "min-h-screen bg-white"}>
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-gray-600 mb-2">Failed to load blogs</p>
          <p className="text-sm text-gray-400">Please try again later</p>
        </div>
      </section>
    );
  }

  if (isHome && visibleBlogs.length === 0) {
    return null;
  }

  return (
    <section className={isHome ? "w-full bg-white py-14" : "min-h-screen bg-white"}>
      <div className="max-w-7xl mx-auto px-6">
        {isHome ? (
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-2 block">
                Insights
              </span>
              <h2
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "Georgia, serif" }}
              >
                From the lab journal
              </h2>
            </div>
            <Link
              href="/resources/blog"
              className="hidden sm:inline-flex text-sm font-semibold text-neutral-700 hover:text-neutral-900"
            >
              View all articles →
            </Link>
          </div>
        ) : (
          <div className="py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
            <p className="text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>{" "}
              / Blog
            </p>
          </div>
        )}

        {visibleBlogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No blog posts available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleBlogs.map((blog) => (
              <article
                key={blog._id}
                onClick={() => handleReadMore(blog)}
                className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group bg-white"
              >
                {blog.image && (
                  <div className="relative bg-neutral-100 aspect-[16/10] overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-contain group-hover:scale-[1.02] transition-transform duration-300"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                )}

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
                  <span className="text-sm font-semibold text-neutral-700 group-hover:text-neutral-900 inline-flex items-center gap-1">
                    Read More →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {isHome && blogs.length > 3 && (
          <div className="flex justify-center mt-10 sm:hidden">
            <Link
              href="/resources/blog"
              className="px-6 py-2.5 rounded-lg border border-neutral-300 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors"
            >
              View all articles
            </Link>
          </div>
        )}
      </div>

      {showModal && selectedBlog && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedBlog.title}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {selectedBlog.image && (
                <div className="relative w-full aspect-[16/9] mb-6 rounded-lg overflow-hidden bg-neutral-100">
                  <Image
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    fill
                    className="object-contain"
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
                type="button"
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
    </section>
  );
};

export default BlogSection;
