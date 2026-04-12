"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Phone,
  Hand,
  Heart,
  Music2,
  Wind,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";

const steps = [
  {
    number: 1,
    icon: HelpCircle,
    color: "#FF6B35",
    title: "Check Responsiveness",
    instruction: "Tap their shoulders firmly. Shout 'Are you OK?' Look for any eye movement, breathing, or reaction.",
    tip: "If no response in 5 seconds — act immediately.",
    action: "Tap. Shout. Watch.",
    hasMetronome: false,
  },
  {
    number: 2,
    icon: Phone,
    color: "#FF6B35",
    title: "Call 911",
    instruction: "Call 911 now — or point to a specific person and say 'You, call 911.' Pointing to someone prevents the bystander effect.",
    tip: "handsforhearts has already initiated the call. Confirm help is coming.",
    action: "Call. Delegate. Confirm.",
    hasMetronome: false,
  },
  {
    number: 3,
    icon: Hand,
    color: "#FF6B35",
    title: "Position Your Hands",
    instruction: "Kneel beside them. Place the heel of your dominant hand on the center of the chest — lower half of the breastbone. Stack your other hand on top, fingers interlaced. Lock your elbows.",
    tip: "Shoulders directly over your hands. Arms straight.",
    action: "Center of chest. Stack. Lock.",
    hasMetronome: false,
  },
  {
    number: 4,
    icon: Heart,
    color: "#E8192C",
    title: "Begin Compressions",
    instruction: "Push straight down at least 2 inches (5cm). Allow the chest to fully rise between compressions — don't lean on the chest between pushes.",
    tip: "It may feel like a lot of force. That's correct. Keep going.",
    action: "Hard. Deep. Full recoil.",
    hasMetronome: true,
  },
  {
    number: 5,
    icon: Music2,
    color: "#E8192C",
    title: "Keep the Rhythm",
    instruction: "100–120 compressions per minute. Think of the beat of 'Stayin' Alive' by the Bee Gees — it's 103 BPM and was chosen by the American Heart Association as an official CPR mnemonic.",
    tip: '"Ah, ha, ha, ha, stayin\' alive, stayin\' alive..."',
    action: "100–120 BPM. Think: Stayin' Alive.",
    hasMetronome: true,
    isStayinAlive: true,
  },
  {
    number: 6,
    icon: Wind,
    color: "#FF6B35",
    title: "Rescue Breaths (Optional)",
    instruction: "After every 30 compressions: tilt the head back, lift the chin, pinch the nose, seal your mouth over theirs, and give 2 breaths (1 second each). Watch for chest rise.",
    tip: "Not trained or uncomfortable? Compression-only CPR is still highly effective. Don't stop compressions.",
    action: "30 compressions : 2 breaths. Or skip.",
    hasMetronome: false,
  },
  {
    number: 7,
    icon: ShieldCheck,
    color: "#30D158",
    title: "Don't Stop",
    instruction: "Continue CPR until EMS takes over, the person shows clear signs of life (normal breathing, purposeful movement), or you physically cannot continue. Don't stop to check pulse repeatedly.",
    tip: "What you are doing right now is extraordinary. Keep going.",
    action: "Keep going. You are saving a life.",
    hasMetronome: false,
  },
];

const BPM = 110;
const BEAT_INTERVAL = Math.round((60 / BPM) * 1000);

