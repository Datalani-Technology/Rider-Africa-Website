import type { Metadata } from "next";
import Link from "next/link";
import { PackageCheck, MapPin, ShieldCheck, Clock, Star, Phone, ArrowRight, CheckCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Local Parcel Delivery | Rider Africa",
  description: "Reliable same-day parcel and package delivery within Windhoek and across Namibia's major cities.",
};

const features = [
  { Icon: PackageCheck, title: "Any Size, Any Weight", desc: "From envelopes to large parcels — our fleet handles documents, gifts, electronics, and business stock." },
  { Icon: Clock, title: "Same-Day Delivery", desc: "Book before noon for guaranteed same-day delivery within the city. Scheduled slots available for businesses." },
  { Icon: ShieldCheck, title: "Insured Handling", desc: "All parcels are handled with care by verified riders. Insurance available for high-value items." },
  { Icon: Star, title: "Business Accounts", desc: "Regular senders enjoy bulk pricing, monthly invoicing, and a dedicated account manager." },
];

const steps = [
  { step: 1, title: "Book a Pickup", desc: "Enter your pickup address, drop-off details, and package description in the app or on our website." },
  { step: 2, title: "Rider Collects", desc: "A verified local rider collects your parcel and provides a digital receipt on the spot." },
  { step: 3, title: "Delivered Safely", desc: "Recipient receives the parcel with delivery confirmation sent to you via SMS and email." },
];

export default function LocalParcelPage() {
  return (
    <>
      <PageHero
        tagline="Local Parcel Delivery"
        title="Deliver Anywhere"
        titleHighlight="In the City"
        subtitle="Fast, reliable parcel delivery within Windhoek and other Namibian cities — from documents to large packages."
        gradient="from-[#001A6E] via-[#003EA6] to-[#0073FF]"
      />
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <span className="inline-block bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Local Delivery Benefits</span>
              <h2 className="text-gray-900 font-black text-3xl sm:text-4xl mb-4">Namibia&apos;s <span className="text-[#0073FF]">Most Trusted</span> Local Courier</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Whether you&apos;re a business sending daily orders or an individual mailing a gift — we make local delivery effortless.</p>
            </div>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(({ Icon, title, desc }, i) => (
              <AnimateOnScroll key={title} delay={i * 0.1}>
                <div className="flex gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all">
                  <div className="w-12 h-12 bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" strokeWidth={1.75} />
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
              <p className="text-gray-500">Book, collect, deliver — simple as that</p>
            </div>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map(({ step, title, desc }, i) => (
              <AnimateOnScroll key={step} delay={i * 0.12}>
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-[#0073FF] text-white font-black text-lg rounded-xl flex items-center justify-center mx-auto mb-4">{step}</div>
                  <h3 className="text-gray-900 font-bold mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <div className="mt-10 bg-white rounded-2xl p-6 border border-blue-100 flex flex-col sm:flex-row items-center gap-4">
              <MapPin className="w-10 h-10 text-[#0073FF] shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-gray-700 font-bold">Pricing</p>
                <p className="text-gray-500 text-sm">Starting from <strong className="text-[#0073FF]">N$ 50 base rate</strong> + N$ 8/km. Business bulk rates available on request.</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0 sm:ml-auto" strokeWidth={2} />
            </div>
          </AnimateOnScroll>
        </div>
      </section>
      <section className="py-20 bg-[#0073FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Phone className="w-10 h-10 text-white/60 mx-auto mb-5" strokeWidth={1.5} />
          <h2 className="text-white font-black text-3xl sm:text-4xl mb-4">Ready to Send a Parcel?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Download the app or contact us to set up a business account with bulk pricing.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="flex items-center justify-center gap-2 bg-white text-[#0073FF] font-black px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors">
              Get Started <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
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
