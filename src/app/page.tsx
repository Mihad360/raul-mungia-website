import AgeVerificationModal from "@/components/home/Ageverificationmodal";
import BestSellingSection from "@/components/home/BestSellingSection";
import BlogSection from "@/components/home/BlogSection";
import CTABanner from "@/components/home/CTABanner";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/home/Footer";
import HeroSection from "@/components/home/HeroSection";
import PuritySection from "@/components/home/PuritySection";
import QualitySection from "@/components/home/QualitySection";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";

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
