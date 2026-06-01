"use client";

import { Shield, Truck, RotateCcw, Award } from "lucide-react";

const BADGES = [
  { icon: Shield, title: "Secure Checkout", desc: "256-bit SSL encryption" },
  { icon: Truck, title: "Free Shipping", desc: "On orders over $150" },
  { icon: RotateCcw, title: "30-Day Returns", desc: "Hassle-free exchanges" },
  { icon: Award, title: "Lifetime Warranty", desc: "On every VAULTA bag" },
];

export function TrustBadges() {
  return (
    <section className="py-12 px-4 sm:px-6 border-y border-[var(--border)] bg-[var(--bg-white)]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {BADGES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left group"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[var(--gold-pale)] text-[var(--gold)] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
              <Icon size={22} strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-semibold text-sm text-[var(--text)]">{title}</p>
              <p className="text-xs mt-0.5 text-[var(--text-muted)]">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
