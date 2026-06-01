import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Award, Heart, Globe, ArrowRight, Check } from "lucide-react";
export const metadata: Metadata = { title:"About VAULTA", description:"The story behind VAULTA." };

export default function AboutPage() {
  const stats = [
    { v:"2019", l:"Year Founded" },{ v:"50K+", l:"Bags Crafted" },
    { v:"12+", l:"Countries" },{ v:"100%", l:"Warranty Coverage" },
    { v:"4.9★", l:"Customer Rating" },{ v:"$0", l:"VC Funding" },
  ];
  const values = [
    { Icon:Shield,  title:"Obsessive Craftsmanship",   desc:"Every stitch, zipper, and hardware component chosen for permanence. We don't cut corners — ever." },
    { Icon:Award,   title:"Radical Transparency",      desc:"We publish material sourcing and costs. You deserve to know what you are paying for and why it is worth it." },
    { Icon:Heart,   title:"Lifetime Accountability",   desc:"Our warranty is not marketing. Every bag can be returned for free repair or replacement, no questions asked." },
    { Icon:Globe,   title:"Sustainable Sourcing",      desc:"Materials sourced from certified ethical suppliers. We believe in responsible production at every step." },
  ];

  return (
    <div className="min-h-screen" style={{ background:"var(--bg)" }}>

      {/* Hero */}
      <section className="section section-subtle text-center">
        <div className="container-sm">
          <span className="badge badge-gold mb-6 inline-flex">Our Story</span>
          <h1 className="text-7xl font-black font-serif mb-8" style={{ color:"var(--text)" }}>
            Born from a<br /><span style={{ color:"var(--gold)" }}>Restless Life.</span>
          </h1>
          <p className="text-xl leading-relaxed" style={{ color:"var(--text-sec)" }}>
            VAULTA was founded in 2019 by three designers tired of choosing between style and function.
            We built the bags we couldn't find anywhere else — and never stopped.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-sm" style={{ background:"var(--bg-white)" }}>
        <div className="container">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {stats.map(s => (
              <div key={s.l} className="rounded-3xl p-6 text-center card-flat">
                <p className="text-3xl font-black font-serif mb-1" style={{ color:"var(--gold)" }}>{s.v}</p>
                <p className="text-xs font-medium" style={{ color:"var(--text-muted)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section" style={{ background:"var(--bg)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="rounded-3xl overflow-hidden" style={{ height:"440px", background:"var(--bg-subtle)", border:"1px solid var(--border)" }}>
              <div className="w-full h-full flex items-center justify-center text-[140px] opacity-15">💼</div>
            </div>
            <div>
              <p className="label mb-4">Our Craft</p>
              <h2 className="text-4xl font-black font-serif mb-6" style={{ color:"var(--text)" }}>
                Made with Obsession
              </h2>
              <p className="text-base leading-relaxed mb-5" style={{ color:"var(--text-sec)" }}>
                Every VAULTA product starts with one question: What would make this indispensable? We source from tanneries and mills operating for generations. Hardware is brass or stainless steel — never cheap alloy.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color:"var(--text-sec)" }}>
                Our 12-person team works from our Karachi studio, shipping to 12+ countries. We have never taken outside investment — we answer only to our customers.
              </p>
              <div className="space-y-3 mb-8">
                {["Full-grain leather from Italian tanneries","YKK hardware — the world standard","Hand-stitched reinforcement at stress points","Water-resistant treatment on every bag"].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background:"var(--gold-pale)" }}>
                      <Check size={11} style={{ color:"var(--gold)" }} />
                    </div>
                    <span className="text-sm" style={{ color:"var(--text-sec)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/shop" className="btn-gold inline-flex items-center gap-2">
                Shop Collection <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section-subtle">
        <div className="container">
          <div className="section-heading">
            <p className="label mb-3">Our Principles</p>
            <h2>What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="card p-8 rounded-3xl">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background:"var(--gold-pale)" }}>
                  <v.Icon size={22} style={{ color:"var(--gold)" }} />
                </div>
                <h3 className="text-xl font-bold font-serif mb-3" style={{ color:"var(--text)" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:"var(--text-sec)" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm"
        style={{ background:"linear-gradient(135deg, var(--gold-pale), #FDF3DC)", borderTop:"1px solid var(--gold-border)" }}>
        <div className="container-sm text-center">
          <h2 className="text-4xl font-black font-serif mb-4" style={{ color:"var(--text)" }}>
            Ready to Carry Better?
          </h2>
          <p className="text-lg mb-8" style={{ color:"var(--text-sec)" }}>
            Every bag ships with a lifetime warranty. No catches.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/shop" className="btn-gold inline-flex items-center gap-2">
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn-outline">Get in Touch</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
