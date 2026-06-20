"use client";
import Image from "next/image";
import Link from "next/link";
import purity1 from "../../../assets/Purity1.png";
import purity2 from "../../../assets/purity2.png";

const PuritySection = () => {
  return (
    <section className="w-full bg-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <div>
            <span className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-3 block">
              Research Peptides
            </span>
            <h2
              className="text-3xl font-bold text-gray-900 mb-4 leading-snug"
              style={{ fontFamily: "Georgia, serif" }}
            >
              purity guarantee
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              All our peptides are batch-tested to ensure ≥99% purity. Each
              batch comes with a third-party.
            </p>
            <Link
              href="/explore-purity"
              className="inline-block px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#C70A24" }}
            >
              Explore Purity
            </Link>
          </div>

          {/* Right — image + stats grid */}
          <div className="flex flex-col gap-3">
            {/* Product image box */}
            <div className="relative rounded-xl overflow-hidden bg-gray-900 h-44">
              <Image
                src={purity1}
                alt="Purity Guarantee Product"
                fill
                className="object-cover"
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {/* 99% stat */}
              <div className="bg-blue-50 rounded-xl p-4 flex flex-col justify-center">
                <p className="text-2xl font-bold text-gray-900">99%</p>
                <p className="text-xs text-gray-500 mt-1">purity or higher.</p>
              </div>

              {/* Middle — image */}
              <div className="relative rounded-xl overflow-hidden h-24">
                <Image
                  src={purity2}
                  alt="Purity Certificate"
                  fill
                  className="object-cover"
                />
              </div>

              {/* 25% stat */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-center">
                <p className="text-2xl font-bold text-gray-900">25%</p>
                <p className="text-xs text-gray-500 mt-1">
                  credit of total test cost
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PuritySection;
