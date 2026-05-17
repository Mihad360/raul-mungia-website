import Image from "next/image";
import Link from "next/link";

const blogs = [
  {
    id: 1,
    title: "Understanding Peptide Purity, Stability, and Consistency",
    date: "25 May,2026",
    image: "blog-1",
  },
  {
    id: 2,
    title: "Understanding Peptide Purity, Stability, and Consistency",
    date: "25 May,2026",
    image: "blog-2",
  },
  {
    id: 3,
    title: "Understanding Peptide Purity, Stability, and Consistency",
    date: "25 May,2026",
    image: "blog-3",
  },
];

const BlogSection = () => {
  return (
    <section className="w-full bg-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header - same as before */}
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Our Latest Blog
          </h2>
          <Link
            href="/blog"
            className="px-5 py-2.5 rounded-lg border text-sm font-semibold hover:border-gray-400 transition-colors"
            style={{ borderColor: "#C70A24", color: "#C70A24" }}
          >
            View More Blog
          </Link>
        </div>

        {/* Blog grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              href={`/resources/blog/${blog.id}`}
              key={blog.id}
              className="block"
            >
              <article className="rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                {/* Image */}
                {/* <div className="relative bg-gray-200 h-48 overflow-hidden">
                  <Image
                    src={blog.image || ""}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div> */}

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{blog.date}</p>
                  <span
                    className="text-sm font-medium hover:underline"
                    style={{ color: "#C70A24" }}
                  >
                    Continue Reading
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
