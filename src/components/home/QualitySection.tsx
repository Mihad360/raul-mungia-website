"use client";

import {
  FlaskConical,
  Handshake,
  Headphones,
  ShieldCheck,
  Truck,
  FileText,
} from "lucide-react";
import Image from "next/image";
import qualityImage from "../../../assets/quality.png";

const features = [
  {
    icon: <FlaskConical size={28} strokeWidth={1.5} />,
    title: "99% HPLC-Tested Purity",
    desc: "Every batch is lab-verified for accuracy, reliability, and consistent research outcomes.",
  },
  {
    icon: <Handshake size={28} strokeWidth={1.5} />,
    title: "Trusted by Researchers",
    desc: "Our products are used across labs, clinics, and scientific teams for consistent results.",
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={1.5} />,
    title: "Research-Grade Quality",
    desc: "Premium peptides at industry-leading prices without compromising standards",
  },
  {
    icon: <Headphones size={28} strokeWidth={1.5} />,
    title: "Expert Support",
    desc: "Our team is available by email or phone to assist with any product questions.",
  },
  {
    icon: <FileText size={28} strokeWidth={1.5} />,
    title: "purity guarantee",
    desc: "If purity falls under 99%, contact us for a full refund. Your research deserves accountability, not empty promises.",
  },
  {
    icon: <Truck size={28} strokeWidth={1.5} />,
    title: "Fast, Reliable Shipping",
    desc: "Same-day shipping before 1 PM PST. Free shipping over $150.",
  },
];

const QualitySection = () => {
  return (
    <section className="w-full py-16" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
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

        {/* 3-col layout: features left | product center | features right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left features */}
          <div className="flex flex-col gap-8">
            {features.slice(0, 3).map((f, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="text-gray-700 mb-1">{f.icon}</div>
                <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Center — product image */}
          <div className="flex items-center justify-center">
            <div className="relative w-56 h-72 rounded-3xl overflow-hidden">
              <Image
                src={qualityImage}
                alt="Research Peptides Product"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right features */}
          <div className="flex flex-col gap-8">
            {features.slice(3, 6).map((f, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="text-gray-700 mb-1">{f.icon}</div>
                <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
