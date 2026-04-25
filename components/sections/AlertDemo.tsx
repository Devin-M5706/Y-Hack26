"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  MapPin,
  Users,
  Heart,
  ArrowRight,
  ChevronRight,
  Music2,
  VolumeX,
} from "lucide-react";

function buildStayinAliveMelody(ctx: AudioContext): () => void {
  const master = ctx.createGain();
  master.gain.value = 0.16;
  master.connect(ctx.destination);

  const bps = 103 / 60;
  const beat = 1 / bps;

  const notes: Array<{ f: number; s: number; d: number }> = [
    { f: 349.23, s: 0, d: beat * 0.7 },
    { f: 349.23, s: beat, d: beat * 0.7 },
    { f: 349.23, s: beat * 2, d: beat * 0.7 },
    { f: 311.13, s: beat * 3, d: beat * 0.7 },
    { f: 349.23, s: beat * 4, d: beat * 1.7 },
    { f: 293.66, s: beat * 6, d: beat * 0.7 },
    { f: 261.63, s: beat * 7, d: beat * 2.0 },
    { f: 349.23, s: beat * 9.5, d: beat * 1.7 },
    { f: 311.13, s: beat * 11.5, d: beat * 0.7 },
    { f: 293.66, s: beat * 12.5, d: beat * 2.2 },
  ];

  const oscs: OscillatorNode[] = [];

  notes.forEach(({ f, s, d }) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(master);
    osc.type = "triangle";
    osc.frequency.value = f;

    const t = ctx.currentTime + 0.3 + s;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1, t + 0.04);
    g.gain.setValueAtTime(1, t + d - 0.06);
    g.gain.linearRampToValueAtTime(0, t + d);

    osc.start(t);
    osc.stop(t + d + 0.1);
    oscs.push(osc);
  });

  return () => {
    oscs.forEach((o) => {
      try {
        o.stop();
      } catch {}
    });
    master.disconnect();
  };
}

type DemoState = "locked" | "alert" | "map" | "cpr";

const demoStates: Record<DemoState, { label: string; next: DemoState | null }> =
  {
    locked: { label: "Tap to receive alert", next: "alert" },
    alert: { label: "Tap to respond", next: "map" },
    map: { label: "Tap to open CPR guide", next: "cpr" },
    cpr: { label: "Restart demo", next: "locked" },
  };

const stateLabels: Record<DemoState, string> = {
  locked: "Phone is locked",
  alert: "Critical Alert received",
  map: "Live map view",
  cpr: "CPR guide active",
};

function LockedScreen() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#1b1b1b] via-[#151515] to-[#0e0e0e] flex flex-col font-[var(--font-inter)]">
      <div className="pt-7 text-center">
        <div className="text-[#e4bebc]/40 text-xs tracking-wide">
          Tuesday, March 28
        </div>
        <div className="text-[#e2e2e2] text-6xl font-extralight tracking-tight mt-1">
          9:41
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#353535]/70 border border-[#5B403F]/30 backdrop-blur-xl flex items-center justify-center mx-auto mb-4 shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
            <Heart className="w-7 h-7 text-[#FFB4AA]" />
          </div>
          <p className="text-[#e4bebc]/50 text-xs">
            handsforhearts monitoring active
          </p>
        </div>
      </div>
      <div className="text-center text-[#e4bebc]/25 text-[11px] pb-8 tracking-wider uppercase">
        Tap to unlock
      </div>
    </div>
  );
}

