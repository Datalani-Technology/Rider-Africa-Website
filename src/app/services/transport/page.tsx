import type { Metadata } from "next";
import Link from "next/link";
import { Car, Star, ShieldCheck, Clock, MapPin, Phone, ArrowRight, CheckCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Passenger Transport | Rider Africa",
  description: "Safe, affordable, and professional passenger transport across Windhoek and Namibia. Book a ride on demand or schedule in advance.",
};

const features = [
  { Icon: Car, title: "Multiple Vehicle Types", desc: "Choose from motorcycle taxis, sedans, SUVs, and vans depending on your group size and preference." },
  { Icon: Star, title: "Rated & Verified Drivers", desc: "All drivers are background-verified, licensed, and continuously rated by passengers for your peace of mind." },
  { Icon: ShieldCheck, title: "Passenger Safety First", desc: "GPS tracking, SOS button in the app, and 24/7 monitoring ensure every trip is safe and accountable." },
  { Icon: Clock, title: "On-Demand or Scheduled", desc: "Need a ride now? Book instantly. Important appointment? Schedule up to 7 days in advance." },
];

const steps = [
  { step: 1, title: "Enter Your Destination", desc: "Open the Rider Africa app, enter where you are and where you need to go, and view your fare estimate." },
  { step: 2, title: "Your Driver Arrives", desc: "A verified driver is dispatched to your location. Track their arrival in real-time on the map." },
  { step: 3, title: "Reach Your Destination", desc: "Arrive safely. Pay in-app or in cash. Rate your driver to help maintain service quality." },
];

export default function TransportPage() {
  return (
    <>
      <PageHero
        tagline="Passenger Transport"
        title="Your Ride,"
        titleHighlight="Your Way"
        subtitle="On-demand and scheduled passenger transport by verified Rider Africa drivers — safe, affordable, and always on time."
        gradient="from-[#0E7490] via-[#0284C7] to-[#0073FF]"
      />
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <span className="inline-block bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Why Ride with Us</span>
              <h2 className="text-gray-900 font-black text-3xl sm:text-4xl mb-4">Comfortable Rides, <span className="text-sky-600">Trusted Drivers</span></h2>
              <p className="text-gray-500 max-w-xl mx-auto">Whether you&apos;re commuting to work, heading to the airport, or exploring Namibia — Rider Africa connects you to a safe ride.</p>
            </div>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(({ Icon, title, desc }, i) => (
              <AnimateOnScroll key={title} delay={i * 0.1}>
                <div className="flex gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-sky-200 hover:bg-sky-50/40 transition-all">
                  <div className="w-12 h-12 bg-sky-100 border border-sky-200 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-sky-600" strokeWidth={1.75} />
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
              <p className="text-gray-500">Booking a ride takes less than 30 seconds</p>
            </div>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map(({ step, title, desc }, i) => (
              <AnimateOnScroll key={step} delay={i * 0.12}>
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-sky-500 text-white font-black text-lg rounded-xl flex items-center justify-center mx-auto mb-4">{step}</div>
                  <h3 className="text-gray-900 font-bold mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <div className="mt-10 bg-white rounded-2xl p-6 border border-sky-100 flex flex-col sm:flex-row items-center gap-4">
              <MapPin className="w-10 h-10 text-sky-500 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-gray-700 font-bold">Pricing</p>
                <p className="text-gray-500 text-sm">Starting from <strong className="text-sky-600">N$ 40 base rate</strong> + N$ 10/km. View exact fare in the app before confirming.</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0 sm:ml-auto" strokeWidth={2} />
            </div>
          </AnimateOnScroll>
        </div>
      </section>
      <section className="py-20 bg-[#0073FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Phone className="w-10 h-10 text-white/60 mx-auto mb-5" strokeWidth={1.5} />
          <h2 className="text-white font-black text-3xl sm:text-4xl mb-4">Book Your First Ride</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Download the Rider Africa app and get your first ride. Safe, affordable, and always on time.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="flex items-center justify-center gap-2 bg-white text-[#0073FF] font-black px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors">
              Get in Touch <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
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
