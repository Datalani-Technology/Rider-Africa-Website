import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Clock, MapPin, CheckCircle, ShieldCheck, Phone, Star, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Fast & Express Delivery | Rider Africa",
  description: "Urgent same-hour delivery anywhere in Windhoek. When time is critical, Rider Africa's express riders get it there fast.",
};

const features = [
  { Icon: Clock, title: "Same-Hour Delivery", desc: "Priority dispatch ensures your parcel is picked up within minutes and delivered in under 60 minutes." },
  { Icon: MapPin, title: "Real-Time Tracking", desc: "Track your rider live on the app. Know exactly where your delivery is at every moment." },
  { Icon: ShieldCheck, title: "Verified Riders", desc: "Every fast-delivery rider is background-checked, trained, and rated by previous customers." },
  { Icon: Star, title: "Premium Service Level", desc: "Dedicated support, faster response times, and guaranteed pick-up — because your time matters." },
];

const steps = [
  { step: 1, title: "Place Your Request", desc: "Open the app or website, enter pickup and drop-off addresses, and select Fast Delivery." },
  { step: 2, title: "Rider Dispatched", desc: "A nearby verified rider is dispatched immediately — no waiting in queues." },
  { step: 3, title: "Delivered & Confirmed", desc: "You receive a delivery confirmation with photo proof and recipient signature." },
];

export default function FastDeliveryPage() {
  return (
    <>
      <PageHero
        tagline="Express Delivery"
        title="Fast &"
        titleHighlight="Express Delivery"
        subtitle="When every minute counts — same-hour delivery across Windhoek by verified Rider Africa riders."
        gradient="from-[#92400E] via-[#D97706] to-[#F59E0B]"
      />

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <span className="inline-block bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Why Choose Fast Delivery</span>
              <h2 className="text-gray-900 font-black text-3xl sm:text-4xl mb-4">Built for <span className="text-amber-500">Urgency</span></h2>
              <p className="text-gray-500 max-w-xl mx-auto">Our express network is designed for time-sensitive deliveries — documents, medical items, gifts, or anything that cannot wait.</p>
            </div>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(({ Icon, title, desc }, i) => (
              <AnimateOnScroll key={title} delay={i * 0.1}>
                <div className="flex gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all">
                  <div className="w-12 h-12 bg-amber-100 border border-amber-200 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-amber-600" strokeWidth={1.75} />
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

      {/* How It Works */}
      <section className="py-20 bg-[#F4F8FF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <h2 className="text-gray-900 font-black text-3xl mb-3">How It Works</h2>
              <p className="text-gray-500">Three simple steps from request to delivery</p>
            </div>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map(({ step, title, desc }, i) => (
              <AnimateOnScroll key={step} delay={i * 0.12}>
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-amber-500 text-white font-black text-lg rounded-xl flex items-center justify-center mx-auto mb-4">{step}</div>
                  <h3 className="text-gray-900 font-bold mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <div className="mt-10 bg-white rounded-2xl p-6 border border-amber-100 flex flex-col sm:flex-row items-center gap-4">
              <Zap className="w-10 h-10 text-amber-500 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-gray-700 font-bold">Pricing</p>
                <p className="text-gray-500 text-sm">Starting from <strong className="text-amber-600">N$ 80 base rate</strong> + N$ 10/km. Final rate shown before confirmation.</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0 sm:ml-auto" strokeWidth={2} />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0073FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Phone className="w-10 h-10 text-white/60 mx-auto mb-5" strokeWidth={1.5} />
          <h2 className="text-white font-black text-3xl sm:text-4xl mb-4">Need Urgent Delivery Now?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Download the Rider Africa app or contact us directly — our express team is on standby.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="flex items-center justify-center gap-2 bg-white text-[#0073FF] font-black px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors">
              Contact Us <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
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