function Metronome({ active, showStayinAlive }: { active: boolean; showStayinAlive?: boolean }) {
  const [beat, setBeat] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClick = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }, []);

  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;
    // Self-correcting timer: measures drift each beat and compensates,
    // keeping the visual pulse locked to the target BPM over time.
    let expected = performance.now() + BEAT_INTERVAL;

    const tick = () => {
      setBeat((b) => !b);
      if (soundOn) playClick();
      const drift = performance.now() - expected;
      expected += BEAT_INTERVAL;
      tickRef.current = setTimeout(tick, Math.max(0, BEAT_INTERVAL - drift));
    };

    tickRef.current = setTimeout(tick, BEAT_INTERVAL);
    return () => {
      if (tickRef.current) clearTimeout(tickRef.current);
    };
  }, [active, soundOn, playClick]);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Beat circle */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={active ? { scale: beat ? 1.18 : 1, opacity: beat ? 1 : 0.8 } : { scale: 1 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="relative w-24 h-24 rounded-full bg-emergency flex items-center justify-center"
          style={{ boxShadow: beat ? "0 0 40px rgba(232,25,44,0.6)" : "0 0 15px rgba(232,25,44,0.2)" }}
        >
          <Heart className="w-10 h-10 text-white fill-white" />
          {beat && (
            <motion.span
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 rounded-full bg-emergency"
            />
          )}
        </motion.div>
      </div>

      {/* BPM display */}
      <div className="text-center">
        <div className="text-3xl font-bold text-emergency">{BPM}</div>
        <div className="text-white/40 text-sm">BPM</div>
      </div>

      {/* Stayin' Alive card */}
      {showStayinAlive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 border border-white/10 max-w-xs text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Music2 className="w-4 h-4 text-emergency" />
            <span className="text-white font-semibold text-sm">Stayin' Alive</span>
            <span className="text-white/30 text-xs">— Bee Gees</span>
          </div>
          <p className="text-white/40 text-xs leading-relaxed">
            The AHA officially recommends this song as a CPR rhythm guide. It's 103 BPM —
            exactly right.
          </p>
          <p className="text-white/30 text-xs mt-2 italic">
            "Ah, ha, ha, ha, stayin' alive..."
          </p>
        </motion.div>
      )}

      {/* Sound toggle */}
      <button
        onClick={() => setSoundOn((s) => !s)}
        className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
      >
        {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        {soundOn ? "Beat sound on" : "Beat sound off"}
      </button>
    </div>
  );
}

export default function CPRGuide() {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const progress = ((current + 1) / steps.length) * 100;

  const prev = () => current > 0 && setCurrent((c) => c - 1);
  const next = () => current < steps.length - 1 && setCurrent((c) => c + 1);

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
        <motion.div
          className="h-full bg-emergency"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#080808]/90 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-emergency animate-heartbeat" />
          <span className="text-white font-bold text-sm">CPR Guide</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/40">
          <span className="font-mono">
            {current + 1}
          </span>
          <span className="text-white/20">/</span>
          <span className="font-mono text-white/20">{steps.length}</span>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-2 py-5 px-6">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-300"
          >
            <div
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-emergency"
                  : i < current
                  ? "w-2 h-2 bg-emergency/40"
                  : "w-2 h-2 bg-white/10"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-5xl mx-auto w-full px-6 pb-10 gap-10">
        {/* Text side */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-center"
          >
            {/* Step number */}
            <div className="text-xs font-mono text-white/20 mb-3">
              Step {step.number} of {steps.length}
            </div>

            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}20` }}
            >
              <step.icon className="w-8 h-8" style={{ color: step.color }} strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
              style={{ color: step.color === "#30D158" ? "#30D158" : "white" }}
            >
              {step.title}
            </h1>

            {/* Instruction */}
            <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-lg">
              {step.instruction}
            </p>

            {/* Action callout */}
            <div
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold w-fit mb-6"
              style={{ backgroundColor: `${step.color}15`, color: step.color }}
            >
              {step.action}
            </div>

            {/* Tip */}
            <p className="text-white/30 text-sm leading-relaxed max-w-md italic">
              {step.tip}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Right side: always mounted to prevent layout shift on step transitions */}
        <div className="lg:w-80 flex items-center justify-center">
          {/* Metronome — hidden (not unmounted) on non-metronome steps */}
          <div style={{ visibility: step.hasMetronome ? "visible" : "hidden", position: step.hasMetronome ? "relative" : "absolute" }}>
            <Metronome active={step.hasMetronome} showStayinAlive={"isStayinAlive" in step} />
          </div>

          {/* Step 7 completion visual */}
          {!step.hasMetronome && current === 6 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative w-24 h-24">
                <span className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
                <div className="w-24 h-24 rounded-full bg-success/20 border border-success/30 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-success" />
                </div>
              </div>
              <p className="text-success text-sm font-medium text-center">Help is on the way.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-[#080808]/95 backdrop-blur border-t border-white/5 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center gap-2 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Previous</span>
          </button>

          <div className="text-xs text-white/20 text-center hidden sm:block">
            Tap anywhere on the progress dots to jump to a step
          </div>

          {current < steps.length - 1 ? (
            <button
              onClick={next}
              className="flex items-center gap-2 bg-emergency hover:bg-emergency/90 text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105"
            >
              <span className="text-sm">Next Step</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setCurrent(0)}
              className="flex items-center gap-2 bg-success/20 hover:bg-success/30 text-success font-semibold px-6 py-3 rounded-full transition-all border border-success/30"
            >
              <span className="text-sm">Start Over</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
