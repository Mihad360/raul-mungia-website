import Link from "next/link";
import Image from "next/image";
import ctabanner from "../../../assets/ctabanner.png";

const CTABanner = () => {
  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden">
          <Image
            src={ctabanner}
            alt="Research Peptides Banner"
            className="w-full h-auto object-contain"
            style={{ width: "100%", height: "auto" }}
            sizes="(min-width: 1280px) 1280px, 100vw"
          />

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center py-10 px-8 text-center">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-snug"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Advance Your Research
              <br />
              with Confidence
            </h2>

            <p className="text-gray-600 text-sm mb-7 max-w-2xl mx-auto">
              Peptides offers research-grade peptides made with strict quality
              control. Each compound is tested for purity and stability using
              advanced methods.
            </p>

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
                className="px-7 py-3 rounded-lg border border-neutral-400 text-neutral-800 font-semibold text-sm hover:border-neutral-500 hover:bg-white transition-colors bg-white/80 backdrop-blur-sm"
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
