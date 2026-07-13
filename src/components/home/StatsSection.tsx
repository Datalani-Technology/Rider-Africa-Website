"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { PackageCheck, Users, MapPin, Star } from "lucide-react";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref} suppressHydrationWarning>{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { Icon: PackageCheck, value: 10000, suffix: "+", label: "Deliveries Completed" },
  { Icon: Users, value: 500, suffix: "+", label: "Active Drivers" },
  { Icon: MapPin, value: 50, suffix: "+", label: "Namibian Towns" },
  { Icon: Star, value: 5, suffix: ".0", label: "App Store Rating" },
];

export default function StatsSection() {
  return (
    <section className="relative py-14 overflow-hidden bg-[#0073FF]">
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <stat.Icon className="w-7 h-7 text-blue-200 mb-2" strokeWidth={1.5} />
              <p className="text-4xl font-black text-white">
                <Counter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-blue-100 mt-1 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
