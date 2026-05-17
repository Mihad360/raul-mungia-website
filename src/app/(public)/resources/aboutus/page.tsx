/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

const AboutPage = () => {
  const whyChooseUs = [
    {
      number: "01",
      title: "Choose Products",
      desc: "Select the perfect products matched to your project needs.",
    },
    {
      number: "02",
      title: "Verified Quality",
      desc: "Each order receives batch-tested purity certificates verified via Analysis.",
    },
    {
      number: "03",
      title: "Secure Delivery",
      desc: "Products are securely packaged and shipped with tracking for your safety.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">About US</h1>
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>{" "}
          / About US
        </p>
      </section>

      {/* Main content - 2 col */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — text content */}
          <div>
            <h2
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Precision Purity
            </h2>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Scientific Integrity
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              In a market full of shortcuts and questionable claims, we deliver
              premium-grade research peptides of the highest purity, no hidden
              fees just verified purity, transparent testing, and a guarantee
              that backs every order. Because real science demands real
              standards.
            </p>

            {/* Checklist */}
            <div className="space-y-3 mb-7">
              <div className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#C70A24" }}
                >
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    99% Tested Purity
                  </p>
                  <p className="text-xs text-gray-500">
                    We ensure a minimum of 99% purity on all of our peptides, or
                    your money back.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#C70A24" }}
                >
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Complete Transparency
                  </p>
                  <p className="text-xs text-gray-500">
                    We don't just claim quality we verify it. It's one standard
                    we follow.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#C70A24" }}
                >
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Expert Support
                  </p>
                  <p className="text-xs text-gray-500">
                    Our team is available to answer your questions anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA button */}
            <button
              className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Contact With Expert →
            </button>
          </div>

          {/* Right — image placeholder */}
          <div className="rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
            <div
              className="w-48 h-48 rounded-full opacity-60"
              style={{
                background:
                  "radial-gradient(circle, rgba(100,150,200,0.3) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Quality section - same as home but here for About */}
      <section className="w-full py-16" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-2 block">
              Research Peptides
            </span>
            <h2
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Quality You Can Rely On
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Left features */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="text-gray-700 text-2xl">✓</div>
                <p className="text-sm font-semibold text-gray-900">
                  99% HPLC-Tested Purity
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Every batch is lab-verified for accuracy, reliability, and
                  consistent research outcomes.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-gray-700 text-2xl">🤝</div>
                <p className="text-sm font-semibold text-gray-900">
                  Trusted by Researchers
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Our products are used across labs, clinics, and scientific
                  teams for consistent results.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-gray-700 text-2xl">📋</div>
                <p className="text-sm font-semibold text-gray-900">
                  Research-Grade Quality
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Premium peptides at industry-leading prices without
                  compromising standards.
                </p>
              </div>
            </div>

            {/* Center — product image */}
            <div className="flex items-center justify-center">
              <div
                className="w-56 h-72 rounded-3xl flex items-end justify-center overflow-hidden"
                style={{ backgroundColor: "#f9c2c8" }}
              >
                <div
                  className="w-28 h-56 rounded-t-xl shadow-2xl mb-0"
                  style={{
                    background:
                      "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
                    borderTop: "7px solid #C70A24",
                  }}
                />
              </div>
            </div>

            {/* Right features */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="text-gray-700 text-2xl">💬</div>
                <p className="text-sm font-semibold text-gray-900">
                  Expert Support
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Our team is available by email or phone to assist with any
                  product questions.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-gray-700 text-2xl">🛡️</div>
                <p className="text-sm font-semibold text-gray-900">
                  purity guarantee
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  If purity falls under 99%, contact us for a full refund. Your
                  research deserves accountability.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-gray-700 text-2xl">🚚</div>
                <p className="text-sm font-semibold text-gray-900">
                  Fast, Reliable Shipping
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Same-day shipping before 1 PM PST. Free shipping over $150.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us - 3 col */}
      <section className="w-full bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-2 block">
              Supply Process
            </span>
            <h2
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Why Choose US
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseUs.map((item) => (
              <div
                key={item.number}
                className="p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div
                  className="text-4xl font-bold mb-3"
                  style={{ color: "#C70A24" }}
                >
                  {item.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
