"use client";
import { useState } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import Link from "next/link";

const categories = [
  {
    label: "Customers",
    faqs: [
      { q: "How do I book a delivery or ride?", a: "Download the Rider Africa app from the App Store or Google Play. Sign up, choose your service (delivery, transport, grocery), enter your pickup and drop-off details, and confirm. A nearby driver will be matched within minutes." },
      { q: "How much does it cost?", a: "Pricing is calculated based on distance, service type, and vehicle category. You will see a fare estimate before confirming your booking — no hidden fees. Payment can be made by cash, card, or mobile money." },
      { q: "Can I track my order in real time?", a: "Yes. Once a driver is assigned, you can track their location live on the map inside the Rider Africa app. You will also receive push notifications at every key stage of your delivery or trip." },
      { q: "What if my package is damaged or lost?", a: "Rider Africa provides basic coverage up to N$ 500 for standard deliveries. For high-value items, we offer declared-value insurance at the time of booking. Contact support within 48 hours of delivery for any claims." },
      { q: "Can I cancel my booking?", a: "Yes. You can cancel free of charge within the first 5 minutes after a driver is dispatched. Cancellations after that may incur a small fee (N$ 25–N$ 50). See our Cancellation Policy for full details." },
      { q: "Which areas do you serve?", a: "We currently serve Windhoek and surrounding areas. We are rapidly expanding to other Namibian towns. Check the app for live service coverage in your area." },
    ],
  },
  {
    label: "Drivers",
    faqs: [
      { q: "How do I become a Rider Africa driver?", a: "Visit our Become a Driver page, fill in the application form, and submit your documents. We review applications within 24 hours. Once approved, you will complete a short onboarding session and go live." },
      { q: "What documents do I need to sign up?", a: "You need a valid Namibian driver's licence, vehicle registration certificate, proof of vehicle insurance, a roadworthy certificate, and a Namibian ID or passport." },
      { q: "How and when do I get paid?", a: "Driver earnings are paid weekly, every Monday, directly to your registered bank account or MTC Wallet. There are no delays — your completed trips are automatically calculated." },
      { q: "Can I choose which jobs I accept?", a: "Absolutely. You are an independent partner, not an employee. You set your own hours and accept or decline job requests as you choose — no penalties for declining." },
      { q: "Is there a subscription fee to drive?", a: "Rider Africa currently operates on a commission model — we take a small percentage of each completed job. There is no monthly subscription fee to be on the platform." },
    ],
  },
  {
    label: "Payments & Refunds",
    faqs: [
      { q: "What payment methods are accepted?", a: "We accept cash, bank card (Visa & Mastercard), MTC Mymoney, and the Rider Africa in-app wallet. More mobile money options coming soon." },
      { q: "How do I request a refund?", a: "Contact us at admin@riderafrica.com or +264 81 469 8594 within 48 hours of your service. Include your booking reference number and details of the issue. Refunds are processed within 1–7 business days depending on payment method." },
      { q: "Is my payment information secure?", a: "Yes. Rider Africa uses industry-standard SSL encryption and does not store your card details. Card payments are processed by a certified payment gateway." },
    ],
  },
  {
    label: "General",
    faqs: [
      { q: "Is Rider Africa available outside Namibia?", a: "Currently Rider Africa operates in Namibia. We have plans to expand to Botswana, Zambia, and other Southern African countries in the near future." },
      { q: "How do I contact support?", a: "You can reach us via the in-app Help section (24/7), by calling +264 81 469 8594, or by emailing admin@riderafrica.com. Our support team typically responds within 2 hours." },
      { q: "Can businesses use Rider Africa for bulk deliveries?", a: "Yes — we offer B2B delivery accounts for businesses with regular shipping needs. Contact us at admin@riderafrica.com to discuss a business partnership and bulk pricing." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-[#F4F7FF] transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">{q}</span>
        <span className={`text-[#0073FF] text-xl shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96" : "max-h-0"}`}>
        <p className="px-6 pb-5 pt-1 text-gray-600 text-sm leading-relaxed bg-white border-t border-gray-50">{a}</p>
      </div>
    </div>
  );
}

export default function FAQClient() {
  const [activeCategory, setActiveCategory] = useState(0);
  return (
    <section className="py-20 bg-[#F4F7FF]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat, i) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(i)}
                aria-pressed={activeCategory === i}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === i
                    ? "bg-[#0073FF] text-white shadow-[0_4px_16px_rgba(0,115,255,0.35)]"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#0073FF]/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        <div className="space-y-3">
          {categories[activeCategory].faqs.map((faq, i) => (
            <AnimateOnScroll key={i} delay={i * 0.04}>
              <FAQItem q={faq.q} a={faq.a} />
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll className="mt-12 bg-[#0073FF] rounded-3xl p-8 text-center">
          <p className="text-white font-bold text-lg mb-2">Still have questions?</p>
          <p className="text-blue-100 text-sm mb-6">Our support team is available 24/7 and will respond within 2 hours.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="bg-white text-[#0073FF] font-bold px-6 py-3 rounded-full hover:bg-[#F4F7FF] transition-colors text-sm">
              Contact Support
            </Link>
            <a href="tel:+264814698594" className="border-2 border-white text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-sm">
              Call Us Now
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
