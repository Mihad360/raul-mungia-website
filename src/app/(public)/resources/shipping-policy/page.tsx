/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { Loader } from "@/components/shared/Loader";
import { useGetAllShippingPolicyQuery } from "@/redux/api/settingsApi";

interface IShippingPolicy {
  _id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const ShippingPolicyPage = () => {
  const {
    data: shippingData,
    isLoading,
    isError,
  } = useGetAllShippingPolicyQuery(undefined);
  const shipping: IShippingPolicy | undefined = shippingData?.data;

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Shipping Policy
        </h1>
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>{" "}
          / Shipping Policy
        </p>
      </section>

      {/* Main content — centered single column with admin-managed HTML */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader size="lg" />
          </div>
        ) : isError || !shipping?.description ? (
          <div className="text-center space-y-4 py-20">
            <h2
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Shipping Policy
            </h2>
            <p className="text-sm text-gray-500">
              Content is being updated. Please check back soon.
            </p>
          </div>
        ) : (
          <>
            {/* Admin-managed HTML — left-aligned for readability inside centered container */}
            <div
              className="space-y-4 text-gray-600 leading-relaxed
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-6 [&_h1]:mb-3
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-2
                [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-gray-900 [&_h4]:mt-4 [&_h4]:mb-2
                [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-gray-600 [&_p]:my-3
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:text-base
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-4 [&_ol]:text-base
                [&_li]:text-gray-600 [&_li]:leading-relaxed
                [&_a]:text-[#C70A24] [&_a]:underline hover:[&_a]:opacity-80
                [&_strong]:font-semibold [&_strong]:text-gray-900
                [&_em]:italic
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#C70A24] [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-4
                [&_img]:rounded-lg [&_img]:my-4 [&_img]:mx-auto"
              dangerouslySetInnerHTML={{ __html: shipping.description }}
            />

            {/* CTA button — centered below content */}
            <div className="flex justify-center mt-10">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
                style={{ backgroundColor: "#C70A24" }}
              >
                Contact Support →
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default ShippingPolicyPage;
