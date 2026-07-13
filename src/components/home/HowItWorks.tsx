"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Smartphone, LayoutGrid, MapPin, PackageCheck } from "lucide-react";

const steps = [
  { Icon: Smartphone, step: "01", title: "Download the App", description: "Get Rider Africa free on the App Store or Google Play." },
  { Icon: LayoutGrid, step: "02", title: "Choose a Service", description: "Pick delivery, transport, grocery, or valuables." },
  { Icon: MapPin, step: "03", title: "Get Matched", description: "Instantly matched with the nearest verified driver." },
  { Icon: PackageCheck, step: "04", title: "Track & Receive", description: "Real-time tracking — delivered safe to your door." },
];

function StepCard({ s, i }: { s: (typeof steps)[number]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ y: 30 }}
      animate={inView ? { y: 0 } : { y: 30 }}
      transition={{ duration: 0.55, delay: i * 0.15 }}
      className="relative z-10 flex flex-col items-center text-center"
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0073FF] to-[#003EA6] flex items-center justify-center mb-4 shadow-[0_8px_24px_rgba(0,115,255,0.35)]"
        whileHover={{ scale: 1.12, rotate: 6 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <s.Icon className="w-9 h-9 text-white" strokeWidth={1.5} />
      </motion.div>
      <span className="text-[#0073FF] font-black text-sm mb-1 tracking-wider">{s.step}</span>
      <h3 className="text-lg font-black text-gray-900 mb-2">{s.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{s.description}</p>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#0073FF] font-semibold text-sm uppercase tracking-widest">Simple Process</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3 mb-4">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">From download to delivery — four simple steps.</p>
        </motion.div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-10 left-[13%] right-[13%] h-px bg-gradient-to-r from-transparent via-[#0073FF]/30 to-transparent z-0" />

          {steps.map((s, i) => <StepCard key={s.step} s={s} i={i} />)}
        </div>
      </div>
    </section>
  );
}
