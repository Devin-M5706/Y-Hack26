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
          <div className="relative z-10 px-8 sm:px-16 py-20 text-center">
            <h3 className="text-xs uppercase tracking-[2px] text-white/70 font-semibold mb-6">
              JOIN THE NETWORK OF LIFESAVERS
            </h3>

            <p className="text-white/60 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
              Connect with a community dedicated to saving lives.<br />
              Every second counts.
            </p>

            <Link
              href="#"
              className="inline-flex items-center gap-2.5 bg-emergency hover:bg-emergency/90 text-white font-bold px-8 py-4 rounded-full transition-all emergency-glow hover:scale-105 text-base"
            >
              <Heart className="w-5 h-5" />
              Become a Responder
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
