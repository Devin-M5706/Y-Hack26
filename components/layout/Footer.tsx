import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 border-t border-[#1F1F1F] bg-[#0E0E0E] font-[var(--font-inter)] text-sm tracking-wide">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="text-lg font-bold text-[#FFB4AA]">handsforhearts</div>
          <div className="text-[#E1E1E1]/50 italic">
            The Vigilant Guardian Network.
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <Link
            href="#"
            className="text-[#E1E1E1]/50 hover:text-[#FFB4AA] hover:underline decoration-[#FFB4AA]/40 transition-all duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-[#E1E1E1]/50 hover:text-[#FFB4AA] hover:underline decoration-[#FFB4AA]/40 transition-all duration-200"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-[#E1E1E1]/50 hover:text-[#FFB4AA] hover:underline decoration-[#FFB4AA]/40 transition-all duration-200"
          >
            Contact Support
          </Link>
          <Link
            href="#"
            className="text-[#E1E1E1]/50 hover:text-[#FFB4AA] hover:underline decoration-[#FFB4AA]/40 transition-all duration-200"
          >
            Global Response Map
          </Link>
        </div>

        <div className="text-[#E1E1E1]/50 text-xs text-center md:text-right">
          © 2024 handsforhearts. The Vigilant Guardian Network.
        </div>
      </div>
    </footer>
  );
}
