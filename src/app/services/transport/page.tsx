import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { ArrowRight, BriefcaseBusiness, CalendarClock, Car, Check, Clock3, Headphones, MapPin, Navigation, ShieldCheck, Sparkles, Users, WalletCards } from "lucide-react";

export const metadata: Metadata = { title: "Passenger Transport | Rider Africa", description: "Safe, convenient passenger transport across Windhoek and Namibia." };

const rideTypes = [
  { icon: Car, title: "Everyday Ride", text: "An affordable, comfortable option for daily trips around the city.", note: "Up to 4 passengers" },
  { icon: Sparkles, title: "Comfort Ride", text: "More space and added comfort for meetings, evenings and special trips.", note: "Recommended · Premium vehicles" },
  { icon: Users, title: "Group Ride", text: "Vans and larger vehicles for families, friends and small groups.", note: "Up to 7 passengers" },
  { icon: BriefcaseBusiness, title: "Business Travel", text: "Reliable scheduled transport for teams, guests and corporate travel.", note: "Flexible accounts" },
];

const steps = [
  { n: "01", title: "Choose your trip", text: "Enter your pickup point and destination to see your ride options." },
  { n: "02", title: "Meet your driver", text: "See your verified driver's details and follow their arrival in real time." },
  { n: "03", title: "Enjoy the journey", text: "Travel comfortably, pay easily and rate your experience when you arrive." },
];

export default function TransportPage() {
  return <div className="ride-page">
    <PageHero tagline="Passenger transport" title="Your ride." titleHighlight="Your way." subtitle="Reliable transport for everyday journeys, airport transfers, business travel and longer trips across Namibia." imageSrc="/images/driver-hero.jpg" imageAlt="Rider Africa passenger transport" imagePosition="center 42%" />

    <section className="ride-quickbar"><div className="ra-shell">
      {[ [ShieldCheck,"Verified drivers"], [Clock3,"On-demand or scheduled"], [WalletCards,"Clear upfront pricing"], [Headphones,"Friendly trip support"] ].map(([Icon,text])=>{const I=Icon as typeof ShieldCheck;return <div key={text as string}><I /><span>{text as string}</span></div>})}
    </div></section>

    <section className="ride-types"><div className="ra-shell">
      <div className="ride-heading"><div><p className="ra-kicker">A ride for every moment</p><h2>Choose what works for you.</h2></div><p>From a quick trip across town to comfortable transport for a whole group, Rider Africa gives you practical options without the complexity.</p></div>
      <div className="ride-type-grid">{rideTypes.map(({icon:Icon,title,text,note},i)=><article key={title} className={i===1?"featured":""}><span className="ride-type-number">0{i+1}</span><div className="ride-type-icon"><Icon /></div><h3>{title}</h3><p>{text}</p><span className="ride-type-note"><Check />{note}</span><Link href="#book-ride">Choose this ride <ArrowRight /></Link></article>)}</div>
    </div></section>

    <section className="ride-safety"><div className="ra-shell ride-safety-grid">
      <div className="ride-safety-image"><Image src="/images/gallery-5.jpg" alt="Safe Rider Africa journey" fill sizes="(max-width: 850px) 100vw, 48vw" /><div><ShieldCheck /><span><b>Safety comes first</b>Every trip is monitored</span></div></div>
      <div><p className="ra-kicker">Travel with confidence</p><h2>Professional drivers.<br />A safer journey.</h2><p className="ride-muted">Every trip is designed to keep you informed and comfortable, from the moment your driver accepts until you reach your destination.</p>
        <ul>{["Driver identity and vehicle details before pickup","Live trip location and shareable journey status","Passenger ratings that maintain service quality","Support available when you need assistance"].map(x=><li key={x}><Check />{x}</li>)}</ul>
        <Link href="/#download" className="ra-btn-primary">Get the Rider Africa app <ArrowRight /></Link>
      </div>
    </div></section>

    <section className="ride-process"><div className="ra-shell"><div className="ride-process-title"><p className="ra-kicker">Simple from pickup to arrival</p><h2>Book your ride in three easy steps.</h2></div><div className="ride-step-grid">{steps.map(({n,title,text})=><article key={n}><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>

    <section id="book-ride" className="ride-book"><div className="ra-shell ride-book-grid">
      <div><p className="ra-kicker">Plan your next journey</p><h2>Where would you like to go?</h2><p>Use the Rider Africa app for an instant booking or contact our team for scheduled, group and business travel.</p><div className="ride-book-actions"><Link href="/#download" className="ra-btn-primary">Book in the app <ArrowRight /></Link><Link href="/contact" className="ra-btn-light">Request a scheduled ride</Link></div></div>
      <div className="ride-route-card"><div><span><MapPin /></span><p><small>Pickup</small>Your current location</p></div><i /><div><span><Navigation /></span><p><small>Destination</small>Where you need to go</p></div><div className="ride-route-foot"><span><CalendarClock /> Schedule ahead</span><b>Safe. Simple. Ready.</b></div></div>
    </div></section>
  </div>;
}
