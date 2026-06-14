"use client";
// import Image from "next/image";

import Navbar from "../shared/Navbar";
import AgeVerificationModal from "./Ageverificationmodal";
import BestSellingSection from "./BestSellingSection";
import BlogSection from "./BlogSection";
import CTABanner from "./CTABanner";
import FAQSection from "./FAQSection";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import PuritySection from "./PuritySection";
import QualitySection from "./QualitySection";

export default function Home() {
  return (
    <main>
      <AgeVerificationModal />

      {/* Navbar */}
      <Navbar />

      {/* Page sections */}
      <HeroSection />
      <BestSellingSection />
      <PuritySection />
      <QualitySection />
      <FAQSection />
      <BlogSection />
      <CTABanner />
      <Footer />
    </main>
  );
}
