"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080808]/90 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Activity
              className="w-5 h-5 text-emergency group-hover:animate-heartbeat transition-all"
              strokeWidth={2.5}
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emergency rounded-full animate-pulse" />
          </div>
          <span className="font-bold text-white tracking-tight text-lg">
            hands<span className="text-emergency">for</span>hearts
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "How It Works", href: "#how-it-works" },
            { label: "Alert Demo", href: "#alert-demo" },
            { label: "CPR Guide", href: "/cpr-guide" },
            { label: "Why It Matters", href: "#why-it-matters" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 border border-white/10 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            App coming soon
          </span>
        </div>
      </div>
    </nav>
  );
}
