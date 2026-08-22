/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useSubmitContactMessageMutation } from "@/redux/api/contactApi";

const CONTACT_EMAIL = "rmungia@stxresearch.com";
const CONTACT_PHONE_DISPLAY = "361-222-4431";
const CONTACT_PHONE_TEL = "+13612224431";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitContact, { isLoading }] = useSubmitContactMessageMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitContact(formData).unwrap();
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      toast.success("Message sent successfully. We'll get back to you soon.");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(
        err?.data?.message || "Failed to send message. Please try again.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact</h1>
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>{" "}
          / Contact
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Get in Touch
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              We're here to help with any questions about our research products
              and orders.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-lg">📧</div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm text-gray-900 hover:text-[#C70A24] transition-colors cursor-pointer"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-lg">📞</div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                  <a
                    href={`tel:${CONTACT_PHONE_TEL}`}
                    className="text-sm text-gray-900 hover:text-[#C70A24] transition-colors cursor-pointer"
                  >
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  required
                  minLength={2}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors placeholder-gray-400"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors placeholder-gray-400"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write Your Message"
                  required
                  minLength={5}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors placeholder-gray-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: "#C70A24" }}
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>

              {submitted && (
                <p className="text-sm text-green-600 text-center">
                  ✓ Message sent successfully! We'll get back to you soon.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
