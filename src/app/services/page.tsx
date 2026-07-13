import type { Metadata } from "next";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { Package, Car, ShoppingCart, Gem, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Rider Africa offers package delivery, passenger transport, grocery delivery, and valuables transport in Namibia.",
};

const services = [
  {
    Icon: Package,
    title: "Package & Parcel Delivery",
    tagline: "Fast, tracked, reliable",
    description: "Rider Africa provides on-demand courier services for packages, documents, parcels, and goods throughout Namibia. Customers place a pickup request via the app, specify the recipient address, and a verified Rider Africa driver collects and delivers the item directly to the recipient.",
    features: ["Same-day delivery within city limits", "Real-time GPS tracking", "Proof of delivery via photo", "Fragile and sensitive item handling", "Business and bulk dispatch options"],
    gradient: "from-[#0073FF] to-[#003EA6]",
    subLinks: [
      { href: "/services/local-parcel", label: "Local Parcel Delivery" },
      { href: "/services/international-parcel", label: "International Parcel" },
      { href: "/services/container-shipment", label: "Container Shipments" },
      { href: "/services/flight-delivery", label: "Flight Delivery" },
      { href: "/services/fast-delivery", label: "Fast Delivery" },
    ],
  },
  {
    Icon: Car,
    title: "Passenger Transport",
    tagline: "Safe rides, anywhere in Namibia",
    description: "Rider Africa connects passengers with vetted, background-checked drivers for safe and affordable transportation. Whether it is a short city trip, an airport transfer, or a long-distance journey, passengers can book via the app and track their driver in real time.",
    features: ["City rides and long-distance trips", "Airport transfers", "Advance and on-demand booking", "Fixed upfront pricing — no surge surprises", "Female driver option available", "Child seat request option"],
    gradient: "from-[#00C3FF] to-[#0073FF]",
    subLinks: [{ href: "/services/transport", label: "Rider Transportation Details" }],
  },
  {
    Icon: ShoppingCart,
    title: "Grocery & Essentials Delivery",
    tagline: "Fresh groceries to your door",
    description: "Customers can request grocery shopping and delivery through the Rider Africa app. A driver shops for the listed items from partner stores or stores specified by the customer, then delivers them fresh to the customer's address.",
    features: ["Shop from any local store", "Detailed shopping list support", "Fresh produce handling", "Delivery within hours", "Receipt provided for all purchases"],
    gradient: "from-[#0055CC] to-[#003EA6]",
    subLinks: [{ href: "/shop", label: "Browse the Shop" }],
  },
  {
    Icon: Gem,
    title: "Valuables & Pawn Transport",
    tagline: "Secure handling of high-value items",
    description: "Rider Africa provides a specialised courier service for high-value items including pawned goods, jewellery, electronics, documents, and other valuables. These deliveries are assigned to senior, verified drivers and require recipient signature confirmation.",
    features: ["Assigned to senior verified drivers", "Recipient signature on delivery", "Tamper-evident packaging option", "Insurance declaration available", "Chain-of-custody documentation"],
    gradient: "from-[#4DA6FF] to-[#0073FF]",
    subLinks: [{ href: "/pawn", label: "Pawn an Asset" }],
  },
];

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        tagline="Description of Goods & Services"
        title="Everything"
        titleHighlight="Rider Africa Offers"
        subtitle="A full overview of all services available on the Rider Africa platform in Namibia."
        imageSrc="/images/services-hero.jpg"
        imageAlt="Rider Africa services in Namibia"
        imagePosition="center 15%"
        gradient="from-[#001A6E] via-[#003EA6] to-[#0073FF]"
      />

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {services.map((service, i) => (
            <AnimateOnScroll key={service.title} delay={0.1} direction={i % 2 === 0 ? "left" : "right"}>
              <div className={`grid md:grid-cols-2 gap-12 items-start ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
                <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <service.Icon className="w-7 h-7 text-white" strokeWidth={1.75} />
                  </div>
                  <p className="text-[#0073FF] font-semibold text-sm mb-1">{service.tagline}</p>
                  <h2 className="text-3xl font-black text-gray-900 mb-4">{service.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>

                <div className={`bg-[#F4F7FF] rounded-3xl p-8 ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                  <h3 className="font-bold text-gray-900 mb-4">Service Includes:</h3>
                  <ul className="space-y-3">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-[#0073FF] shrink-0" strokeWidth={2} />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {service.subLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200">
                      {service.subLinks.map((l) => (
                        <Link key={l.href} href={l.href}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-[#0073FF]/20 text-[#0073FF] hover:bg-[#0073FF] hover:text-white transition-colors">
                          {l.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {i < services.length - 1 && <hr className="border-gray-100 mt-8" />}
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <section className="py-16 bg-[#0073FF] text-center px-4">
        <AnimateOnScroll>
          <h2 className="text-3xl font-black text-white mb-4">Need any of these services?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Download Rider Africa and get started in minutes. Available on iOS and Android.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/#download" className="bg-white text-[#0073FF] font-bold px-8 py-3 rounded-full hover:bg-[#F4F7FF] transition-colors">Download App</a>
            <Link href="/contact" className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
