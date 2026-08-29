"use client";
import Link from "next/link";
import Image from "next/image";
import bannerBg from "../../../assets/banner1.png";
import bannerVials from "../../../assets/banner2.png";

const HeroSection = () => {
  return (
    <section className="w-full bg-white pt-14 pb-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h1
            className="flex flex-col text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.08]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            <span className="text-gray-900">Research.</span>
            <span className="text-gray-900">Innovate.</span>
            <span className="text-[#C70A24]">Elevate.</span>
          </h1>

          <span className="block w-16 h-px bg-gray-200 mt-8 mb-6" />

          <p className="text-gray-500 text-base md:text-lg max-w-md">
            Premium peptides. Fair price. Zero compromise.
          </p>

          <Link
            href="/shop"
            className="mt-8 px-8 py-3.5 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#C70A24" }}
          >
            Shop Now
          </Link>
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
