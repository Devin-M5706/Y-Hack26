import Link from "next/link";
import { Activity, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-emergency" strokeWidth={2.5} />
              <span className="font-bold text-white tracking-tight">
                ER<span className="text-emergency">AC</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Emergency Response Alerts for Cardiac Arrest. Empowering anyone to
              become a first responder.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/60 text-xs uppercase tracking-widest mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              {[
                { label: "How It Works", href: "#how-it-works" },
                { label: "Alert Demo", href: "#alert-demo" },
                { label: "CPR Guide", href: "/cpr-guide" },
                { label: "Why It Matters", href: "#why-it-matters" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-white/40 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white/60 text-xs uppercase tracking-widest mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Use", "Medical Disclaimer"].map(
                (l) => (
                  <li key={l}>
                    <span className="text-white/40 text-sm cursor-default">
                      {l}
                    </span>
                  </li>
                )
              )}
            </ul>
            <p className="text-white/20 text-xs mt-4 leading-relaxed">
              CPR guidance follows American Heart Association guidelines. ERAC
              is a supplementary tool — always call 911.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © 2026 ERAC. Built for Y-Hack26.
          </p>
          <p className="text-white/25 text-xs flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-emergency fill-emergency" /> to save lives
          </p>
        </div>
      </div>
    </footer>
  );
}
