"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Activity, Wifi, Navigation } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Activity,
    title: "Detection",
    description:
      "Continuous biometric monitoring detects anomalies instantly.",
  },
  {
    number: "2",
    icon: Wifi,
    title: "Alert",
    description:
      "A Critical Alert is broadcast to all nearby responders.",
  },
  {
    number: "3",
    icon: Navigation,
    title: "Action",
    description:
      "Responders arrive quickly to provide life-saving aid before EMS.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-32 px-6 bg-[#080808]" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative"
            >
              {/* Card */}
              <div className="bg-[#1a1a1a]/60 rounded-2xl p-8 h-full border border-white/5 hover:border-white/10 transition-all">
                {/* Number Badge */}
                <div className="text-6xl font-bold text-white/20 mb-6">
                  {step.number}.
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-emergency/10 flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-emergency" strokeWidth={1.5} />
                </div>

                {/* Text */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
