"use client";

import { useState } from "react";
import Link from "next/link";
import CTABanner from "@/components/home/CTABanner";
import { useGetAllCertificationsQuery } from "@/redux/api/settingsApi";
import { Loader } from "@/components/shared/Loader";
import { FileText, Download } from "lucide-react";

interface ICertification {
  _id: string;
  title: string;
  size: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CertificationsPage = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetAllCertificationsQuery(undefined);

  const certifications: ICertification[] = data?.data || [];

  const handleDownload = async (cert: ICertification) => {
    setDownloadingId(cert._id);

    if (cert.image) {
      try {
        const response = await fetch(cert.image);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${cert.title}-certificate.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
    }

    setDownloadingId(null);
  };

  const handleViewCertificate = (cert: ICertification) => {
    // Open PDF in the same browser window/tab
    if (cert.image) {
      window.open(cert.image, "_blank");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <section className="max-w-7xl mx-auto px-6 py-20 flex justify-center">
          <Loader size="lg" />
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-white">
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-600 mb-2">Failed to load certifications</p>
          <p className="text-sm text-gray-400">Please try again later</p>
        </section>
      </main>
    );
  }

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
        {certifications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No certifications available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert._id}
                onClick={() => handleViewCertificate(cert)}
                className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group cursor-pointer"
              >
                {/* PDF/Document Icon instead of image */}
                <div className="bg-gray-50 aspect-[3/4] flex flex-col items-center justify-center relative group-hover:bg-gray-100 transition-colors">
                  <FileText size={64} className="text-[#C70A24] mb-4" />
                  <p className="text-xs text-gray-400 text-center px-4">
                    Click to view certificate
                  </p>
                </div>

                {/* Info + download */}
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                    {cert.title}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">{cert.size}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(cert);
                    }}
                    disabled={downloadingId === cert._id}
                    className="w-full py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download size={14} />
                    {downloadingId === cert._id ? "Downloading..." : "Download"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </main>
  );
};

export default CertificationsPage;
