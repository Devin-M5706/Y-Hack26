import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AlertDemo from "@/components/sections/AlertDemo";

function MissionGridSection() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Large Feature - Core Mission */}
        <div className="md:col-span-8 group relative h-[500px] rounded-2xl overflow-hidden bg-[#1F1F1F]">
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
        <div className="md:col-span-4 rounded-2xl bg-[#2A2A2A] p-8 flex flex-col justify-between border-l-2 border-[#FFB4AA]">
          <span className="text-[#FFB4AA] text-4xl">❤</span>
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
        <div className="md:col-span-4 rounded-2xl bg-[#1F1F1F] p-8 flex flex-col justify-center border border-[#5B403F]/10">
          <div className="w-16 h-16 rounded-full bg-[#53E16F]/10 flex items-center justify-center mb-6">
            <span className="text-[#53E16F] text-3xl">•</span>
          </div>
          <h4 className="text-2xl text-[#e2e2e2] mb-2 italic font-['Newsreader']">
            Global Guardian Map
          </h4>
          <p className="text-[#e4bebc] text-sm mb-6">
            Visualizing our network&apos;s reach across 142 metropolitan areas
            worldwide.
          </p>
          <button className="text-[#53E16F] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
            View Live Map <span className="text-sm">→</span>
          </button>
        </div>

        {/* Community Card - Join Volunteers */}
        <div className="md:col-span-8 relative h-[300px] rounded-2xl overflow-hidden backdrop-blur-[20px] bg-[rgba(53,53,53,0.6)] border-t border-[rgba(228,190,188,0.1)] group">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative h-full flex items-center px-10">
            <div className="max-w-lg">
              <h3 className="text-3xl text-[#e2e2e2] mb-4 italic font-['Newsreader']">
                Join 50k+ Volunteers
              </h3>
              <p className="text-[#e4bebc] mb-6">
                Whether you&apos;re a doctor, a nurse, or CPR-certified citizen,
                your presence in our network creates a safety net for your
                community.
              </p>
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full border-2 border-[#131313] bg-[#393939] flex items-center justify-center text-[10px] font-bold text-[#e2e2e2]">
                  +52k
                </div>
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
    <section className="py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-[#FFB4AA]/50 to-transparent" />
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-5xl text-[#e2e2e2] mb-8 italic font-['Newsreader']">
          Ready to be the guardian someone needs?
        </h2>
        <div className="p-1 rounded-2xl bg-gradient-to-r from-[#FFB4AA]/20 via-[#FF5545]/20 to-[#FFB4AA]/20">
          <div className="bg-[#131313] rounded-[14px] p-12">
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
                className="w-full px-5 py-4 rounded-xl bg-[rgba(53,53,53,0.6)] border border-[#5B403F]/30 text-[#e2e2e2] placeholder:text-[#e4bebc]/50 focus:outline-none focus:ring-2 focus:ring-[#FFB4AA]/40"
              />
            </form>
            <button className="px-12 py-6 bg-[#FFB4AA] text-[#690003] rounded-xl font-bold text-2xl shadow-[0_0_50px_rgba(255,180,170,0.2)] hover:scale-105 hover:shadow-[0_0_60px_rgba(255,180,170,0.3)] transition-all duration-300">
              Join Waitlist
            </button>
            <p className="mt-8 text-[#e4bebc]/60 text-sm italic font-['Newsreader']">
              Secure. Instant. Lifesaving.
            </p>
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
      <MissionGridSection />
      <AlertDemo />
      <VariantCTASection />
      <Footer />
    </main>
  );
}
