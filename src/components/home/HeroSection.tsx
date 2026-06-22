"use client";
import Link from "next/link";
import Image from "next/image";
import banner from "../../../assets/banner1.png";
import banner1 from "../../../assets/banner2.png";

const HeroSection = () => {
  return (
    <section className="w-full bg-white pt-14 pb-0">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1
            className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Premium Research peptides For
            <br />
            Precision Science
          </h1>
          <p className="text-gray-500 text-base mb-7">
            Premium peptides. Fair price. Zero compromise.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/shop"
              className="px-7 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#C70A24" }}
            >
              Shop Now
            </Link>
            <Link
              href="/resources/certifications"
              className="px-7 py-3 rounded-lg border border-gray-300 text-gray-800 font-semibold text-sm hover:border-gray-400 transition-colors"
            >
              View Certification
            </Link>
          </div>
        </div>

        {/* Hero image with product overlay */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ height: "500px" }}
        >
          {/* Background Banner */}
          <Image
            src={banner}
            alt="Premium Research Peptides Banner"
            fill
            className="object-cover"
            priority
          />

          {/* Dark overlay for better product visibility */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Product Image Overlay - centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={banner1}
                alt="Research Peptides Product"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
