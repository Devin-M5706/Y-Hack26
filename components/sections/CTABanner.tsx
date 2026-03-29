"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Zap, Heart } from "lucide-react";

export default function CTABanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emergency/20 via-[#111] to-[#0a0a0a] border border-emergency/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-emergency/15 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 px-8 sm:px-16 py-16 text-center">
            {/* Icon */}
            <div className="relative w-16 h-16 mx-auto mb-8">
              <span className="absolute inset-0 rounded-full bg-emergency/30 animate-ping" />
              <div className="w-16 h-16 rounded-2xl bg-emergency/20 border border-emergency/30 flex items-center justify-center">
                <Heart className="w-7 h-7 text-emergency animate-heartbeat" />
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Be ready when
              <br />
              <span className="text-emergency text-glow">it matters most.</span>
            </h2>

            <p className="text-white/50 text-lg max-w-md mx-auto mb-10 leading-relaxed">
              The app is in development. Learn CPR now so you're ready the moment
              a life is on the line.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/cpr-guide"
                className="group flex items-center gap-2.5 bg-emergency hover:bg-emergency/90 text-white font-bold px-8 py-4 rounded-full transition-all emergency-glow hover:scale-105 text-base"
              >
                <Zap className="w-5 h-5" />
                Learn CPR Now — It's Free
              </Link>
              <div className="flex items-center gap-3 opacity-40">
                <div className="flex items-center gap-2 border border-white/20 rounded-xl px-4 py-3">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-white text-xs opacity-60">Download on the</div>
                    <div className="text-white text-sm font-semibold">App Store</div>
                  </div>
                </div>
                <span className="text-white/30 text-xs">Coming soon</span>
              </div>
            </div>

            <p className="text-white/20 text-xs max-w-sm mx-auto">
              handsforhearts is a supplementary tool. Always call 911 in an emergency.
              CPR guidance follows American Heart Association guidelines.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
