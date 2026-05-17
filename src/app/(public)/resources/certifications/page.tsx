"use client";

import { useState } from "react";
import Link from "next/link";
import CTABanner from "@/components/home/CTABanner";

const certifications = [
  { id: 1, name: "BPC-157", variant: "5 mg / Vial" },
  { id: 2, name: "BPC-357", variant: "5 mg / Vial" },
  { id: 3, name: "BPC-157", variant: "5 mg / Vial" },
  { id: 4, name: "BPC-357", variant: "5 mg / Vial" },
  { id: 5, name: "CJC-1295", variant: "2 mg / Vial" },
  { id: 6, name: "CJC-1295", variant: "2 mg / Vial" },
  { id: 7, name: "CJC-1295", variant: "2 mg / Vial" },
  { id: 8, name: "CJC-1295", variant: "2 mg / Vial" },
  { id: 9, name: "Ipamorelin", variant: "1 mg / Vial" },
  { id: 10, name: "Ipamorelin", variant: "1 mg / Vial" },
  { id: 11, name: "Ipamorelin", variant: "1 mg / Vial" },
  { id: 12, name: "Ipamorelin", variant: "1 mg / Vial" },
];

const CertificationsPage = () => {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDownload = async (id: number) => {
    setDownloadingId(id);
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/certifications/${id}/download`);
    // const blob = await response.blob();
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `certification-${id}.pdf`;
    // a.click();

    // Simulate API delay
    setTimeout(() => {
      setDownloadingId(null);
    }, 500);
  };

  return (
    <main className="min-h-screen bg-white">

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Certifications
        </h1>
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>{" "}
          / Certifications
        </p>
      </section>

      {/* Certifications grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group cursor-pointer"
            >
              {/* Certificate image placeholder */}
              <div className="bg-gray-100 aspect-[3/4] flex items-center justify-center relative overflow-hidden group-hover:bg-gray-200 transition-colors">
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-xs text-gray-400">Certificate</p>
                </div>
              </div>

              {/* Info + download */}
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-900">
                  {cert.name}
                </p>
                <p className="text-xs text-gray-500 mb-2">{cert.variant}</p>
                <button
                  onClick={() => handleDownload(cert.id)}
                  disabled={downloadingId === cert.id}
                  className="w-full py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {downloadingId === cert.id ? "Downloading..." : "Download"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </main>
  );
};

export default CertificationsPage;
