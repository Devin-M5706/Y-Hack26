"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Users, Phone, Heart, ArrowRight, ChevronRight } from "lucide-react";

type DemoState = "locked" | "alert" | "map" | "cpr";

const demoStates: Record<DemoState, { label: string; next: DemoState | null }> = {
  locked: { label: "Tap to receive alert", next: "alert" },
  alert: { label: "Tap to respond", next: "map" },
  map: { label: "Tap to open CPR guide", next: "cpr" },
  cpr: { label: "Restart demo", next: "locked" },
};

function MockMap() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1a1f2e]">
      {/* Street grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#252d40 1px, transparent 1px), linear-gradient(90deg, #252d40 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* Blocks */}
      <div className="absolute top-8 left-4 w-24 h-12 bg-[#222a3a] rounded-sm" />
      <div className="absolute top-8 right-4 w-16 h-16 bg-[#1e2638] rounded-sm" />
      <div className="absolute bottom-16 left-8 w-20 h-10 bg-[#222a3a] rounded-sm" />
      <div className="absolute bottom-20 right-6 w-14 h-20 bg-[#1e2638] rounded-sm" />
      {/* Park */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-20 h-14 bg-[#1a2e1a]/60 rounded-sm" />
      {/* User dot (blue) */}
      <div className="absolute bottom-24 left-12 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md" />
      {/* Victim pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <span className="absolute w-16 h-16 rounded-full bg-emergency/20 animate-ping" />
        <span className="absolute w-10 h-10 rounded-full bg-emergency/25" />
        <div className="relative w-5 h-5 bg-emergency rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <Heart className="w-2.5 h-2.5 text-white fill-white" />
        </div>
      </div>
      {/* Route line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 280 380">
        <path
          d="M 48 290 L 48 200 L 140 200 L 140 185"
          stroke="#3B82F6"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="6 4"
          opacity="0.6"
        />
      </svg>
      {/* Overlay info */}
      <div className="absolute top-3 left-3 right-3 bg-[#080808]/90 backdrop-blur rounded-xl p-3 border border-white/10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-emergency text-xs font-bold uppercase tracking-wide">Emergency</span>
          <span className="text-white/40 text-xs">Live</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/70">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emergency" />
            John D. · 32m away
          </span>
          <span className="flex items-center gap-1 text-success">
            <Users className="w-3 h-3" />
            3 responding
          </span>
        </div>
      </div>
      {/* Bottom buttons */}
      <div className="absolute bottom-3 left-3 right-3 flex gap-2">
        <button className="flex-1 bg-emergency text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          I'm on my way
        </button>
        <button className="flex-1 bg-white/10 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5" />
          CPR Guide
        </button>
      </div>
    </div>
  );
}

