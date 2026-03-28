import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import AlertDemo from "@/components/sections/AlertDemo";
import WhyItMatters from "@/components/sections/WhyItMatters";
import CTABanner from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <AlertDemo />
      <WhyItMatters />
      <CTABanner />
      <Footer />
    </main>
  );
}
