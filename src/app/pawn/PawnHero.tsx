"use client";
import { motion } from "framer-motion";
import { Home, Car, Clock, Shield, TrendingUp, CheckCircle2, ArrowRight, Gem } from "lucide-react";

// ── Update these image URLs anytime to change the hero visuals ──────────────
const PROPERTY_IMG = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&h=700&fit=crop&auto=format&q=88";
const VEHICLE_IMG  = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&h=700&fit=crop&auto=format&q=88";

function scrollToForm(tab: "property" | "vehicle") {
  const el = document.getElementById("pawn-form");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  // Brief delay to let the tab selector receive the click
  setTimeout(() => {
    const btn = document.querySelector<HTMLButtonElement>(`[data-pawn-tab="${tab}"]`);
    btn?.click();
  }, 400);
}

export default function PawnHero() {
  return (
    <section className="pawn-hero relative bg-[#090E1A] overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-20 left-[-60px] w-[500px] h-[500px] bg-[#0073FF]/8 rounded-full blur-[100px] pointer-events-none animate-blob" />
      <div className="absolute bottom-0 right-[-60px] w-[400px] h-[400px] bg-amber-500/6 rounded-full blur-[100px] pointer-events-none" style={{ animationDelay: "3s" }} />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "56px 56px" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-black px-5 py-2 rounded-full uppercase tracking-widest">
            <Gem className="w-3.5 h-3.5" strokeWidth={2} />
            Rider Pawn Shop — Namibia
          </span>
        </div>

        {/* Headline */}
        <motion.div
          className="pawn-intro text-center mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-white font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-5">
            Turn Your Assets<br />
            <span className="gradient-text">Into Instant Cash</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Professional property and vehicle valuations across Namibia.
            Fast, confidential, and fair — our team responds within <strong className="text-white">24–48 hours</strong>.
          </p>
        </motion.div>

        {/* Trust pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {[
            { Icon: Clock,       text: "24–48h Response" },
            { Icon: Shield,      text: "100% Confidential" },
            { Icon: TrendingUp,  text: "Competitive Rates" },
            { Icon: CheckCircle2, text: "Professional Valuation" },
          ].map(({ Icon, text }) => (
            <span key={text} className="flex items-center gap-2 bg-white/5 border border-white/8 text-gray-300 text-sm font-semibold px-4 py-2 rounded-full">
              <Icon className="w-4 h-4 text-amber-400" strokeWidth={2} />
              {text}
            </span>
          ))}
        </motion.div>

        {/* ── Two hero image cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-5xl mx-auto mb-16">

          {/* Property card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden cursor-pointer group"
            style={{ height: "400px" }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.65, ease: "easeOut" }}
            onClick={() => scrollToForm("property")}
          >
            <img
              src={PROPERTY_IMG}
              alt="Property Pawn"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-500/40 rounded-3xl transition-colors duration-300" />

            {/* Floating value badge */}
            <motion.div
              className="absolute top-5 right-5 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-0.5">Valuation Up To</p>
              <p className="text-white font-black text-xl">N$ 5 Million</p>
            </motion.div>

            {/* Verified ribbon */}
            <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-400 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} /> Verified Process
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Property Pawn</span>
              </div>
              <h3 className="text-white font-black text-2xl leading-tight mb-1">Pawn Your Property</h3>
              <p className="text-white/55 text-sm mb-5">Houses · Land · Apartments · Commercial</p>
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm group-hover:gap-3 transition-all">
                Submit Application <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </div>
          </motion.div>

          {/* Vehicle card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden cursor-pointer group"
            style={{ height: "400px" }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.65, ease: "easeOut" }}
            onClick={() => scrollToForm("vehicle")}
          >
            <img
              src={VEHICLE_IMG}
              alt="Vehicle Pawn"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-500/40 rounded-3xl transition-colors duration-300" />

            {/* Floating value badge */}
            <motion.div
              className="absolute top-5 right-5 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.75 }}
            >
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-0.5">Valuation Up To</p>
              <p className="text-white font-black text-xl">N$ 500,000</p>
            </motion.div>

            {/* Verified ribbon */}
            <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-400 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} /> Verified Process
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Car className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Vehicle Pawn</span>
              </div>
              <h3 className="text-white font-black text-2xl leading-tight mb-1">Pawn Your Vehicle</h3>
              <p className="text-white/55 text-sm mb-5">Cars · SUVs · Trucks · Motorcycles</p>
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm group-hover:gap-3 transition-all">
                Submit Application <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* How it works */}
        <motion.div
          className="pawn-steps grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {[
            { n: "1", title: "Submit Your Details", desc: "Fill in your asset details and upload the required documents online." },
            { n: "2", title: "Get Professionally Evaluated", desc: "Our valuation team reviews your submission and contacts you within 24–48 hours." },
            { n: "3", title: "Receive Your Offer", desc: "Accept our competitive, no-obligation offer and receive your funds quickly." },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              className="pawn-step text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.1, duration: 0.5 }}
            >
              <div className="w-11 h-11 bg-amber-500 text-white font-black text-lg rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/30">
                {s.n}
              </div>
              <p className="text-white font-bold text-sm mb-2">{s.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Arrow pointing down to form */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => document.getElementById("pawn-form")?.scrollIntoView({ behavior: "smooth" })}
            className="pawn-application-cta flex items-center gap-3 transition-all"
          >
            <span className="text-sm font-black uppercase tracking-wider">Start Your Application</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-8 h-8 rounded-full flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4 rotate-90" strokeWidth={2} />
            </motion.div>
          </button>
        </div>

      </div>
    </section>
  );
}
