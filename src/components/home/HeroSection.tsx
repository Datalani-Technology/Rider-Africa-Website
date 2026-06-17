"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Car, ShoppingCart, Gem, CheckCircle, Star, Apple } from "lucide-react";

const floatingChips = [
  { Icon: Package, label: "Parcel Delivered!", x: "-135%", y: "12%", delay: 0 },
  { Icon: Car, label: "Driver Nearby", x: "115%", y: "22%", delay: 0.4 },
  { Icon: Star, label: "5.0 Rating", x: "-115%", y: "62%", delay: 0.8 },
  { Icon: ShoppingCart, label: "Grocery Delivered", x: "100%", y: "58%", delay: 1.2 },
];

const phoneServices = [
  { Icon: Package, label: "Parcel Delivery" },
  { Icon: Car, label: "Transport" },
  { Icon: ShoppingCart, label: "Groceries" },
  { Icon: Gem, label: "Valuables" },
];

function useTypewriter(words: string[], speed = 75, pause = 2000) {
  const [displayed, setDisplayed] = useState(words[0]);
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(words[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        } else {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        if (charIdx > 0) {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        } else {
          setDeleting(false);
          setWordIdx((w) => (w + 1) % words.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const typewriterText = useTypewriter(["Delivered.", "Connected.", "Moving."]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#090E1A]">
      {/* Background video */}
      <video autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #0073FF 0%, #003EA6 60%, transparent 80%)" }}
          animate={{ scale: [1, 1.1, 0.95, 1], rotate: [0, 10, -5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #00C3FF 0%, #0073FF 50%, transparent 80%)" }}
          animate={{ scale: [1, 1.15, 0.9, 1], rotate: [0, -15, 8, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,115,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,115,255,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-[#0073FF]/10 rounded-full"
          animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-[#0073FF]/08 rounded-full"
          animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
      </div>

      <motion.div style={{ y }} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-[#0073FF]/15 border border-[#0073FF]/30 text-[#4DA6FF] text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
            >
              <span className="w-2 h-2 bg-[#0073FF] rounded-full animate-pulse" />
              Proudly Namibian · Live on iOS & Android
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6"
            >
              Everything
              <br />
              <span className="gradient-text" suppressHydrationWarning>
                {typewriterText}
                <span className="animate-pulse text-[#0073FF]">|</span>
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg text-gray-400 max-w-lg mb-10 leading-relaxed"
            >
              Rider Africa is Namibia&apos;s on-demand platform for package delivery, passenger transport, grocery runs, and more.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <a href="https://apps.apple.com/na/app/riderafrica/id6741062391" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#0073FF] hover:bg-[#0055CC] text-white font-bold px-6 py-4 rounded-2xl transition-all shadow-[0_8px_32px_rgba(0,115,255,0.45)] hover:shadow-[0_12px_40px_rgba(0,115,255,0.6)] hover:-translate-y-1 btn-glow"
              >
                <Apple className="w-7 h-7" />
                <span>
                  <span className="block text-xs opacity-80">Download on the</span>
                  <span className="text-lg leading-tight">App Store</span>
                </span>
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.riderafricaapp.riderafrica&hl=en" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white/8 hover:bg-white/15 border border-white/20 hover:border-[#0073FF]/60 text-white font-bold px-6 py-4 rounded-2xl transition-all hover:-translate-y-1 backdrop-blur-sm"
              >
                <svg className="w-7 h-7" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.544 81.507 67.483-37.824c19.288-10.849 19.288-37.998.217-48.453l-.434-.137zM60.802 507.564a50.213 50.213 0 0038.183-6.39L338.71 262.459l-74.752-74.752L60.802 507.564z"/>
                </svg>
                <span>
                  <span className="block text-xs opacity-80">Get it on</span>
                  <span className="text-lg leading-tight">Google Play</span>
                </span>
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.65 }}
              className="flex items-center gap-8"
            >
              {[{ v: "5.0", l: "App Rating" }, { v: "500+", l: "Active Drivers" }, { v: "10K+", l: "Deliveries" }].map((s) => (
                <div key={s.l}>
                  <p className="text-2xl font-black text-white">{s.v}</p>
                  <p className="text-xs text-gray-500">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, type: "spring", stiffness: 80 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-[#0073FF]/25 rounded-full scale-90" />

              <motion.div
                animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-64 sm:w-72 bg-gradient-to-b from-[#0073FF] to-[#003EA6] rounded-[3rem] p-3 shadow-[0_32px_80px_rgba(0,115,255,0.5)] border border-[#0073FF]/40"
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#090E1A] rounded-full z-10" />
                <div className="bg-[#090E1A] rounded-[2.5rem] overflow-hidden min-h-[500px] flex flex-col items-center justify-center px-5 pt-10 pb-6 relative">
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }} className="mb-6">
                    <Image src="/logo.png" alt="Rider Africa" width={64} height={64} className="rounded-2xl" />
                  </motion.div>
                  <p className="text-white font-black text-xl mb-1">Rider Africa</p>
                  <p className="text-[#4DA6FF] text-xs mb-8">Your city. On demand.</p>

                  {phoneServices.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                      className="w-full flex items-center gap-3 bg-[#0073FF]/15 border border-[#0073FF]/30 rounded-xl px-4 py-3 mb-2.5 text-white text-sm font-semibold"
                    >
                      <item.Icon className="w-4 h-4 text-[#4DA6FF] shrink-0" strokeWidth={2} />
                      {item.label}
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center mt-2">
                  <div className="w-24 h-1 bg-white/30 rounded-full" />
                </div>
              </motion.div>

              {/* Floating chips */}
              {floatingChips.map((chip, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                  transition={{
                    opacity: { delay: 1.2 + chip.delay, duration: 0.5 },
                    scale: { delay: 1.2 + chip.delay, duration: 0.5 },
                    y: { delay: 1.2 + chip.delay, duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute flex items-center gap-2 bg-[#0D1526]/90 border border-[#0073FF]/30 backdrop-blur-sm text-white text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap"
                  style={{ left: chip.x, top: chip.y }}
                >
                  <chip.Icon className="w-3.5 h-3.5 text-[#4DA6FF]" strokeWidth={2} />
                  {chip.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
      >
        <div className="w-6 h-10 border-2 border-[#0073FF]/50 rounded-full flex justify-center pt-2">
          <motion.div className="w-1 h-2.5 bg-[#0073FF] rounded-full"
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} />
        </div>
      </motion.div>
    </section>
  );
}
