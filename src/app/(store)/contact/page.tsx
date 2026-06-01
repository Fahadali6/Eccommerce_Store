import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { ContactForm } from "./ContactForm";
export const metadata: Metadata = { title:"Contact Us", description:"Get in touch with VAULTA." };

const INFO = [
  { Icon:Mail,          t:"Email Us",    v:"hello@vaulta.co",         s:"Reply within 24 hours" },
  { Icon:Phone,         t:"Call Us",     v:"+92 21 3456 7890",        s:"Mon–Fri, 9am–6pm PKT" },
  { Icon:MapPin,        t:"Visit Us",    v:"12 Clifton Ave, Karachi", s:"By appointment only" },
  { Icon:Clock,         t:"Hours",       v:"Mon–Fri: 9am–6pm",        s:"Sat: 10am–4pm PKT" },
];

const FAQ = [
  { q:"Do you ship internationally?",    a:"Yes — 12+ countries. Free shipping on orders over $150." },
  { q:"What is the return policy?",      a:"Free returns within 30 days. No questions asked." },
  { q:"How does the warranty work?",     a:"Lifetime structural warranty — we repair or replace." },
  { q:"Can I track my order?",           a:"Yes, tracking link sent within 1 business day of shipping." },
  { q:"Do you offer gift wrapping?",     a:"Yes! Mention it in order notes at checkout. It's free." },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ background:"var(--bg)" }}>
      <section className="section section-subtle text-center">
        <div className="container-sm">
          <span className="badge badge-gold mb-5 inline-flex">
            <MessageCircle size={11} />Get in Touch
          </span>
          <h1 className="text-6xl font-black font-serif mb-5" style={{ color:"var(--text)" }}>
            We Are Here<br />for You.
          </h1>
          <p className="text-xl" style={{ color:"var(--text-sec)" }}>
            Questions, feedback, or just saying hello — we read every message.
          </p>
        </div>
      </section>

      <section className="section" style={{ background:"var(--bg)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {INFO.map(c => (
                  <div key={c.t} className="card rounded-2xl p-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background:"var(--gold-pale)" }}>
                      <c.Icon size={18} style={{ color:"var(--gold)" }} />
                    </div>
                    <p className="text-sm font-bold mb-0.5" style={{ color:"var(--text)" }}>{c.t}</p>
                    <p className="text-sm font-semibold" style={{ color:"var(--gold)" }}>{c.v}</p>
                    <p className="text-xs mt-0.5" style={{ color:"var(--text-muted)" }}>{c.s}</p>
                  </div>
                ))}
              </div>
              <div className="card rounded-3xl p-7">
                <p className="label mb-5">Quick Answers</p>
                <div className="space-y-5">
                  {FAQ.map(({ q, a }) => (
                    <div key={q} style={{ borderBottom:"1px solid var(--border)", paddingBottom:"16px" }}>
                      <p className="text-sm font-bold mb-1.5" style={{ color:"var(--text)" }}>{q}</p>
                      <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
