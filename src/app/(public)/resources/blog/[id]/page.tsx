import Link from "next/link";

// For Next.js 15+, params is a Promise
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;
  console.log(id);
  // TODO: Replace with API fetch using the id
  // const response = await fetch(`http://localhost:4000/api/blog/${id}`);
  // const blog = await response.json();

  // Temporary static data - shows different content based on id
  const blog = {
    id: parseInt(id),
    title: `Understanding Peptide Purity, Stability, and Consistency - Post ${id}`,
    date: "25 May, 2026 10:30 AM",
    content: `Axonpeptide Independent Verification & Purity Guarantee

At Axon Peptide, we hold our research materials to the highest analytical standards. While every batch is internally tested and issued a Certificate of Analysis (COA), we recognize the importance of independent, third-party validation in the scientific community.

This is blog post number ${id} with unique content that changes based on the ID parameter.

Axonpeptide Independent Verification & Purity Guarantee

At Axon Peptide, we hold our research materials to the highest analytical standards. While every batch is internally tested and issued a Certificate of Analysis (COA), we recognize the importance of independent, third-party validation in the scientific community.`,
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{blog.title}</h1>
        <p className="text-sm text-gray-500">{blog.date}</p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="prose prose-sm max-w-none">
          {blog.content.split("\n\n").map((para, idx) => (
            <div key={idx} className="mb-6">
              {para.split("\n").map((line, lineIdx) => (
                <div key={lineIdx}>
                  {line.match(/^[A-Z][a-zA-Z\s&]+$/) && line.length > 10 ? (
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {line}
                    </h2>
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {line}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Back to blog */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/blog"
            className="text-sm font-medium hover:underline cursor-pointer"
            style={{ color: "#C70A24" }}
          >
            ← Back to Blog
          </Link>
        </div>
      </section>
    </main>
  );
}
