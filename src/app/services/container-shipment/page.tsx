import type { Metadata } from "next";
import Link from "next/link";
import { Box, Truck, ShieldCheck, FileText, Globe, Phone, ArrowRight, CheckCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Container Shipment | Rider Africa",
  description: "Full and partial container shipment services for large cargo moving within Namibia and across borders.",
};

const features = [
  { Icon: Box, title: "FCL & LCL Options", desc: "Full Container Load (FCL) or Less than Container Load (LCL) — we have the right solution for your cargo volume." },
  { Icon: Truck, title: "Heavy Cargo Specialists", desc: "Industrial equipment, furniture, building materials, and bulk goods transported safely with experienced handlers." },
  { Icon: ShieldCheck, title: "Comprehensive Insurance", desc: "All container shipments are covered by cargo insurance from origin to final delivery destination." },
  { Icon: FileText, title: "Full Documentation", desc: "We manage all shipping documents, customs declarations, and permits required for domestic and cross-border shipments." },
  { Icon: Globe, title: "Port-to-Door Service", desc: "From Walvis Bay Port to any address in Namibia or SADC — we handle the entire logistics chain." },
  { Icon: Truck, title: "Specialised Equipment", desc: "Flatbeds, low-loaders, and refrigerated containers available for specialised cargo requirements." },
];

const steps = [
  { step: 1, title: "Submit Cargo Details", desc: "Tell us about your cargo — dimensions, weight, nature of goods, origin, and destination. We provide a detailed quote." },
  { step: 2, title: "Logistics Planning", desc: "Our team plans the optimal route, arranges container booking, and handles all customs documentation." },
  { step: 3, title: "Pickup to Delivery", desc: "Cargo is collected, loaded, transported, cleared through customs, and delivered to the final destination with full tracking." },
];

export default function ContainerShipmentPage() {
  return (
    <>
      <PageHero
        tagline="Container Shipment"
        title="Move Large"
        titleHighlight="Cargo Safely"
        subtitle="Full and partial container shipment services for businesses and individuals moving large cargo within Namibia and across borders."
        gradient="from-[#4C1D95] via-[#6D28D9] to-[#8B5CF6]"
      />
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <span className="inline-block bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Container Services</span>
              <h2 className="text-gray-900 font-black text-3xl sm:text-4xl mb-4">Large Cargo, <span className="text-violet-600">Professional Handling</span></h2>
              <p className="text-gray-500 max-w-xl mx-auto">From single pallets to full containers — Rider Africa&apos;s logistics team manages every aspect of your large-scale cargo movement.</p>
            </div>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ Icon, title, desc }, i) => (
              <AnimateOnScroll key={title} delay={i * 0.08}>
                <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all h-full">
                  <div className="w-12 h-12 bg-violet-100 border border-violet-200 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-violet-600" strokeWidth={1.75} />
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
              <p className="text-gray-500">End-to-end container shipment management</p>
            </div>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map(({ step, title, desc }, i) => (
              <AnimateOnScroll key={step} delay={i * 0.12}>
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-violet-600 text-white font-black text-lg rounded-xl flex items-center justify-center mx-auto mb-4">{step}</div>
                  <h3 className="text-gray-900 font-bold mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <div className="mt-10 bg-white rounded-2xl p-6 border border-violet-100 flex flex-col sm:flex-row items-center gap-4">
              <Box className="w-10 h-10 text-violet-600 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-gray-700 font-bold">Pricing</p>
                <p className="text-gray-500 text-sm">Quoted per shipment based on container size, cargo type, distance, and customs requirements. <strong className="text-violet-600">Contact us for a custom quote.</strong></p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0 sm:ml-auto" strokeWidth={2} />
            </div>
          </AnimateOnScroll>
        </div>
      </section>
      <section className="py-20 bg-[#0073FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Phone className="w-10 h-10 text-white/60 mx-auto mb-5" strokeWidth={1.5} />
          <h2 className="text-white font-black text-3xl sm:text-4xl mb-4">Get a Container Shipment Quote</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Our logistics team will assess your requirements and provide a detailed, competitive quote.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="flex items-center justify-center gap-2 bg-white text-[#0073FF] font-black px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors">
              Request Quote <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
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
