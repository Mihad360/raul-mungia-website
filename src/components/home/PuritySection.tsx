"use client";
import Image from "next/image";
import Link from "next/link";
import purity1 from "../../../assets/purity1.png";
import purity2 from "../../../assets/purity2.png";

const PuritySection = () => {
  return (
    <section className="w-full bg-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-3 block">
              Research Peptides
            </span>
            <h2
              className="text-3xl font-bold text-gray-900 mb-4 leading-snug"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Purity guarantee
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

          <div className="flex flex-col gap-4">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-950">
              <Image
                src={purity1}
                alt="Purity Guarantee Product"
                fill
                className="object-cover object-center"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>

            <div className="grid grid-cols-3 gap-3 items-stretch">
              <div className="bg-[#F4F7FB] rounded-xl p-4 flex flex-col justify-center h-[180px]">
                <p className="text-2xl font-bold text-gray-900">99%</p>
                <p className="text-xs text-gray-500 mt-1">purity or higher.</p>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-[#F8F4F4] h-[180px]">
                <Image
                  src={purity2}
                  alt="Purity research visual"
                  fill
                  className="object-cover object-center"
                  sizes="20vw"
                />
              </div>

              <div className="bg-neutral-50 rounded-xl p-4 flex flex-col justify-center h-[180px]">
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
