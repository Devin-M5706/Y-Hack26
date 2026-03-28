import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emergency: "#E8192C",
        pulse: "#FF6B35",
        surface: "#111111",
        "surface-2": "#1A1A1A",
        success: "#30D158",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.2)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.2)" },
          "70%": { transform: "scale(1)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        "ecg-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "beat": {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(232,25,44,0.4)" },
          "50%": { transform: "scale(1.12)", boxShadow: "0 0 0 20px rgba(232,25,44,0)" },
        },
      },
      animation: {
        heartbeat: "heartbeat 1.2s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        "ecg-scroll": "ecg-scroll 7s linear infinite",
        "slide-up": "slide-up 0.4s ease-out",
        beat: "beat 0.55s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
