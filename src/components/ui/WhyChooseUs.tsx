"use client";

import { Gem, Leaf, Headphones, Sparkles } from "lucide-react";

const REASONS = [
  {
    icon: Gem,
    title: "Premium Materials",
    desc: "Full-grain leather, ballistic nylon, and Italian canvas — sourced for durability and timeless style.",
  },
  {
    icon: Leaf,
    title: "Sustainable Craft",
    desc: "Responsible sourcing and packaging. Built to last decades, not seasons.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    desc: "Dedicated concierge team for sizing, repairs, and warranty claims — 7 days a week.",
  },
  {
    icon: Sparkles,
    title: "AI-Curated Picks",
    desc: "Smart recommendations based on your style and browsing — find your perfect bag faster.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 bg-[var(--bg-white)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12 sm:mb-14">
          <p className="label mb-3">The VAULTA Difference</p>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-[var(--text)]">
            Why Choose Us
          </h2>
          <p className="text-sm sm:text-base mt-3 max-w-xl mx-auto text-[var(--text-muted)]">
            Every detail is engineered for people who refuse to compromise on quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--bg-white)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[var(--gold-pale)] text-[var(--gold)] group-hover:scale-110 transition-transform duration-300">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <h3 className="font-bold font-serif text-lg mb-2 text-[var(--text)]">{title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
