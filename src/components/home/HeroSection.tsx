"use client";
import Link from "next/link";
import Image from "next/image";
import bannerBg from "../../../assets/banner1.png";
import bannerVials from "../../../assets/banner2.png";

const HeroSection = () => {
  return (
    <section className="w-full bg-white pt-14 pb-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6">
          <p
            className="text-sm md:text-base tracking-[0.18em] uppercase text-[#C70A24] font-semibold mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Research. Innovate. Elevate.
          </p>
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

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/shop"
              className="px-7 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#C70A24" }}
            >
              Shop Now
            </Link>
          </div>
        </div>

        <div className="relative w-full rounded-2xl overflow-hidden bg-black">
          <Image
            src={bannerBg}
            alt=""
            className="w-full h-auto object-contain"
            style={{ width: "100%", height: "auto" }}
            sizes="(min-width: 1280px) 1280px, 100vw"
            priority
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={bannerVials}
              alt="VELTRONIX Research Peptide"
              fill
              className="object-contain"
              sizes="(min-width: 1280px) 1280px, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
