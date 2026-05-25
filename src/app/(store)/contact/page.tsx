import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
export const metadata: Metadata = { title:"Contact Us", description:"Get in touch with VAULTA." };

const INFO = [
  { emoji:"📧", t:"Email Us",  v:"hello@vaulta.co",         s:"Reply within 24 hours" },
  { emoji:"📞", t:"Call Us",   v:"+92 21 3456 7890",        s:"Mon–Fri, 9am–6pm PKT" },
  { emoji:"📍", t:"Visit Us",  v:"12 Clifton Ave, Karachi", s:"By appointment only" },
];

const FAQ = [
  { q:"Do you ship internationally?",  a:"Yes — 12+ countries. Free shipping on orders over $150." },
  { q:"What is the return policy?",    a:"Free returns within 30 days. No questions asked." },
  { q:"How does the warranty work?",   a:"Lifetime structural warranty. We repair or replace." },
  { q:"Can I track my order?",         a:"Yes, you will receive a tracking link within 1 business day of shipping." },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-white pt-32 pb-16 px-6 text-center">
        <span className="badge badge-gold mb-5 inline-flex">Get in Touch</span>
        <h1 className="text-6xl font-black font-serif mb-4" style={{ color:"var(--text)" }}>
          We Are Here<br />for You.
        </h1>
        <p className="text-lg max-w-md mx-auto" style={{ color:"var(--text-sec)" }}>
          Questions, feedback, or just saying hello — we read every message.
        </p>
      </section>

      {/* Content */}
      <section className="section-subtle py-16 px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 gap-12">

          {/* Left */}
          <div>
            {/* Contact cards */}
            <div className="space-y-4 mb-10">
              {INFO.map(c => (
                <div key={c.t} className="card-flat section-white rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background:"var(--gold-pale)" }}>
                    {c.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-0.5" style={{ color:"var(--text)" }}>{c.t}</p>
                    <p className="text-sm font-semibold" style={{ color:"var(--gold)" }}>{c.v}</p>
                    <p className="text-xs mt-0.5" style={{ color:"var(--text-muted)" }}>{c.s}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div className="card-flat section-white rounded-2xl p-6">
              <p className="label mb-5">Quick Answers</p>
              <div className="space-y-5">
                {FAQ.map(({ q, a }) => (
                  <div key={q}>
                    <p className="text-sm font-semibold mb-1" style={{ color:"var(--text)" }}>{q}</p>
                    <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
