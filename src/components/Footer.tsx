"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const complianceLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund", label: "Refund Policy" },
  { href: "/cancellation", label: "Cancellation Policy" },
  { href: "/delivery-policy", label: "Delivery Policy" },
];

const companyLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/become-a-driver", label: "Become a Driver" },
  { href: "/investors", label: "Investors" },
  { href: "/blog", label: "Blog & News" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/rider-africa",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/rider_africa_pty_ltd",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/17N4hjiTe3/?mibextid=wwXIfr",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@riderafrica",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.76a4.85 4.85 0 01-1.03-.07z" />
      </svg>
    ),
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@rider_africa_pty_ltd",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.474 12.01v-.017c.02-3.579.87-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.513 5.466l-2.683.73c-1.012-3.621-3.247-5.44-6.67-5.49-2.857.022-5.014.968-6.415 2.814-1.29 1.706-1.953 4.13-1.97 7.218.02 3.093.678 5.52 1.967 7.222 1.4 1.845 3.557 2.79 6.418 2.814 2.642-.022 4.388-.735 5.497-2.292.77-1.085 1.174-2.565 1.195-4.399h-6.69v-2.726h9.47v1.335c0 2.754-.617 4.94-1.83 6.497C20.57 21.843 18.099 23.926 12.186 24z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/264814698594",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const pathname = usePathname();
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  if (pathname.startsWith("/admin")) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail }),
      });
      setSubStatus("done");
      setSubEmail("");
    } catch {
      setSubStatus("error");
    }
  };
  return (
    <footer className="bg-[#090E1A] text-gray-400 pt-16 pb-8 border-t border-[#0073FF]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand + Social */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Rider Africa" width={40} height={40} className="rounded-xl" />
              <p className="text-xl font-black text-white">
                Rider<span className="text-[#0073FF]">Africa</span>
              </p>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Namibia&apos;s on-demand platform for delivery, transport, grocery runs, and more. Proudly Namibian 🇳🇦
            </p>
            <div className="text-sm space-y-1.5 mb-6">
              <p><a href="tel:+264814698594" className="hover:text-[#4DA6FF] transition-colors">📞 +264 81 469 8594</a></p>
              <p><a href="tel:+264817327089" className="hover:text-[#4DA6FF] transition-colors">📞 +264 81 732 7089</a></p>
              <p><a href="mailto:admin@riderafrica.com" className="hover:text-[#4DA6FF] transition-colors">✉️ admin@riderafrica.com</a></p>
              <p><a href="mailto:customercare@riderafrica.com" className="hover:text-[#4DA6FF] transition-colors">✉️ customercare@riderafrica.com</a></p>
              <p><a href="mailto:registration@riderafrica.com" className="hover:text-[#4DA6FF] transition-colors">✉️ registration@riderafrica.com</a></p>
              <p>📍 695 Vrede Rede, Mondesa, Swakopmund</p>
            </div>

            {/* Social icons */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Follow Us</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 bg-white/5 hover:bg-[#0073FF] border border-white/10 hover:border-[#0073FF] rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {companyLinks.slice(0, 4).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#4DA6FF] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More company links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              {companyLinks.slice(4).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#4DA6FF] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + App download */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm mb-8">
              {complianceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#4DA6FF] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-semibold mb-3">Get the App</h4>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://apps.apple.com/na/app/riderafrica/id6741062391"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#0073FF]/10 hover:bg-[#0073FF] border border-[#0073FF]/30 rounded-xl px-3 py-2.5 transition-all group"
              >
                <svg className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="text-white text-xs leading-tight">
                  <span className="block text-gray-400 group-hover:text-blue-100">App Store</span>
                  iOS
                </span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.riderafricaapp.riderafrica&hl=en"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#0073FF]/10 hover:bg-[#0073FF] border border-[#0073FF]/30 rounded-xl px-3 py-2.5 transition-all group"
              >
                <svg className="w-5 h-5 text-white shrink-0" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.544 81.507 67.483-37.824c19.288-10.849 19.288-37.998.217-48.453l-.434-.137zM60.802 507.564a50.213 50.213 0 0038.183-6.39L338.71 262.459l-74.752-74.752L60.802 507.564z" />
                </svg>
                <span className="text-white text-xs leading-tight">
                  <span className="block text-gray-400 group-hover:text-blue-100">Google Play</span>
                  Android
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-[#0073FF]/10 pt-10 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">Stay in the loop</h4>
              <p className="text-gray-500 text-sm">Get updates on new features, promotions, and Rider Africa news.</p>
            </div>
            {subStatus === "done" ? (
              <p className="text-green-400 text-sm font-medium">You&apos;re subscribed!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="email" required
                  value={subEmail}
                  onChange={e => setSubEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 sm:w-56 bg-[#0D1526] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#0073FF]"
                />
                <button
                  type="submit"
                  disabled={subStatus === "loading"}
                  className="px-5 py-2.5 bg-[#0073FF] hover:bg-[#0055CC] disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors shrink-0"
                >
                  {subStatus === "loading" ? "…" : "Subscribe"}
                </button>
              </form>
            )}
          </div>
          {subStatus === "error" && <p className="text-red-400 text-xs mt-2">Something went wrong. Please try again.</p>}
        </div>

        <div className="border-t border-[#0073FF]/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <div>
            <p>&copy; {new Date().getFullYear()} Rider Africa Logistics (Pty) Ltd. All rights reserved.</p>
            <p className="text-gray-700 mt-0.5">Reg. No. 20250760 · Registered in Namibia 🇳🇦 under the Companies Act 2004</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden sm:block">BIPA Reg. 20250760</p>
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-gray-600 hover:text-[#4DA6FF] transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Credit */}
        <div className="mt-4 pt-4 border-t border-white/5 text-center text-xs text-gray-600">
          Website designed &amp; developed by{" "}
          <a
            href="https://datalani.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#4DA6FF] transition-colors font-medium"
          >
            Datalani Technology
          </a>
        </div>
      </div>
    </footer>
  );
}
