/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    setLoading(true);

    // TODO: Replace with actual API call
    // const response = await fetch("/api/contact", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // });
    // const result = await response.json();

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact</h1>
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>{" "}
          / Contact
        </p>
      </section>

      {/* Main content - 2 col */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left — contact info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Get in Touch
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              We're here to help with any questions.
            </p>

            {/* Contact details */}
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="text-lg">📧</div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:support@example.com"
                    className="text-sm text-gray-900 hover:text-[#C70A24] transition-colors cursor-pointer"
                  >
                    support@example.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="text-lg">📞</div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:+17849443124"
                    className="text-sm text-gray-900 hover:text-[#C70A24] transition-colors cursor-pointer"
                  >
                    7849-3443-124
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name input */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors placeholder-gray-400"
                />
              </div>

              {/* Email input */}
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

              {/* Message textarea */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write Your Message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#C70A24] transition-colors placeholder-gray-400 resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: "#C70A24" }}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {/* Success message */}
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
