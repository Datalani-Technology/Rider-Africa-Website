"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, Phone, Search, ShoppingBag, Truck, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services", dropdown: true },
  { href: "/shop", label: "Shop" },
  { href: "/pawn", label: "Pawn" },
  { href: "/about", label: "About us" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <div className="ra-topstrip">
        <div className="ra-shell flex items-center justify-between gap-4">
          <p className="ra-topstrip-tag"><Truck />Fast, reliable delivery across Namibia</p>
          <div className="hidden sm:flex ra-topstrip-links">
            <a href="mailto:admin@riderafrica.com"><Mail /> admin@riderafrica.com</a>
            <a href="tel:+264814698594"><Phone /> +264 81 469 8594</a>
          </div>
        </div>
      </div>
      <header className="ra-header">
        <div className="ra-shell ra-nav">
          <Link href="/" className="ra-brand">
            <Image src="/logo.png" alt="Rider Africa" width={46} height={46} priority />
            <span>Rider <b>Africa</b><small>Delivering possibilities</small></span>
          </Link>
          <nav className="hidden lg:flex items-center">
            {links.map(link => (
              <Link key={link.href} href={link.href} className={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)) ? "active" : ""}>
                {link.label}{link.dropdown && <ChevronDown />}
              </Link>
            ))}
          </nav>
          <div className="ra-nav-actions">
            <Link href="/shop" aria-label="Search the shop"><Search /></Link>
            <Link href="/shop" className="ra-cart"><ShoppingBag /><span>Shop now</span></Link>
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
          </div>
        </div>
      </header>
      {open && <div className="ra-mobile-wrap">
        <button className="ra-mobile-backdrop" onClick={() => setOpen(false)} aria-label="Close menu" />
        <aside className="ra-mobile-menu">
          <div className="flex items-center justify-between mb-8">
            <span className="font-black text-xl">Rider <b className="text-[#f7ad20]">Africa</b></span>
            <button onClick={() => setOpen(false)}><X /></button>
          </div>
          {links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<span>›</span></Link>)}
          <Link href="/become-a-driver" className="ra-mobile-cta">Become a driver</Link>
        </aside>
      </div>}
    </>
  );
}
