"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Activity, Wifi, Navigation, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Activity,
    color: "#E8192C",
    title: "Apple Watch Detects",
    description:
      "The Watch continuously monitors heart rate, HRV, SpO₂, and motion. An on-device ML model detects the combined signatures of cardiac arrest in real time.",
    detail: "Multi-signal consensus: HR drop + zero motion + SpO₂ decline",
    badge: "< 30 seconds",
    badgeLabel: "to detect",
  },
  {
    number: "02",
    icon: Wifi,
    color: "#FF6B35",
    title: "Critical Alert Fires",
    description:
      "The victim's iPhone broadcasts a Critical Alert via APNs to every opted-in device within 100 meters. It bypasses Do Not Disturb and Silent mode. 911 is called simultaneously.",
    detail: "Reaches all opted-in iPhones nearby — no internet required as fallback",
    badge: "100m",
    badgeLabel: "broadcast radius",
  },
  {
    number: "03",
    icon: Navigation,
    color: "#30D158",
    title: "You Respond",
    description:
      "Tap the alert to open a live map with the victim's exact location updating every 2 seconds. See how many others are responding, and access guided CPR instructions instantly.",
    detail: "GPS live-tracking · responder count · guided CPR · 911 coordination",
    badge: "< 90s",
    badgeLabel: "target response",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-32 px-6 bg-[#080808]" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs text-emergency uppercase tracking-widest font-semibold">
            The System
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
            Three steps. One life saved.
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            From detection to CPR in under 90 seconds — all automated, all
            hands-free for the victim.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-14 left-[33%] right-[33%] h-px bg-gradient-to-r from-emergency/40 via-pulse/40 to-success/40" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative group"
            >
              {/* Card */}
              <div className="glass-card gradient-border rounded-2xl p-7 h-full hover:bg-white/5 transition-all duration-300">
                {/* Step number */}
                <div className="text-xs font-mono text-white/20 mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <step.icon
                    className="w-5 h-5"
                    style={{ color: step.color }}
                    strokeWidth={2}
                  />
                  {/* Pulse ring on hover */}
                  <span
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: `0 0 20px ${step.color}40` }}
                  />
                </div>

                {/* Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${step.color}15`,
                      color: step.color,
                    }}
                  >
                    {step.badge}
                  </span>
                  <span className="text-xs text-white/30">{step.badgeLabel}</span>
                </div>

                {/* Text */}
                <h3 className="text-lg font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Detail */}
                <p className="text-xs text-white/25 border-t border-white/5 pt-4 leading-relaxed">
                  {step.detail}
                </p>
              </div>

              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-14 -right-3 z-10 items-center justify-center w-6 h-6">
                  <ArrowRight className="w-4 h-4 text-white/20" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Sub-note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-white/25 text-sm mt-10"
        >
          A 10-second cancellation window prevents false alerts. Multiple sensor
          signals must confirm before broadcasting.
        </motion.p>
      </div>
    </section>
  );
}
