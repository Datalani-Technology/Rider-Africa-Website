import type { Metadata } from "next";
import Link from "next/link";
import { Globe, FileText, ShieldCheck, Clock, Package, Phone, ArrowRight, CheckCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "International Parcel Delivery | Rider Africa",
  description: "Cross-border parcel and document delivery from Namibia to South Africa and beyond. Customs-cleared and fully tracked.",
};

const features = [
  { Icon: Globe, title: "Cross-Border Delivery", desc: "We deliver to South Africa, Botswana, Zimbabwe, Zambia, and other SADC countries with customs documentation handled." },
  { Icon: FileText, title: "Customs Assistance", desc: "Our experienced customs agents handle all paperwork, permits, and clearance documentation for smooth cross-border delivery." },
  { Icon: ShieldCheck, title: "Fully Insured", desc: "All international parcels are insured against loss or damage from pickup to final delivery." },
  { Icon: Clock, title: "Tracked End-to-End", desc: "Real-time tracking updates from Namibia to the final destination country — no guessing." },
];

const steps = [
  { step: 1, title: "Submit Parcel Details", desc: "Provide item descriptions, destination country, recipient details, and any customs documentation you have." },
  { step: 2, title: "We Handle Customs", desc: "Our customs team prepares all required documentation, duties assessment, and border clearance." },
  { step: 3, title: "Cross-Border Delivery", desc: "Your parcel is delivered to the recipient in the destination country with full tracking." },
];

/* Animated illustration — pure CSS, works in server components */
const HeroVisual = (
  <div className="relative w-[340px] h-[340px] flex items-center justify-center select-none">

    {/* Outer slow-spin ring */}
    <div className="absolute w-[320px] h-[320px] rounded-full border border-white/10 animate-spin-slow" />
    {/* Inner counter-spin dashed ring */}
    <div
      className="absolute w-56 h-56 rounded-full border-2 border-dashed border-white/15 animate-spin-slow"
      style={{ animationDirection: "reverse", animationDuration: "14s" }}
    />

    {/* Centre globe */}
    <div className="relative w-28 h-28 bg-white/10 backdrop-blur-sm rounded-full border border-white/25 flex items-center justify-center animate-float">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/20 to-transparent" />
      <Globe className="w-14 h-14 text-white" strokeWidth={1} />
    </div>

    {/* 4 orbiting icon squares */}
    {/* Top — Package */}
    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/15 rounded-xl border border-white/25 flex items-center justify-center animate-float2">
      <Package className="w-6 h-6 text-white" strokeWidth={1.5} />
    </div>
    {/* Right — ShieldCheck */}
    <div
      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/12 rounded-xl border border-white/20 flex items-center justify-center animate-float"
      style={{ animationDelay: "1.5s" }}
    >
      <ShieldCheck className="w-5 h-5 text-white" strokeWidth={1.5} />
    </div>
    {/* Bottom — FileText */}
    <div
      className="absolute bottom-3 left-1/2 -translate-x-1/2 w-11 h-11 bg-white/12 rounded-xl border border-white/20 flex items-center justify-center animate-float2"
      style={{ animationDelay: "1s" }}
    >
      <FileText className="w-5 h-5 text-white" strokeWidth={1.5} />
    </div>
    {/* Left — Clock */}
    <div
      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/12 rounded-xl border border-white/20 flex items-center justify-center animate-float"
      style={{ animationDelay: "2s" }}
    >
      <Clock className="w-5 h-5 text-white" strokeWidth={1.5} />
    </div>

    {/* Diagonal floating mini-packages */}
    <div
      className="absolute top-12 right-12 w-9 h-9 bg-emerald-500/25 rounded-xl border border-emerald-400/35 flex items-center justify-center animate-float2"
      style={{ animationDelay: "0.6s" }}
    >
      <Package className="w-4 h-4 text-emerald-300" strokeWidth={1.75} />
    </div>
    <div
      className="absolute bottom-12 left-12 w-9 h-9 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-center animate-float"
      style={{ animationDelay: "2.8s" }}
    >
      <Package className="w-4 h-4 text-emerald-300" strokeWidth={1.75} />
    </div>

    {/* Glow behind globe */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-44 h-44 bg-emerald-400/10 rounded-full blur-3xl" />
    </div>

    {/* Route dots arc */}
    {[0, 45, 90, 135, 180].map(angle => (
      <div
        key={angle}
        className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/40"
        style={{
          top: `${50 - 42 * Math.sin((angle * Math.PI) / 180)}%`,
          left: `${50 + 42 * Math.cos((angle * Math.PI) / 180)}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
    ))}
  </div>
);

export default function InternationalParcelPage() {
  return (
    <>
      <PageHero
        tagline="International Parcel Delivery"
        title="Beyond"
        titleHighlight="Borders"
        subtitle="Cross-border parcel and document delivery from Namibia to South Africa and across the SADC region — customs-cleared and fully tracked."
        gradient="from-[#064E3B] via-[#065F46] to-[#10B981]"
        rightContent={HeroVisual}
      />

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">International Service</span>
              <h2 className="text-gray-900 font-black text-3xl sm:text-4xl mb-4">Delivering <span className="text-emerald-600">Across Africa</span></h2>
              <p className="text-gray-500 max-w-xl mx-auto">From personal parcels to business shipments — we handle everything from pickup in Namibia to delivery in the destination country.</p>
            </div>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(({ Icon, title, desc }, i) => (
              <AnimateOnScroll key={title} delay={i * 0.1}>
                <div className="flex gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all">
                  <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-600" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold mb-1">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F4F8FF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <h2 className="text-gray-900 font-black text-3xl mb-3">How It Works</h2>
              <p className="text-gray-500">End-to-end international parcel management</p>
            </div>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map(({ step, title, desc }, i) => (
              <AnimateOnScroll key={step} delay={i * 0.12}>
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-emerald-500 text-white font-black text-lg rounded-xl flex items-center justify-center mx-auto mb-4">{step}</div>
                  <h3 className="text-gray-900 font-bold mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <div className="mt-10 bg-white rounded-2xl p-6 border border-emerald-100 flex flex-col sm:flex-row items-center gap-4">
              <Package className="w-10 h-10 text-emerald-500 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-gray-700 font-bold">Pricing</p>
                <p className="text-gray-500 text-sm">Starting from <strong className="text-emerald-600">N$ 500 base rate</strong> + N$ 20/km. Final price depends on weight, destination, and customs fees.</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0 sm:ml-auto" strokeWidth={2} />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="py-20 bg-[#0073FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Phone className="w-10 h-10 text-white/60 mx-auto mb-5" strokeWidth={1.5} />
          <h2 className="text-white font-black text-3xl sm:text-4xl mb-4">Ship Internationally Today</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Contact our team for a custom international shipping quote and customs assistance.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="flex items-center justify-center gap-2 bg-white text-[#0073FF] font-black px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors">
              Get a Quote <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link href="/services" className="flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              All Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
