/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { Loader } from "@/components/shared/Loader";
import { useGetAllAboutQuery } from "@/redux/api/settingsApi";

interface IAbout {
  _id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const AboutPage = () => {
  const {
    data: aboutData,
    isLoading,
    isError,
  } = useGetAllAboutQuery(undefined);
  const about: IAbout | undefined = aboutData?.data;

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

      {/* Main content — centered single column with admin-managed HTML */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader size="lg" />
          </div>
        ) : isError || !about?.description ? (
          <div className="text-center space-y-4 py-20">
            <h2
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              About Us
            </h2>
            <p className="text-sm text-gray-500">
              Content is being updated. Please check back soon.
            </p>
          </div>
        ) : (
          <>
            {/* Admin-managed HTML — left-aligned for readability inside centered container */}
            <div
              className="space-y-4 text-gray-600 leading-relaxed
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-6 [&_h1]:mb-3
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-2
                [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-gray-900 [&_h4]:mt-4 [&_h4]:mb-2
                [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-gray-600 [&_p]:my-3
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:text-base
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-4 [&_ol]:text-base
                [&_li]:text-gray-600 [&_li]:leading-relaxed
                [&_a]:text-[#C70A24] [&_a]:underline hover:[&_a]:opacity-80
                [&_strong]:font-semibold [&_strong]:text-gray-900
                [&_em]:italic
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#C70A24] [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-4
                [&_img]:rounded-lg [&_img]:my-4 [&_img]:mx-auto"
              dangerouslySetInnerHTML={{ __html: about.description }}
            />

            {/* CTA button — centered below content */}
            <div className="flex justify-center mt-10">
              <button
                className="px-6 py-3 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
                style={{ backgroundColor: "#C70A24" }}
              >
                Contact With Expert →
              </button>
            </div>
          </>
        )}
      </section>

      {/* Quality section (static) */}
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

            {/* Center product image */}
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

      {/* Why choose us (static) */}
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
