"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingDown, Timer, Users, TrendingUp } from "lucide-react";

function useCounter(end: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, active]);

  return count;
}

const stats = [
  {
    icon: TrendingDown,
    value: 356000,
    suffix: "+",
    label: "Cardiac arrests per year",
    sub: "outside of hospitals in the US alone",
    color: "#E8192C",
    display: (v: number) => v.toLocaleString(),
  },
  {
    icon: Timer,
    value: 10,
    suffix: "%",
    label: "Survival drop per minute",
    sub: "without CPR or defibrillation",
    color: "#FF6B35",
    display: (v: number) => v.toString(),
    prefix: "−",
  },
  {
    icon: Users,
    value: 46,
    suffix: "%",
    label: "Receive bystander CPR",
    sub: "less than half get help before EMS arrives",
    color: "#FF6B35",
    display: (v: number) => v.toString(),
    context: "Only",
  },
  {
    icon: TrendingUp,
    value: 3,
    suffix: "×",
    label: "Survival rate improvement",
    sub: "when bystander CPR is performed immediately",
    color: "#30D158",
    display: (v: number) => v.toString(),
    prefix: "up to",
  },
];

export default function WhyItMatters() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const counts = [
    useCounter(356000, 2000, inView),
    useCounter(10, 1200, inView),
    useCounter(46, 1400, inView),
    useCounter(3, 800, inView),
  ];

  return (
    <section id="why-it-matters" className="py-32 px-6 relative" ref={ref}>
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emergency/4 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs text-emergency uppercase tracking-widest font-semibold">
            The Numbers
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
            Every second counts.
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Cardiac arrest is survivable. The window is narrow. The gap between
            life and death is usually measured in minutes — and whether a stranger
            knew what to do.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card gradient-border rounded-2xl p-7 text-center group hover:bg-white/5 transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${s.color}15` }}
              >
                <s.icon className="w-5 h-5" style={{ color: s.color }} strokeWidth={2} />
              </div>

              <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: s.color }}>
                {"context" in s && <span className="text-base font-normal text-white/30 mr-1">{s.context}</span>}
                {"prefix" in s && <span className="text-base font-normal text-white/40 mr-1">{s.prefix}</span>}
                {s.display(counts[i])}
                <span className="text-xl">{s.suffix}</span>
              </div>

              <div className="text-white/70 text-sm font-medium mb-1.5">{s.label}</div>
              <div className="text-white/30 text-xs leading-relaxed">{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card rounded-2xl p-8 border border-white/5"
        >
          <h3 className="text-white font-semibold text-center mb-8">
            What happens in the minutes after cardiac arrest
          </h3>
          <div className="relative">
            {/* Timeline bar */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-white/5 rounded-full" />
            <div
              className="absolute top-4 left-0 h-1 rounded-full transition-all duration-1000"
              style={{
                width: inView ? "100%" : "0%",
                background: "linear-gradient(90deg, #30D158, #FF6B35, #E8192C)",
              }}
            />

            {/* Markers */}
            <div className="flex justify-between relative pt-8">
              {[
                { time: "0 min", label: "Cardiac arrest", color: "#30D158", note: "Reversible with immediate CPR" },
                { time: "2 min", label: "Brain damage begins", color: "#FF6B35", note: "Chances falling rapidly" },
                { time: "4–6 min", label: "Likely brain damage", color: "#FF6B35", note: "Critical window closing" },
                { time: "7–12 min", label: "EMS arrives", color: "#E8192C", note: "Average response time" },
                { time: "> 10 min", label: "Irreversible damage", color: "#E8192C", note: "Survival very unlikely" },
              ].map((m, i) => (
                <div key={i} className="flex flex-col items-center text-center max-w-[80px] sm:max-w-none">
                  <div
                    className="w-3 h-3 rounded-full mb-2 -mt-1.5 relative z-10 border-2 border-[#080808]"
                    style={{ backgroundColor: m.color }}
                  />
                  <div className="text-xs font-mono text-white/60 mb-1 hidden sm:block">{m.time}</div>
                  <div className="text-xs font-medium text-white/70 mb-1 hidden sm:block">{m.label}</div>
                  <div className="text-xs text-white/30 leading-tight hidden lg:block">{m.note}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Mobile labels */}
          <div className="flex justify-between mt-3 sm:hidden">
            {["0 min", "2 min", "4–6 min", "7–12 min", ">10 min"].map((t) => (
              <span key={t} className="text-[10px] text-white/40 font-mono">{t}</span>
            ))}
          </div>

          <p className="text-center text-white/30 text-sm mt-8">
            ERAC targets{" "}
            <span className="text-emergency font-semibold">bystander response under 90 seconds</span>
            {" "}— well within the survivable window.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
