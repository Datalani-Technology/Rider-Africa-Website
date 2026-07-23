import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { ArrowRight, Box, Car, Check, Clock3, Gem, Globe2, Headphones, PackageCheck, Plane, ShieldCheck, ShoppingBasket, Sparkles, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Delivery, transport, grocery shopping and logistics services across Namibia.",
};

const services = [
  { title: "Local parcel delivery", label: "Most popular", desc: "Documents and parcels collected and delivered safely within your city.", href: "/services/local-parcel", image: "/images/contact-hero.jpg", icon: PackageCheck, features: ["Same-day delivery", "Live tracking", "Proof of delivery"] },
  { title: "Passenger transport", label: "Safe rides", desc: "Comfortable city rides, airport transfers and long-distance journeys.", href: "/services/transport", image: "/images/driver-hero.jpg", icon: Car, features: ["Verified drivers", "Upfront pricing", "Advance booking"] },
  { title: "Groceries & essentials", label: "Everyday convenience", desc: "Shop groceries, pharmacy items, beverages and daily essentials online.", href: "/shop", image: "/images/grocery-hero-vegetables.png", icon: ShoppingBasket, features: ["Fresh products", "Fast checkout", "Doorstep delivery"] },
  { title: "Pawn & valuables", label: "Confidential", desc: "Professional valuation and secure handling for property, vehicles and valuables.", href: "/pawn", image: "/images/investors-hero.jpg", icon: Gem, features: ["Private process", "Fair evaluation", "Quick response"] },
];

const logistics = [
  { title: "International parcels", href: "/services/international-parcel", icon: Globe2, text: "Send packages beyond Namibia." },
  { title: "Container shipments", href: "/services/container-shipment", icon: Box, text: "Cargo solutions for larger loads." },
  { title: "Air freight", href: "/services/flight-delivery", icon: Plane, text: "Fast delivery by air." },
  { title: "Express delivery", href: "/services/fast-delivery", icon: Truck, text: "Priority service for urgent items." },
];

export default function ServicesPage() {
  return <div className="services-hub">
    <PageHero tagline="Everything in one place" title="Services built around" titleHighlight="your everyday life" subtitle="Choose what you need and Rider Africa will handle the rest, simply, safely and reliably." imageSrc="/images/services-hero.jpg" imageAlt="Rider Africa services" imagePosition="center 35%" />

    <section className="services-intro">
      <div className="ra-shell services-intro-grid">
        <div><p className="ra-kicker">Choose your service</p><h2>One trusted team.<br />Many possibilities.</h2></div>
        <p>Whether you are sending a parcel, booking a ride, shopping for your home or moving cargo across borders, every Rider Africa service follows the same simple promise: clear pricing, reliable support and careful delivery.</p>
      </div>
    </section>

    <section className="services-showcase"><div className="ra-shell services-showcase-grid">
      {services.map(({title,label,desc,href,image,icon:Icon,features}) => <article key={title} className="service-showcase-card">
        <div className="service-showcase-image"><Image src={image} alt={title} fill sizes="(max-width: 800px) 100vw, 50vw" /><span>{label}</span></div>
        <div className="service-showcase-body">
          <div className="service-showcase-icon"><Icon /></div>
          <h3>{title}</h3><p>{desc}</p>
          <ul>{features.map(feature => <li key={feature}><Check />{feature}</li>)}</ul>
          <Link href={href}>Explore this service <ArrowRight /></Link>
        </div>
      </article>)}
    </div></section>

    <section className="services-logistics"><div className="ra-shell">
      <div className="services-section-title"><div><p className="ra-kicker">More ways to deliver</p><h2>Logistics without the complexity.</h2></div><p>Flexible options for urgent parcels, international deliveries and larger cargo.</p></div>
      <div className="services-logistics-grid">{logistics.map(({title,href,icon:Icon,text}) => <Link href={href} key={title}><span><Icon /></span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight /></Link>)}</div>
    </div></section>

    <section className="services-trust"><div className="ra-shell services-trust-grid">
      {[ [ShieldCheck,"Safe by design","Verified drivers and careful handling"], [Clock3,"Ready when you are","On-demand and scheduled options"], [Headphones,"Real human support","Help throughout every journey"], [Sparkles,"Simple experience","Easy booking from start to finish"] ].map(([Icon,title,text]) => {const I=Icon as typeof ShieldCheck;return <div key={title as string}><I /><p><b>{title as string}</b><span>{text as string}</span></p></div>})}
    </div></section>

    <section className="services-final-cta"><div className="ra-shell"><div><p className="ra-kicker">Let us get moving</p><h2>What can Rider Africa do for you today?</h2><p>Start online, download the app or speak directly with our team.</p></div><div><Link href="/shop" className="ra-btn-primary">Get started <ArrowRight /></Link><Link href="/contact" className="ra-btn-light">Talk to our team</Link></div></div></section>
  </div>;
}
