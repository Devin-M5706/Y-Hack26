"use client";

import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

const HeartScene = dynamic(() => import("@/skills/three/HeartScene"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section className="relative h-[921px] flex items-center justify-center px-6 overflow-hidden pt-20">
      {/* 3D Heart Background */}
      <HeartScene />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(232,25,44,0.08)_0%,rgba(19,19,19,0)_60%)]" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,8,8,0.7)_100%)]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="hero-fade-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#5B403F]/30 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00A741] animate-pulse" />
          <span className="text-xs font-bold tracking-widest uppercase text-[#53E16F]">
            Network Active: 14,202 Responders
          </span>
        </div>

        <h1 className="hero-fade-2 text-5xl md:text-7xl lg:text-8xl text-[#e2e2e2] italic mb-6 leading-tight tracking-tight font-['Newsreader']">
          Because every heart deserves a{" "}
          <span className="text-[#FFB4AA] not-italic">second chance.</span>
        </h1>

        <p className="hero-fade-3 text-lg md:text-xl text-[#e4bebc]/80 max-w-2xl mx-auto mb-12 font-[var(--font-inter)]">
          The responder network for moments that matter most. We connect
          life-saving skills with critical needs in real-time.
        </p>

        <div className="hero-fade-4 flex items-center justify-center">
          <form className="w-full max-w-md flex flex-col items-center gap-4">
            <label htmlFor="hero-waitlist-email" className="sr-only">
              Email address
            </label>
            <input
              id="hero-waitlist-email"
              name="email"
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              placeholder="Enter your email address"
              className="w-full px-5 py-4 rounded-xl bg-[rgba(53,53,53,0.6)] backdrop-blur-md border border-[#5B403F]/30 text-[#e2e2e2] placeholder:text-[#e4bebc]/50 focus:outline-none focus:ring-2 focus:ring-[#FFB4AA]/40 transition-all duration-200"
            />
            <button
              type="button"
              className="group relative px-10 py-5 bg-gradient-to-r from-[#FFB4AA] to-[#FF5545] text-[#690003] rounded-xl font-bold text-xl shadow-[0_20px_40px_rgba(255,85,69,0.25)] hover:shadow-[0_25px_50px_rgba(255,85,69,0.4)] transition-all duration-300 transform active:scale-95 overflow-hidden cursor-pointer"
            >
              <span className="relative z-10">Join Waitlist</span>
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </form>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-fade-6 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#e4bebc]/40 z-10">
        <span className="text-[10px] uppercase tracking-widest font-bold">
          Scroll to Explore
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
