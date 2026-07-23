import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { ArrowRight, Check, Flag, HeartHandshake, Lightbulb, MapPin, ShieldCheck, Sparkles, Target, Users, Zap } from "lucide-react";

export const metadata: Metadata = { title: "About Us", description: "The story, mission and values behind Rider Africa." };

const values = [
  { icon: ShieldCheck, title: "Trust first", text: "Safe services, verified drivers and responsible handling in every interaction." },
  { icon: HeartHandshake, title: "People matter", text: "Technology should create opportunity and make everyday life genuinely easier." },
  { icon: Lightbulb, title: "Built to improve", text: "We listen, learn and keep adapting Rider Africa to local needs." },
  { icon: MapPin, title: "Rooted in Namibia", text: "Our decisions begin with the communities, distances and realities we know." },
];

export default function AboutPage() {
  return <div className="about-page">
    <PageHero tagline="Our story" title="Made in Namibia." titleHighlight="Built to move Africa." subtitle="Rider Africa connects people, places and possibilities through delivery, transport and practical everyday services." imageSrc="/images/about-hero.jpg" imageAlt="Rider Africa in Namibia" imagePosition="center 30%" />

    <section className="about-story"><div className="ra-shell about-story-grid">
      <div className="about-story-images"><div><Image src="/images/gallery-3.jpg" alt="Rider Africa at work" fill sizes="(max-width:800px) 100vw,45vw" /></div><div><Image src="/images/gallery-6.jpg" alt="Rider Africa community" fill sizes="240px" /></div><span><b>Namibian</b> owned and operated</span></div>
      <div><p className="ra-kicker">Who we are</p><h2>A local idea with a bigger purpose.</h2><p>Rider Africa is a technology-driven platform created to make moving people and goods simpler across Namibia. We connect customers with trusted drivers for passenger transport, parcel delivery, groceries and specialised logistics.</p><p>We understand long distances, growing cities and communities that need dependable access. That local understanding shapes every service we build.</p><ul>{["Designed around real Namibian needs","Opportunities for local driver-partners","Clear, convenient service for every customer"].map(x=><li key={x}><Check />{x}</li>)}</ul><Link href="/services" className="ra-btn-primary">Explore our services <ArrowRight /></Link></div>
    </div></section>

    <section className="about-values"><div className="ra-shell"><div className="about-section-title"><p className="ra-kicker">What guides us</p><h2>The values behind every journey.</h2></div><div className="about-values-grid">{values.map(({icon:Icon,title,text},i)=><article key={title}><span>0{i+1}</span><div><Icon /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="about-purpose"><div className="ra-shell about-purpose-grid"><article><Target /><p>Our mission</p><h2>Make dependable mobility and delivery accessible to every Namibian.</h2><span>We combine local knowledge, helpful technology and committed people to create services customers can rely on.</span></article><article><Sparkles /><p>Our vision</p><h2>A connected Africa where distance no longer limits opportunity.</h2><span>We are building toward a leading Southern African platform that helps communities and local businesses move forward.</span></article></div></section>

    <section className="about-impact"><div className="ra-shell"><div><Flag /><p><b>Proudly Namibian</b><span>Created for our local context</span></p></div><div><Users /><p><b>Community powered</b><span>Drivers and customers grow together</span></p></div><div><Zap /><p><b>Always moving</b><span>Fast, practical and improving</span></p></div></div></section>

    <section className="about-cta"><div className="ra-shell"><div><p className="ra-kicker">Move with us</p><h2>Be part of the Rider Africa journey.</h2></div><div><Link href="/#download" className="ra-btn-primary">Download the app <ArrowRight /></Link><Link href="/become-a-driver" className="ra-btn-light">Become a driver</Link></div></div></section>
  </div>;
}
