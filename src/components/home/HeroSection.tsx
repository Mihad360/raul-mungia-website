"use client"
import Link from "next/link";
import Image from "next/image";

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
              href="/certification"
              className="px-7 py-3 rounded-lg border border-gray-300 text-gray-800 font-semibold text-sm hover:border-gray-400 transition-colors"
            >
              View Certification
            </Link>
          </div>
        </div>

        {/* Hero image */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ height: "420px" }}
        >
          {/* Placeholder image — replace with actual product banner */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-red-800 to-red-900 flex items-end justify-center">
            {/* Decorative red splash overlay */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, rgba(180,10,30,0.6) 0%, transparent 70%), radial-gradient(ellipse at 70% 40%, rgba(120,0,20,0.5) 0%, transparent 60%)",
              }}
            />
            {/* Placeholder product bottles — replace with <Image> once assets are ready */}
            <div className="relative z-10 flex items-end justify-center gap-3 pb-0">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-full border-2 border-gray-400 shadow-2xl ${
                    i === 2 ? "w-28 h-56" : "w-24 h-44"
                  }`}
                  style={{
                    background:
                      "linear-gradient(180deg, #9ca3af 0%, #6b7280 30%, #374151 100%)",
                    borderTop: "8px solid #C70A24",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