function CPRStep() {
  return (
    <div className="w-full h-full bg-[#080808] flex flex-col items-center justify-center px-5 py-6">
      <div className="text-xs text-white/30 font-mono mb-4 self-start">Step 4 / 7</div>
      <div className="w-full bg-white/5 rounded-full h-1 mb-8">
        <div className="bg-emergency h-1 rounded-full" style={{ width: "57%" }} />
      </div>
      <div className="w-16 h-16 rounded-2xl bg-emergency/15 flex items-center justify-center mb-5">
        <Heart className="w-8 h-8 text-emergency animate-heartbeat" />
      </div>
      <h3 className="text-lg font-bold text-white text-center mb-2">Begin Compressions</h3>
      <p className="text-white/50 text-xs text-center leading-relaxed mb-6">
        Push hard and fast — at least 2 inches deep. Allow full chest recoil.
        Keep elbows locked.
      </p>
      {/* Metronome */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-10 h-10">
          <span className="absolute inset-0 rounded-full bg-emergency/30 animate-ping" />
          <span className="w-10 h-10 rounded-full bg-emergency flex items-center justify-center relative">
            <Heart className="w-4 h-4 text-white fill-white" />
          </span>
        </div>
        <span className="text-emergency text-xs font-bold">110 BPM</span>
        <span className="text-white/30 text-xs">"Stayin' Alive" — Bee Gees</span>
      </div>
    </div>
  );
}

function IPhoneScreen({ state }: { state: DemoState }) {
  return (
    <AnimatePresence mode="wait">
      {state === "locked" && (
        <motion.div
          key="locked"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full bg-gradient-to-b from-[#0d1b2a] via-[#0a1525] to-[#080f1a] flex flex-col"
        >
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-white/40 text-sm mb-1">Tuesday, March 28</div>
            <div className="text-white text-6xl font-thin tracking-tight">9:41</div>
          </div>
          <div className="text-center text-white/20 text-xs pb-8">Tap to unlock</div>
        </motion.div>
      )}

      {state === "alert" && (
        <motion.div
          key="alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full bg-gradient-to-b from-[#0d1b2a] via-[#0a1525] to-[#080f1a] flex flex-col"
        >
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-white/40 text-sm mb-1">Tuesday, March 28</div>
            <div className="text-white text-6xl font-thin tracking-tight">9:41</div>
          </div>
          {/* Notification */}
          <div className="px-3 pb-6 notif-slide">
            <div className="bg-[#1c1c1e]/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2.5 px-4 pt-3 pb-2 border-b border-white/5">
                <div className="w-7 h-7 rounded-lg bg-emergency flex items-center justify-center flex-shrink-0">
                  <Heart className="w-3.5 h-3.5 text-white fill-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs font-bold">ERAC</span>
                    <span className="text-white/30 text-xs">now</span>
                  </div>
                  <div className="text-white/40 text-xs">EMERGENCY NEARBY</div>
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-white text-xs font-medium mb-1">
                  Cardiac arrest detected — 32m away
                </p>
                <p className="text-white/50 text-xs">
                  John D. needs help. You are one of 4 people nearby.
                </p>
              </div>
              <div className="flex border-t border-white/5">
                <button className="flex-1 py-2.5 text-xs text-emergency font-semibold text-center border-r border-white/5">
                  Respond
                </button>
                <button className="flex-1 py-2.5 text-xs text-white/40 text-center">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {state === "map" && (
        <motion.div
          key="map"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full"
        >
          <MockMap />
        </motion.div>
      )}

      {state === "cpr" && (
        <motion.div
          key="cpr"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="w-full h-full"
        >
          <CPRStep />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AlertDemo() {
  const [state, setState] = useState<DemoState>("locked");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const current = demoStates[state];

  const advance = () => {
    if (current.next) setState(current.next);
  };

  const stateLabels: Record<DemoState, string> = {
    locked: "Phone is locked",
    alert: "Critical Alert received",
    map: "Live map view",
    cpr: "CPR guide active",
  };

  return (
    <section id="alert-demo" className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs text-pulse uppercase tracking-widest font-semibold">
            Interactive Demo
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
            See it happen in real time.
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            This is exactly what appears on a bystander's screen during a cardiac
            emergency.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* iPhone mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-shrink-0 flex flex-col items-center gap-6"
          >
            {/* Phone frame */}
            <div
              className="relative cursor-pointer select-none"
              style={{ width: "280px", height: "560px" }}
              onClick={advance}
            >
              {/* Phone body */}
              <div className="absolute inset-0 bg-[#1c1c1e] rounded-[44px] border border-[#3a3a3c] shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
                {/* Side button */}
                <div className="absolute right-[-3px] top-28 w-[3px] h-16 bg-[#3a3a3c] rounded-r-sm" />
                {/* Volume */}
                <div className="absolute left-[-3px] top-24 w-[3px] h-8 bg-[#3a3a3c] rounded-l-sm" />
                <div className="absolute left-[-3px] top-36 w-[3px] h-8 bg-[#3a3a3c] rounded-l-sm" />
                {/* Screen */}
                <div className="absolute inset-[10px] bg-black rounded-[38px] overflow-hidden">
                  {/* Dynamic island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20 border border-[#1c1c1e]" />
                  {/* Content */}
                  <div className="absolute inset-0 pt-3">
                    <IPhoneScreen state={state} />
                  </div>
                </div>
              </div>
              {/* Glow when alert */}
              {(state === "alert" || state === "map") && (
                <div className="absolute inset-0 rounded-[44px] pointer-events-none"
                  style={{ boxShadow: "0 0 60px rgba(232,25,44,0.25), 0 0 120px rgba(232,25,44,0.1)" }}
                />
              )}
            </div>

            {/* CTA button */}
            <button
              onClick={advance}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:scale-105"
            >
              {current.label}
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>
          </motion.div>

          {/* Right side content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 max-w-lg"
          >
            {/* Step indicators */}
            <div className="flex items-center gap-3 mb-10">
              {(["locked", "alert", "map", "cpr"] as DemoState[]).map((s, i) => (
                <button
                  key={s}
                  onClick={() => setState(s)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    state === s
                      ? "bg-emergency text-white"
                      : "bg-white/5 text-white/40 hover:bg-white/8"
                  }`}
                >
                  <span className="font-mono">{i + 1}</span>
                  {stateLabels[s]}
                </button>
              ))}
            </div>

            {/* Dynamic description */}
            <AnimatePresence mode="wait">
              {state === "locked" && (
                <motion.div key="desc-locked" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <h3 className="text-2xl font-bold text-white mb-3">Passive protection, always on.</h3>
                  <p className="text-white/50 leading-relaxed mb-4">
                    Your phone sits in your pocket, completely normal. ERAC runs silently
                    in the background, location shared only when an emergency is active.
                  </p>
                  <p className="text-white/30 text-sm">No battery drain. No constant notifications. Until they matter.</p>
                </motion.div>
              )}
              {state === "alert" && (
                <motion.div key="desc-alert" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Breaks through <span className="text-emergency">everything.</span>
                  </h3>
                  <p className="text-white/50 leading-relaxed mb-4">
                    The Critical Alert entitlement bypasses Do Not Disturb, Silent mode,
                    and Focus modes. When a life is at stake, you hear it.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-success bg-success/10 border border-success/20 rounded-full px-4 py-2 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Bypasses DND · Silent · Focus modes
                  </div>
                </motion.div>
              )}
              {state === "map" && (
                <motion.div key="desc-map" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Exactly where to go.
                  </h3>
                  <p className="text-white/50 leading-relaxed mb-4">
                    The victim's GPS updates every 2 seconds. You see their precise location,
                    how far you are, and how many other responders are already on their way.
                  </p>
                  <ul className="space-y-2 text-sm text-white/40">
                    {["Live GPS · updates every 2 seconds", "Responder count — you're not alone", "One-tap directions via Apple Maps", "911 already notified"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-emergency flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              {state === "cpr" && (
                <motion.div key="desc-cpr" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    No training required.
                  </h3>
                  <p className="text-white/50 leading-relaxed mb-4">
                    7 steps, large text, a live metronome at 110 BPM. ERAC walks you through
                    AHA-approved CPR — even if you've never done it before.
                  </p>
                  <div className="glass-card rounded-xl p-4 border border-white/5">
                    <p className="text-sm text-white/60">
                      <span className="text-white font-medium">The rhythm hack:</span>{" "}
                      Think of "Stayin' Alive" by the Bee Gees. It's 103 BPM — the exact
                      pace the American Heart Association recommends for CPR.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
