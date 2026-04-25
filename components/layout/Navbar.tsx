"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-[#5B403F]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
      <nav className="flex items-center justify-between px-8 py-4 w-full">
        <Link
          href="/"
          className="text-2xl font-semibold text-[#FFB4AA] italic font-['Newsreader'] tracking-tight"
        >
          handsforhearts
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#how-it-works"
            className="text-[#E1E1E1]/70 hover:text-[#FFB4AA] transition-colors font-['Newsreader'] italic"
          >
            How It Works
          </a>
          <Link
            href="/cpr-guide"
            className="text-[#E1E1E1]/70 hover:text-[#FFB4AA] transition-colors font-['Newsreader'] italic"
          >
            CPR Guide
          </Link>
          <a
            href="#why-it-matters"
            className="text-[#E1E1E1]/70 hover:text-[#FFB4AA] transition-colors font-['Newsreader'] italic"
          >
            Why It Matters
          </a>
        </div>

        <button className="bg-[#FF5545] text-[#410001] px-6 py-2.5 rounded-lg font-bold hover:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,85,69,0.3)]">
          Join Waitlist
        </button>
      </nav>
    </header>
  );
}
