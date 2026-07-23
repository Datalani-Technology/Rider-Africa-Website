"use client";

import { useCallback, useEffect, useState } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import PageHero from "@/components/PageHero";
import {
  ArrowRight,
  BriefcaseBusiness,
  CarFront,
  CheckCircle2,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  ShieldCheck,
} from "lucide-react";

const quickContacts = [
  { Icon: Phone, eyebrow: "Call or WhatsApp", value: "+264 81 469 8594", href: "tel:+264814698594" },
  { Icon: Mail, eyebrow: "Email our team", value: "admin@riderafrica.com", href: "mailto:admin@riderafrica.com" },
  { Icon: MapPin, eyebrow: "Our location", value: "Windhoek, Namibia" },
  { Icon: Clock3, eyebrow: "Support hours", value: "Mon–Sat · 08:00–18:00" },
];

const contactRoutes = [
  {
    Icon: Headphones,
    title: "Customer care",
    copy: "Questions about an order, ride or service? Our support team is ready to help.",
    label: "customercare@riderafrica.com",
    href: "mailto:customercare@riderafrica.com",
  },
  {
    Icon: CarFront,
    title: "Become a driver",
    copy: "Get support with registration, documents and your driver partner application.",
    label: "registration@riderafrica.com",
    href: "mailto:registration@riderafrica.com",
  },
  {
    Icon: BriefcaseBusiness,
    title: "Business & partnerships",
    copy: "Let’s discuss fleet transport, deliveries, corporate accounts or a partnership.",
    label: "Start a conversation",
    href: "mailto:admin@riderafrica.com?subject=Business%20Partnership",
  },
];

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [captcha, setCaptcha] = useState<{ question: string; token: string } | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    setCaptchaAnswer("");
    try {
      const response = await fetch("/api/captcha");
      setCaptcha(await response.json());
    } catch {
      setCaptcha(null);
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadCaptcha, 0);
    return () => window.clearTimeout(timer);
  }, [loadCaptcha]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken: captcha?.token, captchaAnswer }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        if (/verif|answer|expired/i.test(data.error || "")) loadCaptcha();
        return;
      }
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setCaptchaAnswer("");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <main className="contact-page">
      <PageHero
        tagline="Rider Africa support"
        title="Let’s start a"
        titleHighlight="conversation."
        subtitle="Whether you need support, want to drive with us or have a business idea, the right Rider Africa team is only a message away."
        imageSrc="/images/contact-hero.jpg"
        imageAlt="Rider Africa customer support"
        imagePosition="center 20%"
      />

      <section className="contact-quickbar" aria-label="Quick contact information">
        <div className="ra-shell contact-quick-grid">
          {quickContacts.map(({ Icon, eyebrow, value, href }) => (
            <div className="contact-quick-item" key={eyebrow}>
              <span><Icon /></span>
              <div><small>{eyebrow}</small>{href ? <a href={href}>{value}</a> : <strong>{value}</strong>}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-main">
        <div className="ra-shell contact-main-grid">
          <AnimateOnScroll direction="left">
            <div className="contact-intro">
              <p className="ra-kicker">How can we help?</p>
              <h2>Reach the right team, <em>without the runaround.</em></h2>
              <p className="contact-muted">Choose a direct contact below or use the form. Give us a few details and we’ll make sure your message reaches the right person.</p>
            </div>
            <div className="contact-route-list">
              {contactRoutes.map(({ Icon, title, copy, label, href }, index) => (
                <article key={title}>
                  <span className="contact-route-number">0{index + 1}</span>
                  <div className="contact-route-icon"><Icon /></div>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                    <a href={href}>{label}<ArrowRight /></a>
                  </div>
                </article>
              ))}
            </div>
            <div className="contact-response-note"><MessageCircle /><div><strong>Fast, human support</strong><span>We normally reply within 24 hours on business days.</span></div></div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="right" delay={0.12}>
            <div className="contact-form-card" id="send-message">
              <div className="contact-form-head">
                <span><Send /></span>
                <div><small>Send us a message</small><h2>Tell us what you need.</h2></div>
              </div>

              {status === "sent" ? (
                <div className="contact-success">
                  <CheckCircle2 />
                  <h3>Your message is on its way.</h3>
                  <p>Thank you for contacting Rider Africa. Our team will get back to you as soon as possible.</p>
                  <button onClick={() => { setStatus("idle"); loadCaptcha(); }}>Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-field-row">
                    <label>Full name<input name="name" required value={form.name} onChange={handleChange} placeholder="Your full name" /></label>
                    <label>Email address<input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" /></label>
                  </div>
                  <div className="contact-field-row">
                    <label>Phone number <i>Optional</i><input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+264 81 000 0000" /></label>
                    <label>What can we help with?
                      <select name="subject" required value={form.subject} onChange={handleChange}>
                        <option value="">Choose a subject</option>
                        <option>General Enquiry</option><option>Order or Ride Support</option><option>Business Partnership</option>
                        <option>Driver Registration</option><option>Support / Complaint</option><option>Other</option>
                      </select>
                    </label>
                  </div>
                  <label>Message<textarea name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Share a few details so we can help you faster…" /></label>

                  <div className="contact-captcha">
                    <div className="contact-captcha-label"><ShieldCheck /><span><b>Quick verification</b><small>This helps us keep your message secure.</small></span></div>
                    {captchaLoading ? <span className="contact-captcha-loading"><RefreshCw /> Loading…</span> : captcha ? (
                      <div className="contact-captcha-question"><strong>{captcha.question}</strong><input type="number" required aria-label="Verification answer" value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)} placeholder="?" /><button type="button" onClick={loadCaptcha} aria-label="New question"><RefreshCw /></button></div>
                    ) : <button type="button" className="contact-reload" onClick={loadCaptcha}>Reload question</button>}
                  </div>
                  <input type="text" name="_trap" tabIndex={-1} autoComplete="off" aria-hidden="true" className="contact-trap" />
                  {status === "error" && <p className="contact-error">{errorMsg}</p>}
                  <button className="contact-submit" type="submit" disabled={status === "sending" || !captcha}>{status === "sending" ? "Sending your message…" : <>Send message <ArrowRight /></>}</button>
                  <p className="contact-privacy"><ShieldCheck /> Your details are used only to respond to your enquiry.</p>
                </form>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="contact-location">
        <div className="ra-shell contact-location-grid">
          <div className="contact-map">
            <iframe title="Rider Africa location in Namibia" src="https://maps.google.com/maps?q=Windhoek%2C+Namibia&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="contact-location-copy">
            <p className="ra-kicker">Local roots. Connected service.</p>
            <h2>Proudly serving <em>Namibia.</em></h2>
            <p>Rider Africa brings mobility, shopping and everyday services together in one simple platform.</p>
            <div><MapPin /><span><small>Main service area</small><strong>Windhoek, Namibia</strong></span></div>
            <div><Phone /><span><small>Alternative contact</small><a href="tel:+264817327089">+264 81 732 7089</a></span></div>
            <a className="ra-btn-primary" href="mailto:admin@riderafrica.com">Contact our team <ArrowRight /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
