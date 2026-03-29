(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/cpr/CPRGuide.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CPRGuide
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-help.js [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hand.js [app-client] (ecmascript) <export default as Hand>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/music-2.js [app-client] (ecmascript) <export default as Music2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-client] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-client] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-x.js [app-client] (ecmascript) <export default as VolumeX>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const steps = [
    {
        number: 1,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"],
        color: "#FF6B35",
        title: "Check Responsiveness",
        instruction: "Tap their shoulders firmly. Shout 'Are you OK?' Look for any eye movement, breathing, or reaction.",
        tip: "If no response in 5 seconds — act immediately.",
        action: "Tap. Shout. Watch.",
        hasMetronome: false
    },
    {
        number: 2,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"],
        color: "#FF6B35",
        title: "Call 911",
        instruction: "Call 911 now — or point to a specific person and say 'You, call 911.' Pointing to someone prevents the bystander effect.",
        tip: "ERAC has already initiated the call. Confirm help is coming.",
        action: "Call. Delegate. Confirm.",
        hasMetronome: false
    },
    {
        number: 3,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__["Hand"],
        color: "#FF6B35",
        title: "Position Your Hands",
        instruction: "Kneel beside them. Place the heel of your dominant hand on the center of the chest — lower half of the breastbone. Stack your other hand on top, fingers interlaced. Lock your elbows.",
        tip: "Shoulders directly over your hands. Arms straight.",
        action: "Center of chest. Stack. Lock.",
        hasMetronome: false
    },
    {
        number: 4,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
        color: "#E8192C",
        title: "Begin Compressions",
        instruction: "Push straight down at least 2 inches (5cm). Allow the chest to fully rise between compressions — don't lean on the chest between pushes.",
        tip: "It may feel like a lot of force. That's correct. Keep going.",
        action: "Hard. Deep. Full recoil.",
        hasMetronome: true
    },
    {
        number: 5,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__["Music2"],
        color: "#E8192C",
        title: "Keep the Rhythm",
        instruction: "100–120 compressions per minute. Think of the beat of 'Stayin' Alive' by the Bee Gees — it's 103 BPM and was chosen by the American Heart Association as an official CPR mnemonic.",
        tip: '"Ah, ha, ha, ha, stayin\' alive, stayin\' alive..."',
        action: "100–120 BPM. Think: Stayin' Alive.",
        hasMetronome: true,
        isStayinAlive: true
    },
    {
        number: 6,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"],
        color: "#FF6B35",
        title: "Rescue Breaths (Optional)",
        instruction: "After every 30 compressions: tilt the head back, lift the chin, pinch the nose, seal your mouth over theirs, and give 2 breaths (1 second each). Watch for chest rise.",
        tip: "Not trained or uncomfortable? Compression-only CPR is still highly effective. Don't stop compressions.",
        action: "30 compressions : 2 breaths. Or skip.",
        hasMetronome: false
    },
    {
        number: 7,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"],
        color: "#30D158",
        title: "Don't Stop",
        instruction: "Continue CPR until EMS takes over, the person shows clear signs of life (normal breathing, purposeful movement), or you physically cannot continue. Don't stop to check pulse repeatedly.",
        tip: "What you are doing right now is extraordinary. Keep going.",
        action: "Keep going. You are saving a life.",
        hasMetronome: false
    }
];
const BPM = 110;
const BEAT_INTERVAL = Math.round(60 / BPM * 1000);
function Metronome({ active, showStayinAlive }) {
    _s();
    const [beat, setBeat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [soundOn, setSoundOn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const audioCtxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const playClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Metronome.useCallback[playClick]": ()=>{
            try {
                if (!audioCtxRef.current) {
                    audioCtxRef.current = new AudioContext();
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
            } catch  {}
        }
    }["Metronome.useCallback[playClick]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Metronome.useEffect": ()=>{
            if (!active) return;
            const interval = setInterval({
                "Metronome.useEffect.interval": ()=>{
                    setBeat({
                        "Metronome.useEffect.interval": (b)=>!b
                    }["Metronome.useEffect.interval"]);
                    if (soundOn) playClick();
                }
            }["Metronome.useEffect.interval"], BEAT_INTERVAL);
            return ({
                "Metronome.useEffect": ()=>clearInterval(interval)
            })["Metronome.useEffect"];
        }
    }["Metronome.useEffect"], [
        active,
        soundOn,
        playClick
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    animate: active ? {
                        scale: beat ? 1.18 : 1,
                        opacity: beat ? 1 : 0.8
                    } : {
                        scale: 1
                    },
                    transition: {
                        duration: 0.1,
                        ease: "easeOut"
                    },
                    className: "relative w-24 h-24 rounded-full bg-emergency flex items-center justify-center",
                    style: {
                        boxShadow: beat ? "0 0 40px rgba(232,25,44,0.6)" : "0 0 15px rgba(232,25,44,0.2)"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                            className: "w-10 h-10 text-white fill-white"
                        }, void 0, false, {
                            fileName: "[project]/components/cpr/CPRGuide.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this),
                        beat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                            initial: {
                                scale: 1,
                                opacity: 0.5
                            },
                            animate: {
                                scale: 2,
                                opacity: 0
                            },
                            transition: {
                                duration: 0.4
                            },
                            className: "absolute inset-0 rounded-full bg-emergency"
                        }, void 0, false, {
                            fileName: "[project]/components/cpr/CPRGuide.tsx",
                            lineNumber: 141,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                    lineNumber: 133,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/cpr/CPRGuide.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-3xl font-bold text-emergency",
                        children: BPM
                    }, void 0, false, {
                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white/40 text-sm",
                        children: "BPM"
                    }, void 0, false, {
                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/cpr/CPRGuide.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            showStayinAlive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 10
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "glass-card rounded-2xl p-4 border border-white/10 max-w-xs text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center gap-2 mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__["Music2"], {
                                className: "w-4 h-4 text-emergency"
                            }, void 0, false, {
                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white font-semibold text-sm",
                                children: "Stayin' Alive"
                            }, void 0, false, {
                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white/30 text-xs",
                                children: "— Bee Gees"
                            }, void 0, false, {
                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white/40 text-xs leading-relaxed",
                        children: "The AHA officially recommends this song as a CPR rhythm guide. It's 103 BPM — exactly right."
                    }, void 0, false, {
                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white/30 text-xs mt-2 italic",
                        children: '"Ah, ha, ha, ha, stayin\' alive..."'
                    }, void 0, false, {
                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                        lineNumber: 173,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/cpr/CPRGuide.tsx",
                lineNumber: 159,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setSoundOn((s)=>!s),
                className: "flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors",
                children: [
                    soundOn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                        className: "w-3.5 h-3.5"
                    }, void 0, false, {
                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                        lineNumber: 184,
                        columnNumber: 20
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__["VolumeX"], {
                        className: "w-3.5 h-3.5"
                    }, void 0, false, {
                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                        lineNumber: 184,
                        columnNumber: 58
                    }, this),
                    soundOn ? "Beat sound on" : "Beat sound off"
                ]
            }, void 0, true, {
                fileName: "[project]/components/cpr/CPRGuide.tsx",
                lineNumber: 180,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/cpr/CPRGuide.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_s(Metronome, "c+0ArjJm+2/ZeLEjIPs2Lwu0nEI=");
_c = Metronome;
function CPRGuide() {
    _s1();
    const [current, setCurrent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const step = steps[current];
    const progress = (current + 1) / steps.length * 100;
    const prev = ()=>current > 0 && setCurrent((c)=>c - 1);
    const next = ()=>current < steps.length - 1 && setCurrent((c)=>c + 1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#080808] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-0 left-0 right-0 z-50 h-1 bg-white/5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "h-full bg-emergency",
                    animate: {
                        width: `${progress}%`
                    },
                    transition: {
                        duration: 0.3
                    }
                }, void 0, false, {
                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                    lineNumber: 203,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/cpr/CPRGuide.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sticky top-0 z-40 bg-[#080808]/90 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                className: "w-5 h-5 text-emergency animate-heartbeat"
                            }, void 0, false, {
                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                lineNumber: 213,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white font-bold text-sm",
                                children: "CPR Guide"
                            }, void 0, false, {
                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                lineNumber: 214,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                        lineNumber: 212,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-sm text-white/40",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono",
                                children: current + 1
                            }, void 0, false, {
                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                lineNumber: 217,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white/20",
                                children: "/"
                            }, void 0, false, {
                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                lineNumber: 220,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-white/20",
                                children: steps.length
                            }, void 0, false, {
                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                        lineNumber: 216,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/cpr/CPRGuide.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center gap-2 py-5 px-6",
                children: steps.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setCurrent(i),
                        className: "transition-all duration-300",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-emergency" : i < current ? "w-2 h-2 bg-emergency/40" : "w-2 h-2 bg-white/10"}`
                        }, void 0, false, {
                            fileName: "[project]/components/cpr/CPRGuide.tsx",
                            lineNumber: 233,
                            columnNumber: 13
                        }, this)
                    }, i, false, {
                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/cpr/CPRGuide.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col lg:flex-row max-w-5xl mx-auto w-full px-6 pb-10 gap-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        mode: "wait",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                x: 30
                            },
                            animate: {
                                opacity: 1,
                                x: 0
                            },
                            exit: {
                                opacity: 0,
                                x: -30
                            },
                            transition: {
                                duration: 0.3
                            },
                            className: "flex-1 flex flex-col justify-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs font-mono text-white/20 mb-3",
                                    children: [
                                        "Step ",
                                        step.number,
                                        " of ",
                                        steps.length
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                                    lineNumber: 259,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                                    style: {
                                        backgroundColor: `${step.color}15`,
                                        border: `1px solid ${step.color}20`
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(step.icon, {
                                        className: "w-8 h-8",
                                        style: {
                                            color: step.color
                                        },
                                        strokeWidth: 1.5
                                    }, void 0, false, {
                                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                                        lineNumber: 268,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                                    lineNumber: 264,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-4xl sm:text-5xl font-bold mb-5 leading-tight",
                                    style: {
                                        color: step.color === "#30D158" ? "#30D158" : "white"
                                    },
                                    children: step.title
                                }, void 0, false, {
                                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-white/70 text-lg leading-relaxed mb-6 max-w-lg",
                                    children: step.instruction
                                }, void 0, false, {
                                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold w-fit mb-6",
                                    style: {
                                        backgroundColor: `${step.color}15`,
                                        color: step.color
                                    },
                                    children: step.action
                                }, void 0, false, {
                                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                                    lineNumber: 285,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-white/30 text-sm leading-relaxed max-w-md italic",
                                    children: step.tip
                                }, void 0, false, {
                                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                                    lineNumber: 293,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, current, true, {
                            fileName: "[project]/components/cpr/CPRGuide.tsx",
                            lineNumber: 250,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:w-80 flex items-center justify-center",
                        children: step.hasMetronome ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            mode: "wait",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    scale: 0.9
                                },
                                animate: {
                                    opacity: 1,
                                    scale: 1
                                },
                                exit: {
                                    opacity: 0,
                                    scale: 0.9
                                },
                                transition: {
                                    duration: 0.3
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Metronome, {
                                    active: true,
                                    showStayinAlive: "isStayinAlive" in step
                                }, void 0, false, {
                                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                                    lineNumber: 310,
                                    columnNumber: 17
                                }, this)
                            }, `metro-${current}`, false, {
                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                lineNumber: 303,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/cpr/CPRGuide.tsx",
                            lineNumber: 302,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full",
                            children: current === 6 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    scale: 0.8
                                },
                                animate: {
                                    opacity: 1,
                                    scale: 1
                                },
                                className: "flex flex-col items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative w-24 h-24",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute inset-0 rounded-full bg-success/20 animate-ping"
                                            }, void 0, false, {
                                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                                lineNumber: 323,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-24 h-24 rounded-full bg-success/20 border border-success/30 flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                    className: "w-10 h-10 text-success"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                                                    lineNumber: 325,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                                lineNumber: 324,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                                        lineNumber: 322,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-success text-sm font-medium text-center",
                                        children: "Help is on the way."
                                    }, void 0, false, {
                                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                                        lineNumber: 328,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                lineNumber: 317,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/cpr/CPRGuide.tsx",
                            lineNumber: 314,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/cpr/CPRGuide.tsx",
                        lineNumber: 300,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/cpr/CPRGuide.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sticky bottom-0 bg-[#080808]/95 backdrop-blur border-t border-white/5 px-6 py-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-5xl mx-auto flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: prev,
                            disabled: current === 0,
                            className: "flex items-center gap-2 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                                    lineNumber: 344,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm hidden sm:inline",
                                    children: "Previous"
                                }, void 0, false, {
                                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                                    lineNumber: 345,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/cpr/CPRGuide.tsx",
                            lineNumber: 339,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-white/20 text-center hidden sm:block",
                            children: "Tap anywhere on the progress dots to jump to a step"
                        }, void 0, false, {
                            fileName: "[project]/components/cpr/CPRGuide.tsx",
                            lineNumber: 348,
                            columnNumber: 11
                        }, this),
                        current < steps.length - 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: next,
                            className: "flex items-center gap-2 bg-emergency hover:bg-emergency/90 text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm",
                                    children: "Next Step"
                                }, void 0, false, {
                                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                                    lineNumber: 357,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                                    lineNumber: 358,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/cpr/CPRGuide.tsx",
                            lineNumber: 353,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setCurrent(0),
                            className: "flex items-center gap-2 bg-success/20 hover:bg-success/30 text-success font-semibold px-6 py-3 rounded-full transition-all border border-success/30",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm",
                                children: "Start Over"
                            }, void 0, false, {
                                fileName: "[project]/components/cpr/CPRGuide.tsx",
                                lineNumber: 365,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/cpr/CPRGuide.tsx",
                            lineNumber: 361,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/cpr/CPRGuide.tsx",
                    lineNumber: 338,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/cpr/CPRGuide.tsx",
                lineNumber: 337,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/cpr/CPRGuide.tsx",
        lineNumber: 200,
        columnNumber: 5
    }, this);
}
_s1(CPRGuide, "8+O75ArtRNvpQgzeZSk5wKohTHI=");
_c1 = CPRGuide;
var _c, _c1;
__turbopack_context__.k.register(_c, "Metronome");
__turbopack_context__.k.register(_c1, "CPRGuide");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_cpr_CPRGuide_tsx_0f0d7--._.js.map