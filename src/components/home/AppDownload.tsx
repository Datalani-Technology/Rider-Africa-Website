"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Zap, Lock, MapPin, Gift } from "lucide-react";

const badges = [
  { Icon: Zap, label: "Instant" },
  { Icon: Lock, label: "Secure" },
  { Icon: MapPin, label: "Namibia" },
  { Icon: Gift, label: "Free" },
];

export default function AppDownload() {
  return (
    <section id="download" className="relative py-24 bg-[#090E1A] overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-[#0073FF]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-[#00C3FF]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Logo + text */}
          <motion.div
            initial={{ x: -20 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Image src="/logo.png" alt="Rider Africa" width={60} height={60} className="rounded-2xl" />
              <div>
                <p className="text-white font-black text-2xl">Rider Africa</p>
                <p className="text-[#4DA6FF] text-sm">Free · iOS & Android</p>
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Ready to Ride
              <br />
              <span className="gradient-text">with Africa?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Join thousands of Namibians already using the smartest way to
              send, receive, and move. Download free — available now.
            </p>

            {/* Rating strip */}
            <div className="flex items-center gap-6 mb-10">
              <div className="text-center">
                <p className="text-3xl font-black text-white">5.0</p>
                <div className="flex gap-0.5 text-yellow-400 text-sm">{"★★★★★"}</div>
                <p className="text-gray-500 text-xs mt-0.5">App Store</p>
              </div>
              <div className="w-px h-12 bg-gray-800" />
              <div className="text-center">
                <p className="text-3xl font-black text-white">Free</p>
                <p className="text-gray-400 text-sm">No subscription</p>
                <p className="text-gray-500 text-xs mt-0.5">Ever</p>
              </div>
              <div className="w-px h-12 bg-gray-800" />
              <div className="text-center">
                <p className="text-3xl font-black text-white">🇳🇦</p>
                <p className="text-gray-400 text-sm">Namibia</p>
                <p className="text-gray-500 text-xs mt-0.5">Based</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="https://apps.apple.com/na/app/riderafrica/id6741062391"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 bg-[#0073FF] text-white px-6 py-4 rounded-2xl shadow-[0_8px_32px_rgba(0,115,255,0.4)] hover:shadow-[0_12px_40px_rgba(0,115,255,0.6)] transition-shadow btn-glow"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span>
                  <span className="block text-xs opacity-80">Download on the</span>
                  <span className="text-lg font-bold leading-tight">App Store</span>
                </span>
              </motion.a>

              <motion.a
                href="https://play.google.com/store/apps/details?id=com.riderafricaapp.riderafrica&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 bg-white/8 border border-white/20 hover:border-[#0073FF]/60 hover:bg-white/12 text-white px-6 py-4 rounded-2xl transition-all"
              >
                <svg className="w-7 h-7" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.544 81.507 67.483-37.824c19.288-10.849 19.288-37.998.217-48.453l-.434-.137zM60.802 507.564a50.213 50.213 0 0038.183-6.39L338.71 262.459l-74.752-74.752L60.802 507.564z"/>
                </svg>
                <span>
                  <span className="block text-xs opacity-80">Get it on</span>
                  <span className="text-lg font-bold leading-tight">Google Play</span>
                </span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right: QR codes + badges */}
          <motion.div
            initial={{ x: 20 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="bg-gradient-to-br from-[#0073FF]/20 to-[#003EA6]/30 border border-[#0073FF]/30 rounded-3xl p-8 backdrop-blur-sm w-full max-w-sm">
              <p className="text-white font-black text-xl mb-1 text-center">Scan to Download</p>
              <p className="text-gray-400 text-sm mb-6 text-center">Point your camera at a code below</p>

              <div className="grid grid-cols-2 gap-4">
                {/* App Store QR */}
                <a
                  href="https://apps.apple.com/na/app/riderafrica/id6741062391"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 hover:shadow-[0_0_24px_rgba(0,115,255,0.4)] transition-shadow group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https%3A%2F%2Fapps.apple.com%2Fna%2Fapp%2Friderafrica%2Fid6741062391&color=090E1A&bgcolor=ffffff&qzone=1"
                    alt="QR code for App Store"
                    width={120}
                    height={120}
                    className="rounded-lg"
                  />
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-800 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span className="text-gray-800 text-xs font-bold">App Store</span>
                  </div>
                </a>

                {/* Google Play QR */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.riderafricaapp.riderafrica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 hover:shadow-[0_0_24px_rgba(0,115,255,0.4)] transition-shadow group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.riderafricaapp.riderafrica&color=090E1A&bgcolor=ffffff&qzone=1"
                    alt="QR code for Google Play"
                    width={120}
                    height={120}
                    className="rounded-lg"
                  />
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-800 shrink-0" viewBox="0 0 512 512" fill="currentColor">
                      <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.544 81.507 67.483-37.824c19.288-10.849 19.288-37.998.217-48.453l-.434-.137zM60.802 507.564a50.213 50.213 0 0038.183-6.39L338.71 262.459l-74.752-74.752L60.802 507.564z"/>
                    </svg>
                    <span className="text-gray-800 text-xs font-bold">Google Play</span>
                  </div>
                </a>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {badges.map((b) => (
                  <div key={b.label} className="bg-white/5 border border-white/10 rounded-xl py-3 flex flex-col items-center gap-1.5">
                    <b.Icon className="w-5 h-5 text-[#4DA6FF]" strokeWidth={1.75} />
                    <p className="text-white text-xs font-semibold">{b.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
