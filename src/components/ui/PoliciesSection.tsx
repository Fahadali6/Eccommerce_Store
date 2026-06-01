"use client";

import Link from "next/link";
import { Package, RefreshCw, CreditCard, Lock } from "lucide-react";

const POLICIES = [
  {
    icon: Package,
    title: "Shipping Policy",
    desc: "Free standard shipping on orders over $150. Express delivery available at checkout. Most orders ship within 1–2 business days.",
    link: "/contact",
    linkLabel: "Shipping details",
  },
  {
    icon: RefreshCw,
    title: "Returns & Exchanges",
    desc: "30-day hassle-free returns on unworn items. Lifetime structural warranty on manufacturing defects — we repair or replace.",
    link: "/contact",
    linkLabel: "Return policy",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    desc: "We accept all major credit cards, PayPal, and Apple Pay. Your payment data is encrypted and never stored on our servers.",
    link: "/checkout",
    linkLabel: "Safe checkout",
  },
];

const PAYMENT_LABELS = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"];

export function PoliciesSection() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 bg-[var(--bg-subtle)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <p className="label mb-3">Shop With Confidence</p>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-[var(--text)]">
            Policies & Protection
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12">
          {POLICIES.map(({ icon: Icon, title, desc, link, linkLabel }) => (
            <div
              key={title}
              className="card rounded-2xl p-6 sm:p-8 bg-[var(--bg-white)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[var(--gold-pale)] text-[var(--gold)]">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="font-bold font-serif text-lg mb-2 text-[var(--text)]">{title}</h3>
              <p className="text-sm leading-relaxed mb-4 text-[var(--text-muted)]">{desc}</p>
              <Link
                href={link}
                className="text-sm font-semibold text-[var(--gold)] hover:underline underline-offset-4"
              >
                {linkLabel} →
              </Link>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-8 px-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-white)]">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <Lock size={18} className="text-[var(--gold)]" />
            <span className="text-sm font-medium">Secure payment methods</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {PAYMENT_LABELS.map(label => (
              <span
                key={label}
                className="px-4 py-2 rounded-lg text-xs font-bold tracking-wide border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-sec)]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
