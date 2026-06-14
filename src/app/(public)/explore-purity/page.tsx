// import Navbar from "@/components/shared/Navbar";
import Link from "next/link";

const ExplorePurityPage = () => {
  const sections = [
    {
      title: "Axonpeptide Independent Verification & Purity Guarantee",
      content:
        "At Axon Peptide, we hold our research materials to the highest analytical standards. While every batch is internally tested and issued a Certificate of Analysis (COA), we recognize the importance of independent, third-party validation in the scientific community.",
    },
    {
      title: "Axonpeptide Independent Verification & Purity Guarantee",
      content:
        "At Axon Peptide, we hold our research materials to the highest analytical standards. While every batch is internally tested and issued a Certificate of Analysis (COA), we recognize the importance of independent, third-party validation in the scientific community.",
    },
    {
      title: "Axonpeptide Independent Verification & Purity Guarantee",
      content:
        "At Axon Peptide, we hold our research materials to the highest analytical standards. While every batch is internally tested and issued a Certificate of Analysis (COA), we recognize the importance of independent, third-party validation in the scientific community. At Axon Peptide, we hold our research materials to the highest analytical standards. While every batch is internally tested and issued a Certificate of Analysis (COA), we recognize the importance of independent, third-party validation in the scientific community.",
    },
    {
      title: "Axonpeptide Independent Verification & Purity Guarantee",
      content:
        "At Axon Peptide, we hold our research materials to the highest analytical standards. While every batch is internally tested and issued a Certificate of Analysis (COA), we recognize the importance of independent, third-party validation in the scientific community.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">

      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Explore Purity
        </h1>
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>{" "}
          / Explore Purity
        </p>
      </section>

      {/* Content sections */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-10">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ExplorePurityPage;
