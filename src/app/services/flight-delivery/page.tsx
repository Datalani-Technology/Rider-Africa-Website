import type { Metadata } from "next";
import Link from "next/link";
import { Plane, Clock, ShieldCheck, Globe, FileText, Package, Phone, ArrowRight, CheckCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Flight Delivery | Rider Africa",
  description: "Airport-to-door and air cargo delivery services. We handle airline cargo pickup and delivery across Namibia and international destinations.",
};

const features = [
  { Icon: Plane, title: "Air Cargo Management", desc: "We book, dispatch, and track your cargo on scheduled airline flights for the fastest possible long-distance delivery." },
  { Icon: Clock, title: "Next-Flight-Out Priority", desc: "Urgent items sent on the next available flight from Hosea Kutako International or Eros Airport." },
  { Icon: ShieldCheck, title: "Airport-to-Door Service", desc: "We collect cargo from the airport on your behalf and deliver directly to your home or business." },
  { Icon: Globe, title: "Domestic & International", desc: "Flights to Cape Town, Johannesburg, and international hubs for time-critical cargo that cannot wait for road transport." },
  { Icon: FileText, title: "Airway Bill Handling", desc: "We prepare all airway bills, dangerous goods declarations, and customs documentation for international air cargo." },
  { Icon: Package, title: "Fragile & Valuable Cargo", desc: "Specialised packaging and handling for fragile, high-value, or temperature-sensitive items travelling by air." },
];

const steps = [
  { step: 1, title: "Submit Flight Request", desc: "Tell us what you need to send, the destination, urgency level, and any special handling requirements." },
  { step: 2, title: "We Book the Flight", desc: "Our team books cargo space on the appropriate airline, prepares documentation, and arranges airport drop-off." },
  { step: 3, title: "Airport-to-Door Delivery", desc: "On arrival, your cargo is collected from the destination airport and delivered to the final address." },
];

export default function FlightDeliveryPage() {
  return (
    <>
      <PageHero
        tagline="Flight Delivery"
        title="Air Cargo"
        titleHighlight="Delivered Fast"
        subtitle="Airline cargo booking, airport-to-door delivery, and international air freight services — when road transport simply won't do."
        gradient="from-[#7F1D1D] via-[#B91C1C] to-[#EF4444]"
      />
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <span className="inline-block bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Air Freight Services</span>
              <h2 className="text-gray-900 font-black text-3xl sm:text-4xl mb-4">When Speed <span className="text-red-500">Is Everything</span></h2>
              <p className="text-gray-500 max-w-xl mx-auto">For critical cargo that needs to travel hundreds of kilometres overnight — air freight managed by Rider Africa is the answer.</p>
            </div>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ Icon, title, desc }, i) => (
              <AnimateOnScroll key={title} delay={i * 0.08}>
                <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 hover:bg-red-50/30 transition-all h-full">
                  <div className="w-12 h-12 bg-red-100 border border-red-200 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-red-600" strokeWidth={1.75} />
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
              <p className="text-gray-500">From request to airport to your door</p>
            </div>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map(({ step, title, desc }, i) => (
              <AnimateOnScroll key={step} delay={i * 0.12}>
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-red-500 text-white font-black text-lg rounded-xl flex items-center justify-center mx-auto mb-4">{step}</div>
                  <h3 className="text-gray-900 font-bold mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <div className="mt-10 bg-white rounded-2xl p-6 border border-red-100 flex flex-col sm:flex-row items-center gap-4">
              <Plane className="w-10 h-10 text-red-500 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-gray-700 font-bold">Pricing</p>
                <p className="text-gray-500 text-sm">Quoted per shipment based on weight, dimensions, airline, and destination. <strong className="text-red-600">Contact us for a custom air freight quote.</strong></p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0 sm:ml-auto" strokeWidth={2} />
            </div>
          </AnimateOnScroll>
        </div>
      </section>
      <section className="py-20 bg-[#0073FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Phone className="w-10 h-10 text-white/60 mx-auto mb-5" strokeWidth={1.5} />
          <h2 className="text-white font-black text-3xl sm:text-4xl mb-4">Book Air Freight Today</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Contact our logistics team for immediate assistance with air cargo booking and airport delivery.</p>
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
