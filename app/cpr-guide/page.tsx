import type { Metadata } from "next";
import Link from "next/link";
import CPRGuide from "@/components/cpr/CPRGuide";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "CPR Guide — ERAC",
  description:
    "Step-by-step AHA-approved CPR guide with live metronome. Learn to save a life in minutes.",
};

export default function CPRGuidePage() {
  return (
    <div className="relative">
      {/* Back link */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-[60] flex items-center gap-1.5 text-white/30 hover:text-white text-sm transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </Link>

      <CPRGuide />
    </div>
  );
}
