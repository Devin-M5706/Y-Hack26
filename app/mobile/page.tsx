import type { Metadata } from "next";
import { Activity, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Get the App — handsforhearts",
  description:
    "handsforhearts is a native iOS app. Download it to receive cardiac arrest alerts near you.",
};

export default function MobilePage() {
  return (
    <main className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="relative">
          <Activity className="w-6 h-6 text-emergency" strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emergency rounded-full animate-pulse" />
        </div>
        <span className="font-bold text-white tracking-tight text-xl">
          hands<span className="text-emergency">for</span>hearts
        </span>
      </div>

      {/* Phone icon */}
      <div className="w-20 h-20 rounded-3xl bg-emergency/10 border border-emergency/20 flex items-center justify-center mb-8">
        <Smartphone className="w-10 h-10 text-emergency" />
      </div>

      {/* Headline */}
      <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
        This experience lives
        <br />
        in the app.
      </h1>

      {/* Body */}
      <p className="text-white/50 text-base max-w-xs leading-relaxed mb-10">
        handsforhearts is a native iOS app that alerts you when someone nearby
        needs CPR. Visit on a laptop or desktop to learn more.
      </p>

      {/* App Store CTA */}
      <a
        href="#"
        className="inline-flex items-center gap-2 bg-emergency text-white font-semibold px-7 py-3.5 rounded-full transition-all hover:bg-emergency/90 active:scale-95"
        style={{ boxShadow: "0 0 30px rgba(232,25,44,0.25)" }}
      >
        Download on the App Store
      </a>

      <p className="mt-6 text-white/20 text-xs">Coming soon to the Apple App Store</p>
    </main>
  );
}
