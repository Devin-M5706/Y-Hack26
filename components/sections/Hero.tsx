"use client";

import Link from "next/link";
import { ChevronDown, Watch, Zap } from "lucide-react";

const ECG_PATH =
  "M0,60 L120,60 L130,55 C135,48 140,42 145,55 L150,60 L158,60 L161,8 L165,112 L169,32 L173,60 L185,60 L190,44 C200,18 210,44 220,60 L228,60 L560,60 " +
  "M560,60 L680,60 L690,55 C695,48 700,42 705,55 L710,60 L718,60 L721,8 L725,112 L729,32 L733,60 L745,60 L750,44 C760,18 770,44 780,60 L788,60 L1120,60";

const ECG_PATH_2 =
  "M1120,60 L1240,60 L1250,55 C1255,48 1260,42 1265,55 L1270,60 L1278,60 L1281,8 L1285,112 L1289,32 L1293,60 L1305,60 L1310,44 C1320,18 1330,44 1340,60 L1348,60 L1680,60 " +
  "M1680,60 L1800,60 L1810,55 C1815,48 1820,42 1825,55 L1830,60 L1838,60 L1841,8 L1845,112 L1849,32 L1853,60 L1865,60 L1870,44 C1880,18 1890,44 1900,60 L1908,60 L2240,60";

const stats = [
  { value: "356K", label: "US cardiac arrests / year" },
  { value: "10%", label: "survival drop per minute" },
  { value: "< 90s", label: "target first-response time" },
  { value: "3×", label: "survival with bystander CPR" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#080808]">
      {/* Radial red glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emergency/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-emergency/5 rounded-full blur-[100px]" />
      </div>

      {/* Scrolling ECG line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[120px] pointer-events-none opacity-25">
        <svg
          className="w-[200%] h-full ecg-glow"
          style={{ animation: "ecg-scroll 7s linear infinite" }}
          viewBox="0 0 2240 120"
          preserveAspectRatio="none"
        >
          <path
            d={ECG_PATH + " " + ECG_PATH_2}
            stroke="#E8192C"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-20">
        {/* Badge */}
        <div className="hero-fade-1 inline-flex items-center gap-2 border border-emergency/30 bg-emergency/10 rounded-full px-4 py-1.5 text-xs text-emergency font-medium mb-8">
          <Watch className="w-3.5 h-3.5" />
          Powered by Apple Watch HealthKit
        </div>

        {/* Headline */}
        <h1 className="hero-fade-2 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
          A bridge between a{" "}
          <br className="hidden sm:block" />
          heart stop and a heart{" "}
          <span className="text-emergency text-glow">start.</span>
        </h1>

        {/* Sub-headline */}
        <p className="hero-fade-3 text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10">
          Handsforhearts turns bystanders into rescuers with a simple, seamless process.
        </p>

        {/* CTAs */}
        <div className="hero-fade-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="#how-it-works"
            className="group relative flex items-center gap-2 bg-emergency hover:bg-emergency/90 text-white font-semibold px-7 py-3.5 rounded-full transition-all emergency-glow hover:scale-105"
          >
            <span className="absolute inset-0 rounded-full bg-emergency/30 scale-100 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <Zap className="w-4 h-4 relative z-10" />
            <span className="relative z-10">See How It Works</span>
          </Link>
          <Link
            href="/cpr-guide"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-7 py-3.5 rounded-full transition-all hover:scale-105"
          >
            View CPR Guide
          </Link>
        </div>

        {/* Stats strip */}
        <div className="hero-fade-5 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#080808] px-6 py-5 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emergency mb-1">
                {s.value}
              </div>
              <div className="text-xs text-white/40 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-fade-6 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
