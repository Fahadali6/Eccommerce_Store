"use client";
import Link from "next/link";
import { useState } from "react";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin, Shield, Truck, RotateCcw, Award, Send } from "lucide-react";

const LINKS = {
  Shop: [
    { label: "All Bags",      href: "/shop" },
    { label: "Travel Bags",   href: "/shop?cat=Travel%20Bags" },
    { label: "Office Bags",   href: "/shop?cat=Office%20Bags" },
    { label: "Ladies Bags",   href: "/shop?cat=Ladies%20Bags" },
    { label: "Backpacks",     href: "/shop?cat=Backpacks" },
    { label: "Laptop Bags",   href: "/shop?cat=Laptop%20Bags" },
    { label: "Gym Bags",      href: "/shop?cat=Gym%20Bags" },
    { label: "Fashion Bags",  href: "/shop?cat=Fashion%20Bags" },
    { label: "New Arrivals",  href: "/shop?sort=newest" },
  ],
  Company: [
    { label: "About Us",      href: "/about" },
    { label: "Contact",       href: "/contact" },
    { label: "Blog",          href: "/about" },
    { label: "Careers",       href: "/contact" },
    { label: "Press",         href: "/contact" },
    { label: "Admin Panel",   href: "/admin" },
  ],
  Support: [
    { label: "FAQ",           href: "/contact" },
    { label: "Track Order",   href: "/contact" },
    { label: "Returns",       href: "/contact" },
    { label: "Warranty",      href: "/contact" },
    { label: "Shipping Info", href: "/contact" },
    { label: "Size Guide",    href: "/shop" },
  ],
};

const SOCIALS = [
  { Icon: Facebook,  href: "https://facebook.com/vaulta",  label: "Facebook",  color: "#1877F2" },
  { Icon: Instagram, href: "https://instagram.com/vaulta", label: "Instagram", color: "#E4405F" },
  { Icon: Twitter,   href: "https://twitter.com/vaulta",   label: "Twitter",   color: "#1DA1F2" },
  { Icon: Linkedin,  href: "https://linkedin.com/company/vaulta", label: "LinkedIn", color: "#0A66C2" },
  { Icon: Youtube,   href: "https://youtube.com/@vaulta",  label: "YouTube",   color: "#FF0000" },
];

const TRUST = [
  { Icon: Shield,    title: "Lifetime Warranty",     desc: "On every product" },
  { Icon: Truck,     title: "Free Shipping",          desc: "Orders over $150" },
  { Icon: RotateCcw, title: "Free Returns",           desc: "30-day no questions" },
  { Icon: Award,     title: "Premium Quality",        desc: "Certified materials" },
];

const PAYMENT_ICONS = ["VISA", "MC", "AMEX", "PayPal", "Apple Pay", "Google Pay"];

export function Footer() {
  const [email, setEmail]     = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe() {
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)" }}>

      {/* ── Trust strip ── */}
      <div style={{ background: "var(--bg-white)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {TRUST.map((t, i) => (
              <div key={t.title}
                className="flex items-center gap-4 py-6 px-6 transition-all duration-200"
                style={{ borderRight: i < 3 ? "1px solid var(--border)" : "none" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--gold-pale)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--gold-pale)" }}>
                  <t.Icon size={20} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{t.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main footer ── */}
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12">

          {/* Brand column */}
          <div>
            {/* Logo */}
            <Link href="/home" className="flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: "var(--text)" }}>
                <span className="text-white font-black text-xl" style={{ fontFamily: "'Playfair Display',serif" }}>V</span>
              </div>
              <span className="font-black text-2xl tracking-[2px]"
                style={{ fontFamily: "'Playfair Display',serif", color: "var(--text)" }}>VAULTA</span>
            </Link>

            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-sec)", maxWidth: "300px" }}>
              Premium bags engineered for extraordinary lives. Crafted from the worlds finest materials with a lifetime warranty on every product.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-7">
              {[
                { Icon: Mail,    text: "hello@vaulta.co" },
                { Icon: Phone,   text: "+92 21 3456 7890" },
                { Icon: MapPin,  text: "12 Clifton Ave, Karachi" },
              ].map(c => (
                <div key={c.text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--gold-pale)" }}>
                    <c.Icon size={13} style={{ color: "var(--gold)" }} />
                  </div>
                  <span className="text-sm" style={{ color: "var(--text-sec)" }}>{c.text}</span>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {SOCIALS.map(({ Icon, href, label, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-250"
                  style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text-sec)" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = color;
                    el.style.color = "#fff";
                    el.style.borderColor = "transparent";
                    el.style.transform = "translateY(-3px)";
                    el.style.boxShadow = `0 6px 20px ${color}40`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "var(--bg-muted)";
                    el.style.color = "var(--text-sec)";
                    el.style.borderColor = "var(--border)";
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                  }}>
                  <Icon size={16} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="label mb-5">{title}</p>
              <ul className="space-y-3">
                {links.map((l, i) => (
                  <li key={`${l.href}-${i}`}>
                    <Link href={l.href}
                      className="text-sm flex items-center gap-1.5 group transition-all duration-200"
                      style={{ color: "var(--text-sec)" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.color = "var(--gold)";
                        (e.currentTarget as HTMLElement).style.paddingLeft = "4px";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.color = "var(--text-sec)";
                        (e.currentTarget as HTMLElement).style.paddingLeft = "0";
                      }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Newsletter ── */}
        <div className="mt-14 rounded-3xl p-10"
          style={{ background: "var(--text)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="label mb-2" style={{ color: "rgba(212,160,23,0.8)" }}>Newsletter</p>
              <h3 className="text-2xl font-bold mb-2" style={{ color: "#fff", fontFamily:"'Playfair Display',serif" }}>
                Join the VAULTA Community
              </h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                Get exclusive deals, new arrivals, and style inspiration. Unsubscribe anytime.
              </p>
            </div>
            <div>
              {subscribed ? (
                <div className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                  <span className="text-green-400 text-xl">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-white">You&apos;re subscribed!</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Welcome to the VAULTA family.</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <Mail size={15} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
                    <input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                      placeholder="your@email.com"
                      className="bg-transparent outline-none text-sm flex-1 font-sans"
                      style={{ color: "#fff" }}
                    />
                  </div>
                  <button onClick={handleSubscribe}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
                    style={{ background: "var(--gold)", color: "#fff" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "var(--gold-light)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "var(--gold)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}>
                    <Send size={14} />Subscribe
                  </button>
                </div>
              )}
              <p className="text-xs mt-2.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                No spam. Unsubscribe anytime. Privacy policy applies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              © {new Date().getFullYear()} VAULTA. All rights reserved. Made with ♥ in Karachi.
            </p>

            {/* Payment icons */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {PAYMENT_ICONS.map(p => (
                <div key={p} className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                  style={{ background: "var(--bg-muted)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                  {p}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {["Privacy Policy", "Terms of Service", "Cookies"].map(l => (
                <Link key={l} href="/contact" className="text-xs transition-colors"
                  style={{ color: "var(--text-faint)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--gold)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
