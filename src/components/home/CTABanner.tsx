import Link from "next/link";

const CTABanner = () => {
  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="rounded-3xl overflow-hidden py-16 px-8 text-center relative"
          style={{
            background:
              "linear-gradient(135deg, rgba(219, 112, 147, 0.4) 0%, rgba(219, 112, 147, 0.2) 100%), linear-gradient(to right, #f9c2c8, #f5d5dd)",
          }}
        >
          {/* Decorative overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(circle at 30% 50%, rgba(199,10,36,0.1) 0%, transparent 50%)",
            }}
          />

          <div className="relative z-10">
            {/* Heading */}
            <h2
              className="text-4xl font-bold text-gray-900 mb-4 leading-snug"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Advance Your Research
              <br />
              with Confidence
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-7 max-w-2xl mx-auto">
              Peptides offers research-grade peptides made with strict quality
              control. Each compound is tested for purity and stability using
              advanced methods.
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/shop"
                className="px-7 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#C70A24" }}
              >
                Shop Research Peptids
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3 rounded-lg border border-gray-400 text-gray-800 font-semibold text-sm hover:border-gray-500 transition-colors bg-white"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
