"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  PackageCheck, Car, Globe, Box, Plane, Zap, ShoppingBag, Gem,
  ChevronDown, X, Menu, Building2, BookOpen, HelpCircle, Users, Truck, Phone, Home,
} from "lucide-react";

const serviceLinks = [
  { href: "/services/local-parcel", label: "Local Parcel Delivery", Icon: PackageCheck },
  { href: "/services/transport", label: "Rider Transportation", Icon: Car },
  { href: "/services/international-parcel", label: "International Parcel", Icon: Globe },
  { href: "/services/container-shipment", label: "Container Shipments", Icon: Box },
  { href: "/services/flight-delivery", label: "Flight Delivery", Icon: Plane },
  { href: "/services/fast-delivery", label: "Fast Delivery", Icon: Zap },
];

const companyLinks = [
  { href: "/about", label: "About Us", Icon: Building2 },
  { href: "/blog", label: "Blog & News", Icon: BookOpen },
  { href: "/investors", label: "Investors", Icon: Users },
  { href: "/faq", label: "FAQ", Icon: HelpCircle },
  { href: "/become-a-driver", label: "Become a Driver", Icon: Truck },
];

function DropdownMenu({ items, onClose }: {
  items: { href: string; label: string; Icon: React.ElementType }[];
  onClose: () => void;
}) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#0D1526] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-2 z-[60]">
      {items.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/6 transition-all group"
        >
          <div className="w-7 h-7 bg-[#0073FF]/15 rounded-lg flex items-center justify-center group-hover:bg-[#0073FF]/25 transition-colors shrink-0">
            <Icon className="w-3.5 h-3.5 text-[#4DA6FF]" strokeWidth={1.75} />
          </div>
          {label}
        </Link>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const [mobileCompany, setMobileCompany] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setCompanyOpen(false);
    setMobileServices(false);
    setMobileCompany(false);
  }, [pathname]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) setCompanyOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  if (pathname.startsWith("/admin")) return null;

  const isHome = pathname === "/";
  const downloadHref = isHome ? "#download" : "/#download";
  const navBg = scrolled || !isHome
    ? "bg-[#090E1A]/96 backdrop-blur-md shadow-[0_1px_0_rgba(0,115,255,0.15)]"
    : "bg-transparent";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo.png" alt="Rider Africa" width={44} height={44} className="rounded-xl" />
            <span className="hidden sm:block text-white font-black text-lg leading-none">
              Rider<span className="text-[#0073FF]">Africa</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            <Link href="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/") ? "text-[#4DA6FF] bg-[#0073FF]/10" : "text-gray-300 hover:text-white hover:bg-white/5"}`}>
              Home
            </Link>

            {/* Services dropdown */}
            <div ref={servicesRef} className="relative">
              <button
                type="button"
                onClick={() => { setServicesOpen(o => !o); setCompanyOpen(false); }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith("/services") ? "text-[#4DA6FF] bg-[#0073FF]/10" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
              >
                Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && <DropdownMenu items={serviceLinks} onClose={() => setServicesOpen(false)} />}
            </div>

            <Link href="/shop" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/shop") ? "text-[#4DA6FF] bg-[#0073FF]/10" : "text-gray-300 hover:text-white hover:bg-white/5"}`}>
              <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} /> Shop
            </Link>

            <Link href="/pawn" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/pawn") ? "text-[#4DA6FF] bg-[#0073FF]/10" : "text-gray-300 hover:text-white hover:bg-white/5"}`}>
              <Gem className="w-3.5 h-3.5" strokeWidth={2} /> Pawn
            </Link>

            {/* Company dropdown */}
            <div ref={companyRef} className="relative">
              <button
                type="button"
                onClick={() => { setCompanyOpen(o => !o); setServicesOpen(false); }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${companyLinks.some(l => pathname === l.href) ? "text-[#4DA6FF] bg-[#0073FF]/10" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
              >
                Company
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${companyOpen ? "rotate-180" : ""}`} />
              </button>
              {companyOpen && <DropdownMenu items={companyLinks} onClose={() => setCompanyOpen(false)} />}
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/contact" className="text-sm text-gray-300 hover:text-white font-medium transition-colors">Contact</Link>
            <a href={downloadHref} className="bg-[#0073FF] hover:bg-[#0055CC] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:shadow-[0_0_20px_rgba(0,115,255,0.5)] btn-glow">
              Download App
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex lg:hidden items-center justify-center w-10 h-10 text-white rounded-xl hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/*
        CRITICAL: Both the backdrop and panel are conditionally rendered ONLY when
        menuOpen=true. This guarantees zero DOM presence (and zero click-blocking)
        when the mobile menu is closed — no reliance on CSS pointer-events or
        visibility classes that may not load on slow networks.
      */}
      {menuOpen && (
        <>
          {/* Backdrop — click to close */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.65)" }}
            onClick={() => setMenuOpen(false)}
          />

          {/* Slide-in panel */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 61,
              width: "88vw",
              maxWidth: "340px",
              background: "#0A1020",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
                <Image src="/logo.png" alt="Rider Africa" width={36} height={36} className="rounded-xl" />
                <span className="text-white font-black text-base leading-none">
                  Rider<span className="text-[#0073FF]">Africa</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 bg-white/8 hover:bg-white/15 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">

              <Link href="/" onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 h-14 rounded-2xl font-semibold text-sm transition-colors ${pathname === "/" ? "bg-[#0073FF]/15 text-[#4DA6FF]" : "text-gray-300 hover:bg-white/6 hover:text-white"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${pathname === "/" ? "bg-[#0073FF]/25" : "bg-white/6"}`}>
                  <Home className="w-4 h-4" strokeWidth={1.75} />
                </div>
                Home
              </Link>

              {/* Services accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileServices(s => !s)}
                  className={`w-full flex items-center justify-between px-4 h-14 rounded-2xl text-sm font-semibold transition-colors ${pathname.startsWith("/services") ? "bg-[#0073FF]/15 text-[#4DA6FF]" : "text-gray-300 hover:bg-white/6 hover:text-white"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${pathname.startsWith("/services") ? "bg-[#0073FF]/25" : "bg-white/6"}`}>
                      <PackageCheck className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    Services
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${mobileServices ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${mobileServices ? "max-h-96" : "max-h-0"}`}>
                  <div className="py-1.5 pl-4 space-y-0.5">
                    {serviceLinks.map(({ href, label, Icon }) => (
                      <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 h-11 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/6 transition-colors">
                        <Icon className="w-4 h-4 text-[#4DA6FF] shrink-0" strokeWidth={1.75} />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/shop" onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 h-14 rounded-2xl font-semibold text-sm transition-colors ${isActive("/shop") ? "bg-[#0073FF]/15 text-[#4DA6FF]" : "text-gray-300 hover:bg-white/6 hover:text-white"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive("/shop") ? "bg-[#0073FF]/25" : "bg-white/6"}`}>
                  <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
                </div>
                Shop
              </Link>

              <Link href="/pawn" onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 h-14 rounded-2xl font-semibold text-sm transition-colors ${isActive("/pawn") ? "bg-[#0073FF]/15 text-[#4DA6FF]" : "text-gray-300 hover:bg-white/6 hover:text-white"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive("/pawn") ? "bg-[#0073FF]/25" : "bg-white/6"}`}>
                  <Gem className="w-4 h-4" strokeWidth={1.75} />
                </div>
                Pawn Shop
              </Link>

              {/* Company accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileCompany(s => !s)}
                  className={`w-full flex items-center justify-between px-4 h-14 rounded-2xl text-sm font-semibold transition-colors ${companyLinks.some(l => pathname === l.href) ? "bg-[#0073FF]/15 text-[#4DA6FF]" : "text-gray-300 hover:bg-white/6 hover:text-white"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${companyLinks.some(l => pathname === l.href) ? "bg-[#0073FF]/25" : "bg-white/6"}`}>
                      <Building2 className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    Company
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${mobileCompany ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${mobileCompany ? "max-h-72" : "max-h-0"}`}>
                  <div className="py-1.5 pl-4 space-y-0.5">
                    {companyLinks.map(({ href, label, Icon }) => (
                      <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 h-11 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/6 transition-colors">
                        <Icon className="w-4 h-4 text-[#4DA6FF] shrink-0" strokeWidth={1.75} />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-1 mt-1 border-t border-white/8">
                <Link href="/contact" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 h-14 rounded-2xl font-semibold text-sm text-gray-300 hover:bg-white/6 hover:text-white transition-colors">
                  <div className="w-9 h-9 bg-white/6 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Panel footer */}
            <div className="px-4 pb-8 pt-4 border-t border-white/8">
              <a
                href={downloadHref}
                onClick={() => setMenuOpen(false)}
                className="block text-center bg-[#0073FF] hover:bg-[#0055CC] text-white font-black py-4 rounded-2xl text-sm transition-colors btn-glow"
              >
                Download App — It&apos;s Free
              </a>
              <p className="text-center text-gray-600 text-xs mt-3">Namibia&apos;s #1 Delivery Platform</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
