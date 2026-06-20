import Link from "next/link";
import Image from "next/image";
import ctabanner from "../../../assets/ctabanner.png";

const CTABanner = () => {
  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={ctabanner}
              alt="Research Peptides Banner"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="relative z-10 py-16 px-8 text-center">
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
                Shop Research Peptides
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3 rounded-lg border border-gray-400 text-gray-800 font-semibold text-sm hover:border-gray-500 transition-colors bg-white/80 backdrop-blur-sm"
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
