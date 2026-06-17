"use client";
import { useState } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import PageHero from "@/components/PageHero";
import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";

const contactItems = [
  {
    Icon: MapPin,
    label: "Address",
    value: "Windhoek, Namibia",
    href: undefined,
  },
  {
    Icon: Phone,
    label: "Phone / WhatsApp",
    value: "+264 81 469 8594",
    href: "tel:+264814698594",
  },
  {
    Icon: Phone,
    label: "Phone / WhatsApp",
    value: "+264 81 732 7089",
    href: "tel:+264817327089",
  },
  {
    Icon: Mail,
    label: "General Enquiries",
    value: "admin@riderafrica.com",
    href: "mailto:admin@riderafrica.com",
  },
  {
    Icon: Mail,
    label: "Customer Care",
    value: "customercare@riderafrica.com",
    href: "mailto:customercare@riderafrica.com",
  },
  {
    Icon: Mail,
    label: "Driver Registration",
    value: "registration@riderafrica.com",
    href: "mailto:registration@riderafrica.com",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <PageHero
        tagline="Get in Touch"
        title="Contact"
        titleHighlight="Rider Africa"
        subtitle="Questions, partnerships, or support — we are here to help."
        imageSrc="/images/contact-hero.jpg"
        imageAlt="Rider Africa support team"
        imagePosition="center 15%"
        gradient="from-[#001A6E] via-[#003EA6] to-[#0073FF]"
      />

      {/* Contact info + form */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <AnimateOnScroll direction="left">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Our Details</h2>
            <div className="space-y-6">
              {contactItems.map((item) => (
                <div key={item.value} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#0073FF]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <item.Icon className="w-5 h-5 text-[#0073FF]" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-gray-900 font-medium hover:text-[#0073FF] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Map embed */}
            <div className="mt-10 rounded-2xl overflow-hidden shadow-lg">
              <iframe
                title="Rider Africa location — Windhoek, Namibia"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d239183.09673767073!2d16.9734473!3d-22.5608807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1c0b1b3c3c3c3c3c%3A0x0!2sWindhoek%2C+Namibia!5e0!3m2!1sen!2sna!4v1718000000000"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </AnimateOnScroll>

          {/* Form */}
          <AnimateOnScroll direction="right" delay={0.2}>
            <h2 className="text-3xl font-black text-gray-900 mb-8">Send a Message</h2>

            {status === "sent" ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-700">
                  Thank you for contacting Rider Africa. We will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-green-700 underline text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0073FF] focus:ring-2 focus:ring-[#0073FF]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0073FF] focus:ring-2 focus:ring-[#0073FF]/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+264 81 ..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0073FF] focus:ring-2 focus:ring-[#0073FF]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                  <select
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#0073FF] focus:ring-2 focus:ring-[#0073FF]/10 transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Business Partnership">Business Partnership</option>
                    <option value="Driver Registration">Driver Registration</option>
                    <option value="Support / Complaint">Support / Complaint</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0073FF] focus:ring-2 focus:ring-[#0073FF]/10 transition-all resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-600 text-sm">Something went wrong. Please try again or email us directly.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-[#0073FF] hover:bg-[#0055CC] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors btn-glow"
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
