import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AlertDemo from "@/components/sections/AlertDemo";
import ClientParticleField from "@/components/three/ClientParticleField";
import ClientFloatingMedical from "@/components/three/ClientFloatingMedical";

function StatsBar() {
  return (
    <section className="relative py-16 border-y border-[#222]/60">
      <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { value: "240", unit: "ms", label: "Alert Latency" },
          { value: "14.2", unit: "k", label: "Active Responders" },
          { value: "142", unit: "+", label: "Metro Areas" },
          { value: "4.7", unit: "min", label: "Avg Response Time" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-4xl md:text-5xl font-['Newsreader'] text-[#e2e2e2] mb-1">
              {stat.value}
              <span className="text-lg text-[#FF5545]">{stat.unit}</span>
            </div>
            <div className="text-xs uppercase tracking-widest text-[#e4bebc]/60">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MissionGridSection() {
  return (
    <section className="relative py-24 px-8 max-w-7xl mx-auto">
      {/* Floating medical elements behind the grid */}
      <ClientFloatingMedical />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Large Feature - Core Mission */}
        <div className="md:col-span-8 group relative h-[500px] rounded-2xl overflow-hidden bg-[#1F1F1F] border border-[#2a2a2a]/50">
          <img
            alt="Life Saving"
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5sm0LmiF_vkqNs2s18MByFJbtJLNre82GY9KMmL8DS9HOK6qPgkaKUwUahzTD5iC7fwQtwGVWN_iVxVqiHwk3OH_nwlzl6z8dOcwpgHUkZ7_UPoSAwWoNbT4gl2Q0NTCNUM_Da8bID0pRjenmoYkWhN_eFz12rBBL3KXy1ly2a2U0B-jiT-i_Bf-A1sPUUyLaf3SNL1FET_eXiIsXX8lUUNKnXvo5QzZ7CFsOAk8yua0ROCK8RRvLpsjet-1wxdECsVkOu3159Z-4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-10">
            <span className="text-[#FFB4AA] font-bold tracking-widest uppercase text-xs mb-4 block">
              The Core Mission
            </span>
            <h3 className="text-4xl text-[#e2e2e2] mb-4 italic font-['Newsreader']">
              Minutes save lives. We save minutes.
            </h3>
            <p className="text-[#e4bebc] max-w-md">
              Our algorithm identifies the nearest qualified responder within
              seconds of a cardiac event, bridging the gap until professional
              services arrive.
            </p>
          </div>
        </div>

        {/* Secondary Metric - Alert Latency */}
        <div className="md:col-span-4 rounded-2xl bg-[#1A1A1A] p-8 flex flex-col justify-between border border-[#2a2a2a]/50 group hover:border-[#E8192C]/20 transition-colors duration-500">
          <div className="w-12 h-12 rounded-xl bg-[#E8192C]/10 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E8192C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <div>
            <h4 className="text-5xl text-[#e2e2e2] mb-2 font-['Newsreader']">
              240<span className="text-2xl text-[#FF5545]">ms</span>
            </h4>
            <p className="text-[#e4bebc] text-sm uppercase tracking-widest">
              Average Alert Latency
            </p>
          </div>
          <p className="text-[#e4bebc] text-sm mt-6 italic font-['Newsreader']">
            Optimized for high-stress environments where every millisecond
            counts toward a second chance.
          </p>
        </div>

        {/* Map Integration Teaser - Global Guardian Map */}
        <div className="md:col-span-4 rounded-2xl bg-[#1A1A1A] p-8 flex flex-col justify-center border border-[#2a2a2a]/50 group hover:border-[#53E16F]/20 transition-colors duration-500">
          <div className="w-12 h-12 rounded-xl bg-[#53E16F]/10 flex items-center justify-center mb-6">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#53E16F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <h4 className="text-2xl text-[#e2e2e2] mb-2 italic font-['Newsreader']">
            Global Guardian Map
          </h4>
          <p className="text-[#e4bebc] text-sm mb-6">
            Visualizing our network&apos;s reach across 142 metropolitan areas
            worldwide.
          </p>
          <button className="text-[#53E16F] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all cursor-pointer">
            View Live Map <span className="text-sm">→</span>
          </button>
        </div>

        {/* Community Card - Join Volunteers */}
        <div className="md:col-span-8 relative h-[300px] rounded-2xl overflow-hidden backdrop-blur-[20px] bg-[rgba(26,26,26,0.8)] border border-[#2a2a2a]/50 group hover:border-[#FFB4AA]/15 transition-colors duration-500">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          {/* Subtle particle network inside the card */}
          <div className="absolute inset-0 opacity-30">
            <ClientParticleField nodeCount={30} />
          </div>

          <div className="relative h-full flex items-center px-10 z-10">
            <div className="max-w-lg">
              <h3 className="text-3xl text-[#e2e2e2] mb-4 italic font-['Newsreader']">
                Join 50k+ Volunteers
              </h3>
              <p className="text-[#e4bebc] mb-6">
                Whether you&apos;re a doctor, a nurse, or CPR-certified citizen,
                your presence in our network creates a safety net for your
                community.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[
                    "bg-[#E8192C]/30",
                    "bg-[#FF5545]/30",
                    "bg-[#FFB4AA]/30",
                    "bg-[#53E16F]/30",
                  ].map((bg, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full border-2 border-[#131313] ${bg} flex items-center justify-center`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-[#e2e2e2]/60"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  ))}
                </div>
                <span className="text-[#e4bebc]/60 text-sm font-bold">
                  +52,000 responders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VariantCTASection() {
  return (
    <section className="relative py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-[#FFB4AA]/50 to-transparent" />
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-5xl text-[#e2e2e2] mb-8 italic font-['Newsreader']">
          Ready to be the guardian someone needs?
        </h2>
        <div className="p-[1px] rounded-2xl bg-gradient-to-r from-[#FFB4AA]/20 via-[#FF5545]/20 to-[#FFB4AA]/20">
          <div className="bg-[#131313] rounded-2xl p-12 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(232,25,44,0.04)_0%,transparent_70%)]" />

            <div className="relative z-10">
              <form className="max-w-md mx-auto mb-6">
                <label htmlFor="waitlist-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="waitlist-email"
                  name="email"
                  type="email"
                  required
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  className="w-full px-5 py-4 rounded-xl bg-[rgba(53,53,53,0.6)] border border-[#5B403F]/30 text-[#e2e2e2] placeholder:text-[#e4bebc]/50 focus:outline-none focus:ring-2 focus:ring-[#FFB4AA]/40 transition-all duration-200"
                />
              </form>
              <button className="px-12 py-6 bg-[#FFB4AA] text-[#690003] rounded-xl font-bold text-2xl shadow-[0_0_50px_rgba(255,180,170,0.2)] hover:scale-105 hover:shadow-[0_0_60px_rgba(255,180,170,0.3)] transition-all duration-300 cursor-pointer">
                Join Waitlist
              </button>
              <p className="mt-8 text-[#e4bebc]/60 text-sm italic font-['Newsreader']">
                Secure. Instant. Lifesaving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#131313] text-[#e2e2e2] overflow-x-hidden">
      <Navbar />
      <Hero />
      <StatsBar />
      <MissionGridSection />
      <AlertDemo />
      <VariantCTASection />
      <Footer />
    </main>
  );
}
