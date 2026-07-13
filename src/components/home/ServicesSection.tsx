"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  PackageCheck, Car, Globe, Box, Plane, Zap, ShoppingBag, Gem, ArrowRight,
} from "lucide-react";

const services = [
  {
    Icon: PackageCheck,
    title: "Local Parcel Delivery",
    description: "Same-day parcel delivery within Windhoek and major Namibian cities.",
    gradient: "from-[#0073FF] to-[#003EA6]",
    glow: "rgba(0,115,255,0.20)",
    href: "/services/local-parcel",
    badge: "",
  },
  {
    Icon: Car,
    title: "Rider Transportation",
    description: "Safe, affordable passenger transport on demand or scheduled in advance.",
    gradient: "from-[#0E7490] to-[#0073FF]",
    glow: "rgba(14,116,144,0.20)",
    href: "/services/transport",
    badge: "",
  },
  {
    Icon: Globe,
    title: "International Parcel",
    description: "Cross-border delivery to South Africa and across the SADC region.",
    gradient: "from-[#059669] to-[#10B981]",
    glow: "rgba(5,150,105,0.20)",
    href: "/services/international-parcel",
    badge: "",
  },
  {
    Icon: Box,
    title: "Container Shipments",
    description: "FCL and LCL container logistics for large cargo, port-to-door.",
    gradient: "from-[#6D28D9] to-[#8B5CF6]",
    glow: "rgba(109,40,217,0.20)",
    href: "/services/container-shipment",
    badge: "",
  },
  {
    Icon: Plane,
    title: "Flight Delivery",
    description: "Air cargo and airport-to-door service for time-critical shipments.",
    gradient: "from-[#B91C1C] to-[#EF4444]",
    glow: "rgba(185,28,28,0.20)",
    href: "/services/flight-delivery",
    badge: "",
  },
  {
    Icon: Zap,
    title: "Fast Delivery",
    description: "Same-hour express delivery — for when every minute counts.",
    gradient: "from-[#D97706] to-[#F59E0B]",
    glow: "rgba(217,119,6,0.20)",
    href: "/services/fast-delivery",
    badge: "Express",
  },
  {
    Icon: ShoppingBag,
    title: "Rider Store",
    description: "Groceries, pharmacy, fuel, and more — order online, delivered fast.",
    gradient: "from-[#0055CC] to-[#0073FF]",
    glow: "rgba(0,85,204,0.20)",
    href: "/shop",
    badge: "Online",
  },
  {
    Icon: Gem,
    title: "Rider Pawn Shop",
    description: "Asset-backed lending — pawn your property or vehicle professionally.",
    gradient: "from-[#4DA6FF] to-[#0073FF]",
    glow: "rgba(77,166,255,0.20)",
    href: "/pawn",
    badge: "New",
  },
];

function ServiceCard({
  Icon, title, description, gradient, glow, href, badge, index,
}: (typeof services)[0] & { index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 30 }}
      animate={inView ? { y: 0 } : { y: 30 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, type: "spring", stiffness: 120 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default relative"
    >
      {badge && (
        <span className="absolute top-3 right-3 bg-[#0073FF] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider z-10">
          {badge}
        </span>
      )}
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      <div className="p-6">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}
          style={{ boxShadow: `0 8px 24px ${glow}` }}
        >
          <Icon className="w-7 h-7 text-white" strokeWidth={1.75} />
        </div>
        <h3 className="text-base font-black text-gray-900 mb-2 leading-snug">{title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">{description}</p>

        <Link
          href={href}
          className="inline-flex items-center gap-1 text-[#0073FF] text-xs font-bold group/link"
        >
          Get started
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-[#F4F8FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#0073FF]/10 border border-[#0073FF]/20 text-[#0073FF] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Available on Web <span className="text-[#0073FF]">&amp; Mobile App</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">
            Eight services — from a small parcel to a full pawn application. Order online or use the app.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.title} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