function AlertScreen() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#1b1b1b] via-[#151515] to-[#0e0e0e] flex flex-col font-[var(--font-inter)]">
      <div className="pt-7 text-center">
        <div className="text-[#e4bebc]/40 text-xs tracking-wide">
          Tuesday, March 28
        </div>
        <div className="text-[#e2e2e2] text-6xl font-extralight tracking-tight mt-1">
          9:41
        </div>
      </div>

      <div className="flex-1" />

      <div className="px-3 pb-6">
        <div className="bg-[rgba(53,53,53,0.68)] backdrop-blur-[20px] rounded-2xl overflow-hidden border border-[#5B403F]/25 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
          <div className="flex items-center gap-2.5 px-4 pt-3 pb-2 border-b border-[#5B403F]/20">
            <div className="w-7 h-7 rounded-lg bg-[#FF5545] flex items-center justify-center flex-shrink-0">
              <Heart className="w-3.5 h-3.5 text-[#410001] fill-[#410001]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[#e2e2e2] text-xs font-semibold">
                  handsforhearts
                </span>
                <span className="text-[#e4bebc]/40 text-xs">now</span>
              </div>
              <div className="text-[#FFB4AA] text-[10px] tracking-[0.14em] uppercase font-semibold">
                Emergency Nearby
              </div>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-[#e2e2e2] text-xs font-medium mb-1">
              Cardiac arrest detected — 32m away
            </p>
            <p className="text-[#e4bebc]/60 text-xs">
              John D. needs help. You are one of 4 people nearby.
            </p>
          </div>
          <div className="flex border-t border-[#5B403F]/20">
            <button className="flex-1 py-2.5 text-xs text-[#FFB4AA] font-semibold text-center border-r border-[#5B403F]/20">
              Respond
            </button>
            <button className="flex-1 py-2.5 text-xs text-[#e4bebc]/45 text-center">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapScreen() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1b1b1b] font-[var(--font-inter)]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(91,64,63,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(91,64,63,0.28) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,85,69,0.08)_0%,rgba(14,14,14,0)_70%)]" />

      <div className="absolute top-9 left-6 w-24 h-12 bg-[#2A2A2A]/85 rounded-sm" />
      <div className="absolute top-10 right-5 w-16 h-16 bg-[#1F1F1F]/90 rounded-sm" />
      <div className="absolute bottom-16 left-8 w-20 h-10 bg-[#2A2A2A]/85 rounded-sm" />
      <div className="absolute bottom-20 right-6 w-14 h-20 bg-[#1F1F1F]/90 rounded-sm" />
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-20 h-14 bg-[#53E16F]/15 rounded-sm" />

      <div className="absolute bottom-24 left-12 w-3 h-3 bg-[#53E16F] rounded-full border-2 border-[#131313] shadow-[0_0_12px_rgba(83,225,111,0.5)]" />

      <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <span className="absolute w-16 h-16 rounded-full bg-[#FF5545]/20 animate-ping" />
        <span className="absolute w-10 h-10 rounded-full bg-[#FF5545]/25" />
        <div className="relative w-5 h-5 bg-[#FF5545] rounded-full border-2 border-[#131313] shadow-[0_0_20px_rgba(255,85,69,0.4)] flex items-center justify-center">
          <Heart className="w-2.5 h-2.5 text-[#410001] fill-[#410001]" />
        </div>
      </div>

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 280 380"
      >
        <path
          d="M 48 290 L 48 200 L 140 200 L 140 185"
          stroke="#FFB4AA"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="6 4"
          opacity="0.8"
        />
      </svg>

      <div className="absolute top-3 left-3 right-3 bg-[rgba(53,53,53,0.7)] backdrop-blur-[20px] rounded-xl p-3 border border-[#5B403F]/25">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[#FFB4AA] text-xs font-bold uppercase tracking-wide">
            Emergency
          </span>
          <span className="text-[#e4bebc]/40 text-xs">Live</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#e4bebc]/75">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#FF5545]" />
            John D. · 32m away
          </span>
          <span className="flex items-center gap-1 text-[#53E16F]">
            <Users className="w-3 h-3" />3 responding
          </span>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex gap-2">
        <button className="flex-1 bg-gradient-to-r from-[#FFB4AA] to-[#FF5545] text-[#690003] text-xs font-semibold py-2.5 rounded-xl shadow-[0_10px_24px_rgba(255,85,69,0.35)] flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          I&apos;m on my way
        </button>
        <button className="flex-1 bg-[rgba(53,53,53,0.7)] text-[#e2e2e2] text-xs font-semibold py-2.5 rounded-xl border border-[#5B403F]/25 flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-[#FFB4AA]" />
          CPR Guide
        </button>
      </div>
    </div>
  );
}

