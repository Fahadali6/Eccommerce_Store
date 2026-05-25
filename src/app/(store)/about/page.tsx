import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title:"About VAULTA", description:"The story behind VAULTA." };

const STATS = [
  { v:"2019", l:"Founded" },{ v:"50K+", l:"Bags Crafted" },
  { v:"12",   l:"Countries" },{ v:"100%", l:"Lifetime Warranty" },
  { v:"4.8★", l:"Avg Rating" },{ v:"$0",   l:"VC Funding" },
];

const VALUES = [
  { emoji:"🔨", t:"Obsessive Craftsmanship",  d:"Every stitch, zipper, and hardware component is chosen for one reason: permanence. We do not cut corners because we believe in making things once, correctly." },
  { emoji:"🪟", t:"Radical Transparency",     d:"We publish our material sourcing and costs. You deserve to know exactly what you are paying for and why it is worth it." },
  { emoji:"🛡", t:"Lifetime Accountability",  d:"Our warranty is not marketing. Every bag can be returned for free repair or replacement — no questions asked, ever." },
];

const TEAM = [
  { name:"Ayaan Khan",    role:"Co-founder & Design Lead",   avatar:"A" },
  { name:"Sara Malik",    role:"Co-founder & Operations",    avatar:"S" },
  { name:"Reza Hussain",  role:"Co-founder & Product",       avatar:"R" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-white pt-32 pb-24 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <span className="badge badge-gold mb-6 inline-flex">Our Story</span>
          <h1 className="text-7xl font-black font-serif leading-[1.1] mb-8" style={{ color:"var(--text)" }}>
            Born from a<br /><span style={{ color:"var(--gold)" }}>Restless Life.</span>
          </h1>
          <p className="text-xl leading-relaxed max-w-2xl mx-auto" style={{ color:"var(--text-sec)" }}>
            VAULTA was founded in 2019 by three designers who were tired of choosing between style and function. We built the bags we could not find anywhere else — and then kept going.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-subtle py-16 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-6 gap-4">
            {STATS.map(s => (
              <div key={s.l} className="card-flat section-white rounded-2xl p-6 text-center">
                <p className="text-3xl font-black font-serif mb-1" style={{ color:"var(--gold)" }}>{s.v}</p>
                <p className="text-xs font-medium" style={{ color:"var(--text-muted)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-white py-24 px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 gap-20 items-center">
          <div className="rounded-3xl overflow-hidden h-[420px]" style={{ background:"var(--bg-subtle)" }}>
            <div className="w-full h-full flex items-center justify-center text-[140px] opacity-20">💼</div>
          </div>
          <div>
            <p className="label mb-4">Craftsmanship</p>
            <h2 className="text-4xl font-black font-serif mb-6" style={{ color:"var(--text)" }}>Made with Obsession</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color:"var(--text-sec)" }}>
              Every VAULTA product starts with one question: What would make this indispensable? We source from tanneries and mills operating for generations. Hardware is brass or stainless steel — never cheap alloy.
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color:"var(--text-sec)" }}>
              Our 12-person team works from our Karachi studio, shipping to 12+ countries. We have never taken outside investment — we answer only to our customers.
            </p>
            <Link href="/shop" className="btn-gold text-sm inline-flex">Shop the Collection</Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-subtle py-24 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="label mb-3">Principles</p>
            <h2 className="text-4xl font-black font-serif" style={{ color:"var(--text)" }}>What We Stand For</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="card section-white rounded-2xl p-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{ background:"var(--gold-pale)" }}>
                  {v.emoji}
                </div>
                <h3 className="text-lg font-bold font-serif mb-3" style={{ color:"var(--text)" }}>{v.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color:"var(--text-sec)" }}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-white py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-14">
            <p className="label mb-3">The Founders</p>
            <h2 className="text-4xl font-black font-serif" style={{ color:"var(--text)" }}>Who We Are</h2>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {TEAM.map((m, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-4 font-serif"
                  style={{ background:"var(--gold-pale)", color:"var(--gold)" }}>
                  {m.avatar}
                </div>
                <h3 className="font-bold font-serif" style={{ color:"var(--text)" }}>{m.name}</h3>
                <p className="text-xs mt-1" style={{ color:"var(--text-muted)" }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background:"var(--gold-pale)", borderTop:"1px solid #E8D5A3" }}>
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="text-4xl font-black font-serif mb-4" style={{ color:"var(--text)" }}>Ready to Carry Better?</h2>
          <p className="text-lg mb-8" style={{ color:"var(--text-sec)" }}>Every bag ships with a lifetime warranty. No catches.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/shop" className="btn-gold">Shop Now</Link>
            <Link href="/contact" className="btn-outline">Get in Touch</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
