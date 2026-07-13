"use client";
import { useState, useEffect, useCallback } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import PageHero from "@/components/PageHero";
import { MapPin, Phone, Mail, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";

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
  const [errorMsg, setErrorMsg] = useState("");

  // CAPTCHA state
  const [captcha, setCaptcha] = useState<{ question: string; token: string } | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    setCaptchaAnswer("");
    try {
      const res = await fetch("/api/captcha");
      const data = await res.json();
      setCaptcha(data);
    } catch {
      setCaptcha(null);
    }
    setCaptchaLoading(false);
  }, []);

  useEffect(() => { loadCaptcha(); }, [loadCaptcha]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          captchaToken: captcha?.token,
          captchaAnswer,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        setCaptchaAnswer("");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        // If CAPTCHA-related error, refresh the question
        if (data.error?.toLowerCase().includes("verif") || data.error?.toLowerCase().includes("answer")) {
          loadCaptcha();
        }
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
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
                title="Rider Africa location — Swakopmund, Namibia"
                src="https://maps.google.com/maps?q=695+Vrede+Rede%2C+Mondesa%2C+Swakopmund%2C+Namibia&output=embed"
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
                  onClick={() => { setStatus("idle"); loadCaptcha(); }}
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

                {/* ── Human Verification ── */}
                <div className="bg-[#F0F6FF] border border-[#0073FF]/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-[#0073FF]" strokeWidth={1.75} />
                    <span className="text-sm font-semibold text-gray-700">Human Verification</span>
                  </div>

                  {captchaLoading ? (
                    <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                      <svg className="w-4 h-4 animate-spin text-[#0073FF]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Loading question…
                    </div>
                  ) : captcha ? (
                    <div className="flex items-center gap-3">
                      <div className="bg-white border border-[#0073FF]/25 rounded-xl px-4 py-2.5 flex-1">
                        <p className="text-[#0073FF] font-black text-lg tracking-wide">{captcha.question}</p>
                      </div>
                      <input
                        type="number"
                        required
                        value={captchaAnswer}
                        onChange={e => setCaptchaAnswer(e.target.value)}
                        placeholder="?"
                        className="w-20 text-center border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 text-lg font-bold focus:outline-none focus:border-[#0073FF] focus:ring-2 focus:ring-[#0073FF]/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={loadCaptcha}
                        title="New question"
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-[#0073FF] hover:border-[#0073FF]/30 transition-all shrink-0"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={loadCaptcha}
                      className="text-sm text-[#0073FF] underline">
                      Load verification question
                    </button>
                  )}
                </div>

                {/* Honeypot — hidden, bots fill this in */}
                <input
                  type="text"
                  name="_trap"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ display: "none" }}
                />

                {status === "error" && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending" || !captcha}
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