function CPRStepScreen() {
  return (
    <div className="w-full h-full bg-[#131313] flex flex-col items-center justify-center px-5 py-6 font-[var(--font-inter)]">
      <div className="text-[11px] text-[#e4bebc]/45 tracking-wider uppercase mb-4 self-start">
        Step 4 / 7
      </div>

      <div className="w-full bg-[#1F1F1F] rounded-full h-1 mb-8">
        <div
          className="bg-gradient-to-r from-[#FFB4AA] to-[#FF5545] h-1 rounded-full"
          style={{ width: "57%" }}
        />
      </div>

      <div className="w-16 h-16 rounded-2xl bg-[#FF5545]/15 border border-[#5B403F]/30 flex items-center justify-center mb-5">
        <Heart className="w-8 h-8 text-[#FFB4AA] animate-pulse" />
      </div>

      <h3 className="text-lg font-semibold text-[#e2e2e2] text-center mb-2">
        Begin Compressions
      </h3>
      <p className="text-[#e4bebc]/60 text-xs text-center leading-relaxed mb-6">
        Push hard and fast — at least 2 inches deep. Allow full chest recoil.
        Keep elbows locked.
      </p>

      <div className="flex flex-col items-center gap-2">
        <div className="relative w-10 h-10">
          <span className="absolute inset-0 rounded-full bg-[#FF5545]/30 animate-ping" />
          <span className="w-10 h-10 rounded-full bg-[#FF5545] flex items-center justify-center relative">
            <Heart className="w-4 h-4 text-[#410001] fill-[#410001]" />
          </span>
        </div>
        <span className="text-[#FFB4AA] text-xs font-bold tracking-wider">
          110 BPM
        </span>
        <span className="text-[#e4bebc]/45 text-xs">
          &quot;Stayin&apos; Alive&quot; — Bee Gees
        </span>
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
          className="w-full h-full"
        >
          <LockedScreen />
        </motion.div>
      )}

      {state === "alert" && (
        <motion.div
          key="alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full"
        >
          <AlertScreen />
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
          <MapScreen />
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
          <CPRStepScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AlertDemo() {
  const [state, setState] = useState<DemoState>("locked");
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const hasPlayed = useRef(false);
  const stopMelody = useRef<(() => void) | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!inView || hasPlayed.current || muted) return;
    hasPlayed.current = true;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      stopMelody.current = buildStayinAliveMelody(audioCtx);
      setIsPlaying(true);
      const timer = setTimeout(() => setIsPlaying(false), 9000);
      return () => clearTimeout(timer);
    } catch {}
  }, [inView, muted]);

  const handleMute = useCallback(() => {
    stopMelody.current?.();
    setIsPlaying(false);
    setMuted(true);
  }, []);

  const current = demoStates[state];
  const advance = () => {
    if (current.next) setState(current.next);
  };

  return (
    <section id="alert-demo" className="py-32 px-6 bg-[#131313]" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] text-[#FFB4AA] uppercase tracking-[0.18em] font-semibold">
            Interactive Demo
          </span>
          <h2 className="text-4xl sm:text-5xl text-[#e2e2e2] mt-3 mb-4 italic font-['Newsreader']">
            See it happen in real time.
          </h2>

          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="inline-flex items-center gap-2 mt-3 bg-[#FF5545]/10 border border-[#5B403F]/30 text-[#FFB4AA] text-xs font-medium px-4 py-2 rounded-full"
              >
                <Music2 className="w-3.5 h-3.5 animate-pulse" />
                Stayin&apos; Alive — Bee Gees · 103 BPM
                <button
                  onClick={handleMute}
                  className="ml-1 text-[#FFB4AA]/55 hover:text-[#FFB4AA] transition-colors"
                  aria-label="Mute"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[#e4bebc]/70 text-lg max-w-xl mx-auto mt-3">
            This is exactly what appears on a bystander&apos;s screen during a
            cardiac emergency.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-shrink-0 flex flex-col items-center gap-6"
          >
            <div
              className="relative cursor-pointer select-none"
              style={{ width: "280px", height: "560px" }}
              onClick={advance}
            >
              <div className="absolute inset-0 bg-[#1F1F1F] rounded-[44px] border border-[#5B403F]/30 shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
                <div className="absolute right-[-3px] top-28 w-[3px] h-16 bg-[#5B403F]/50 rounded-r-sm" />
                <div className="absolute left-[-3px] top-24 w-[3px] h-8 bg-[#5B403F]/50 rounded-l-sm" />
                <div className="absolute left-[-3px] top-36 w-[3px] h-8 bg-[#5B403F]/50 rounded-l-sm" />

                <div className="absolute inset-[10px] bg-black rounded-[38px] overflow-hidden">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20 border border-[#1F1F1F]" />
                  <div className="absolute inset-0 pt-3">
                    <IPhoneScreen state={state} />
                  </div>
                </div>
              </div>

              {(state === "alert" || state === "map") && (
                <div
                  className="absolute inset-0 rounded-[44px] pointer-events-none"
                  style={{
                    boxShadow:
                      "0 0 60px rgba(255,85,69,0.25), 0 0 120px rgba(255,85,69,0.10)",
                  }}
                />
              )}
            </div>

            <button
              onClick={advance}
              className="flex items-center gap-2 bg-[rgba(53,53,53,0.65)] hover:bg-[rgba(57,57,57,0.8)] border border-[#5B403F]/25 text-[#e2e2e2] text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:scale-105"
            >
              {current.label}
              <ChevronRight className="w-4 h-4 text-[#e4bebc]/50" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 max-w-lg"
          >
            <div className="flex flex-wrap items-center gap-3 mb-10">
              {(["locked", "alert", "map", "cpr"] as DemoState[]).map(
                (s, i) => (
                  <button
                    key={s}
                    onClick={() => setState(s)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      state === s
                        ? "bg-gradient-to-r from-[#FFB4AA] to-[#FF5545] text-[#690003] shadow-[0_8px_24px_rgba(255,85,69,0.35)]"
                        : "bg-[rgba(53,53,53,0.5)] text-[#e4bebc]/65 border border-[#5B403F]/20 hover:bg-[rgba(53,53,53,0.75)]"
                    }`}
                  >
                    <span className="font-mono">{i + 1}</span>
                    {stateLabels[s]}
                  </button>
                ),
              )}
            </div>

            <AnimatePresence mode="wait">
              {state === "locked" && (
                <motion.div
                  key="desc-locked"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <h3 className="text-2xl text-[#e2e2e2] mb-3 italic font-['Newsreader']">
                    Passive protection, always on.
                  </h3>
                  <p className="text-[#e4bebc]/70 leading-relaxed mb-4">
                    Your phone sits in your pocket, completely normal.
                    handsforhearts runs silently in the background, location
                    shared only when an emergency is active.
                  </p>
                  <p className="text-[#e4bebc]/45 text-sm">
                    No battery drain. No constant notifications. Until they
                    matter.
                  </p>
                </motion.div>
              )}

              {state === "alert" && (
                <motion.div
                  key="desc-alert"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <h3 className="text-2xl text-[#e2e2e2] mb-3 italic font-['Newsreader']">
                    Breaks through{" "}
                    <span className="text-[#FFB4AA]">everything.</span>
                  </h3>
                  <p className="text-[#e4bebc]/70 leading-relaxed mb-4">
                    The Critical Alert entitlement bypasses Do Not Disturb,
                    Silent mode, and Focus modes. When a life is at stake, you
                    hear it.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[#53E16F] bg-[#53E16F]/10 border border-[#53E16F]/20 rounded-full px-4 py-2 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#53E16F] animate-pulse" />
                    Bypasses DND · Silent · Focus modes
                  </div>
                </motion.div>
              )}

              {state === "map" && (
                <motion.div
                  key="desc-map"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <h3 className="text-2xl text-[#e2e2e2] mb-3 italic font-['Newsreader']">
                    Exactly where to go.
                  </h3>
                  <p className="text-[#e4bebc]/70 leading-relaxed mb-4">
                    The victim&apos;s GPS updates every 2 seconds. You see their
                    precise location, how far you are, and how many other
                    responders are already on their way.
                  </p>
                  <ul className="space-y-2 text-sm text-[#e4bebc]/60">
                    {[
                      "Live GPS · updates every 2 seconds",
                      "Responder count — you&apos;re not alone",
                      "One-tap directions via Apple Maps",
                      "911 already notified",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-[#FFB4AA] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {state === "cpr" && (
                <motion.div
                  key="desc-cpr"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <h3 className="text-2xl text-[#e2e2e2] mb-3 italic font-['Newsreader']">
                    No training required.
                  </h3>
                  <p className="text-[#e4bebc]/70 leading-relaxed mb-4">
                    7 steps, large text, and a live metronome at 110 BPM.
                    handsforhearts walks you through AHA-approved CPR — even if
                    you&apos;ve never done it before.
                  </p>
                  <div className="rounded-xl p-4 border border-[#5B403F]/25 bg-[rgba(53,53,53,0.45)] backdrop-blur-[20px]">
                    <p className="text-sm text-[#e4bebc]/70">
                      <span className="text-[#e2e2e2] font-medium">
                        The rhythm hack:
                      </span>{" "}
                      Think of &quot;Stayin&apos; Alive&quot; by the Bee Gees.
                      It&apos;s 103 BPM — the exact pace the American Heart
                      Association recommends for CPR.
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
