import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bike, Box, Check, Clock3, Headphones, MapPin, Plane, ShieldCheck, ShoppingBasket, Star, Truck } from "lucide-react";

export const metadata: Metadata = { title: "Rider Africa — Delivery made simple" };

const services = [
  { title: "Local delivery", text: "Documents, parcels and everyday essentials delivered quickly in your city.", href: "/services/local-parcel", icon: Bike, image: "/images/services-hero.jpg" },
  { title: "Shop & groceries", text: "Order essentials online and get them brought straight to your door.", href: "/shop", icon: ShoppingBasket, image: "/images/gallery-2.jpg" },
  { title: "Passenger rides", text: "Safe, comfortable transport whenever and wherever you need it.", href: "/services/transport", icon: Truck, image: "/images/gallery-5.jpg" },
  { title: "International shipping", text: "Reliable parcel and cargo solutions beyond Namibia’s borders.", href: "/services/international-parcel", icon: Plane, image: "/images/gallery-4.jpg" },
];

export default function HomePage() {
  return <>
    <section className="ra-hero">
      <div className="ra-shell ra-hero-grid">
        <div className="ra-hero-copy">
          <p className="ra-eyebrow"><span /> Namibia’s everyday delivery partner</p>
          <h1>We bring what you need <em>to your door.</em></h1>
          <p className="ra-lead">From groceries and parcels to safe rides and international shipping — one trusted platform makes it all simple.</p>
          <div className="ra-hero-actions">
            <Link href="/shop" className="ra-btn-primary">Shop now <ArrowRight /></Link>
            <Link href="/services" className="ra-btn-secondary">Explore services</Link>
          </div>
          <div className="ra-trust-row">
            <div className="ra-avatars"><span>RA</span><span>✓</span><span>5★</span></div>
            <p><b>Trusted across Namibia</b><small>Fast support · Secure service · Easy booking</small></p>
          </div>
        </div>
        <div className="ra-hero-visual">
          <div className="ra-hero-image"><Image src="/images/services-hero.jpg" alt="Rider Africa delivery team" fill priority sizes="(max-width: 900px) 100vw, 50vw" /></div>
          <div className="ra-float-card ra-float-one"><Clock3 /><p><b>Quick delivery</b><span>Tracked in real time</span></p></div>
          <div className="ra-float-card ra-float-two"><MapPin /><p><b>Across Namibia</b><span>Local & nationwide</span></p></div>
          <div className="ra-dots" />
        </div>
      </div>
    </section>

    <section className="ra-benefits"><div className="ra-shell ra-benefit-grid">
      {[ [Truck,"Fast delivery","On-time, every time"], [ShieldCheck,"Safe & secure","Your order is protected"], [Headphones,"Friendly support","Here when you need us"], [Box,"One simple platform","Shop, send or ride"] ].map(([Icon,title,text]) => { const I=Icon as typeof Truck; return <div key={title as string}><I /><p><b>{title as string}</b><span>{text as string}</span></p></div> })}
    </div></section>

    <section className="ra-section ra-services">
      <div className="ra-shell">
        <div className="ra-section-heading"><div><p className="ra-kicker">What can we do for you?</p><h2>Everything you need, in one place.</h2></div><Link href="/services">View all services <ArrowRight /></Link></div>
        <div className="ra-service-grid">{services.map(({title,text,href,icon:Icon,image}) => <article key={title} className="ra-service-card">
          <div className="ra-card-image"><Image src={image} alt="" fill sizes="(max-width: 700px) 100vw, 25vw" /></div>
          <div className="ra-card-icon"><Icon /></div><div className="ra-card-content"><h3>{title}</h3><p>{text}</p><Link href={href}>Learn more <ArrowRight /></Link></div>
        </article>)}</div>
      </div>
    </section>

    <section className="ra-section ra-promo"><div className="ra-shell ra-promo-grid">
      <div className="ra-promo-image"><Image src="/images/gallery-1.jpg" alt="Easy Rider Africa service" fill sizes="(max-width: 800px) 100vw, 45vw" /></div>
      <div><p className="ra-kicker">Simple from start to finish</p><h2>Your city, delivered in just a few taps.</h2><p className="ra-muted">No complicated process. Choose what you need, tell us where it should go, and follow every step from pickup to arrival.</p>
        <div className="ra-checks">{["Clear pricing before you confirm","Live order and delivery updates","Verified drivers and secure payments"].map(x=><p key={x}><Check />{x}</p>)}</div>
        <Link href="#download" className="ra-btn-primary">Get the Rider Africa app <ArrowRight /></Link>
      </div>
    </div></section>

    <section className="ra-testimonial"><div className="ra-shell"><div className="ra-stars">{[1,2,3,4,5].map(x=><Star key={x} fill="currentColor" />)}</div><blockquote>“Rider Africa makes my daily errands so much easier. The service is quick, the app is simple, and I always know where my order is.”</blockquote><p><b>Happy Rider Africa customer</b><span>Windhoek, Namibia</span></p></div></section>

    <section id="download" className="ra-app-cta"><div className="ra-shell"><div><p className="ra-kicker">Ready when you are</p><h2>What can we deliver for you today?</h2><p>Download the app or start exploring our services online.</p></div><div><a href="https://apps.apple.com/na/app/riderafrica/id6741062391" className="ra-btn-light">Download for iPhone</a><a href="https://play.google.com/store/apps/details?id=com.riderafricaapp.riderafrica" className="ra-btn-dark">Get it on Android</a></div></div></section>
  </>;
}
