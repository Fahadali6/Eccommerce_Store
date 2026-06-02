"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight, Shield, Truck, RotateCcw, Star,
  Award, Users, Package, TrendingUp, ChevronLeft, ChevronRight, Quote
} from "lucide-react";
import { useStore } from "@/context/store";
import { ProductCard } from "@/components/ui/ProductCard";
import { HeroSlider } from "@/components/ui/HeroSlider";
import { PRODUCTS, CATEGORIES, TESTIMONIALS } from "@/lib/data";
import { getRecommendations } from "@/lib/aiEngine";
import { getLocalProductImages } from "@/lib/imageStorage";
import type { Product } from "@/types";

/* ── Animated counter ─────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count.toLocaleString()}{suffix}</>;
}

/* ── Testimonial slider ───────────────────────────────────── */
function TestimonialSlider() {
  const [idx, setIdx] = useState(0);
  const total = TESTIMONIALS.length;
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % total), 4500);
    return () => clearInterval(t);
  }, [total]);

  return (
    <div className="relative">
      {TESTIMONIALS.map((t, i) => (
        <div key={i}
          className="card-flat p-8 rounded-3xl transition-all duration-500"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            display: i === idx ? "block" : "none",
            animation: i === idx ? "fadeIn 0.5s ease both" : "none",
          }}>
          <Quote size={32} style={{ color: "var(--gold)", opacity: 0.4, marginBottom: 16 }} />
          <p className="text-lg leading-relaxed italic mb-6"
            style={{ color: "var(--text-sec)" }}>
            &ldquo;{t.text}&rdquo;
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black"
              style={{ background: "var(--gold-pale)", color: "var(--gold)" }}>
              {t.avatar}
            </div>
            <div>
              <p className="font-bold" style={{ color: "var(--text)" }}>{t.name}</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t.role}</p>
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <div className="flex items-center gap-3 mt-5">
        <button onClick={() => setIdx(i => (i - 1 + total) % total)}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: "var(--bg-muted)", color: "var(--text-sec)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-muted)"; (e.currentTarget as HTMLElement).style.color = "var(--text-sec)"; }}>
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === idx ? "24px" : "8px",
                height: "8px",
                background: i === idx ? "var(--gold)" : "var(--border-dark)",
              }} />
          ))}
        </div>
        <button onClick={() => setIdx(i => (i + 1) % total)}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: "var(--bg-muted)", color: "var(--text-sec)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-muted)"; (e.currentTarget as HTMLElement).style.color = "var(--text-sec)"; }}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────── */
export function HomeClient() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const recentlyViewed = useStore(s => s.recentlyViewed);

  useEffect(() => {
    const enriched = PRODUCTS.map(p => {
      if (p.images.length > 0) return p;
      const local = getLocalProductImages(p.id);
      return local.length > 0 ? { ...p, images: local } : p;
    });
    setProducts(enriched);
  }, []);

  const featured = recentlyViewed.length > 0
    ? getRecommendations({ viewed: recentlyViewed, limit: 4 })
    : products.filter(p => p.featured).slice(0, 4);

  const trending      = products.filter(p => p.trending).slice(0, 4);
  const newArrivals   = [...products].reverse().slice(0, 4);
  const isPersonalized = recentlyViewed.length > 0;

  return (
    <div>
      {/* ── HERO SLIDER ── */}
      <HeroSlider />

      {/* ── TRUST STRIP ── */}
      <section style={{ background: "var(--bg-white)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              { Icon: Shield,    title: "Lifetime Warranty",  desc: "Every product, forever" },
              { Icon: Truck,     title: "Free Shipping",       desc: "On orders over $150" },
              { Icon: RotateCcw, title: "Easy Returns",        desc: "30-day free returns" },
              { Icon: Award,     title: "Premium Quality",     desc: "Certified materials" },
            ].map((item, i) => (
              <div key={item.title}
                className="flex items-center gap-4 py-5 px-6 transition-all duration-200"
                style={{ borderRight: i < 3 ? "1px solid var(--border)" : "none" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--gold-pale)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--gold-pale)" }}>
                  <item.Icon size={18} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{item.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div className="section-heading">
            <p className="label mb-3">Collections</p>
            <h2>Shop by Category</h2>
            <p>Discover our curated collections crafted for every lifestyle</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href={`/shop?cat=${cat.name}`}
                className="group relative overflow-hidden rounded-3xl transition-all duration-350"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(184,134,11,0.3)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                }}
              >
                <div className="flex flex-col items-center text-center p-8 gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "var(--gold-pale)" }}>
                    {cat.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold font-serif text-lg mb-1" style={{ color: "var(--text)" }}>
                      {cat.name}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{cat.desc}</p>
                    <span className="text-xs font-bold flex items-center justify-center gap-1 transition-all"
                      style={{ color: "var(--gold)" }}>
                      Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED / AI PICKS ── */}
      <section className="section section-subtle">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="label mb-2">{isPersonalized ? "✦ AI Curated" : "✦ Featured"}</p>
              <h2 className="text-4xl font-black font-serif">{isPersonalized ? "Picked For You" : "Editor's Picks"}</h2>
              {isPersonalized && <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Based on your browsing history</p>}
            </div>
            <Link href="/shop" className="btn-outline btn-sm flex items-center gap-1.5">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 2} />)}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="section-sm section-dark">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { Icon: Users,     target: 50000, suffix: "+", label: "Happy Customers" },
              { Icon: Package,   target: 12,    suffix: "+", label: "Countries Shipped" },
              { Icon: Star,      target: 4,     suffix: ".9★", label: "Average Rating" },
              { Icon: TrendingUp, target: 100,  suffix: "%", label: "Satisfaction Rate" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(212,160,23,0.15)" }}>
                  <s.Icon size={22} style={{ color: "var(--gold-light)" }} />
                </div>
                <p className="text-4xl font-black font-serif mb-1" style={{ color: "var(--gold-light)" }}>
                  <Counter target={s.target} suffix={s.suffix} />
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING ── */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="label mb-2">🔥 Hot Right Now</p>
              <h2 className="text-4xl font-black font-serif">Trending Now</h2>
            </div>
            <Link href="/shop?sort=trending" className="btn-outline btn-sm flex items-center gap-1.5">
              See All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trending.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US + TESTIMONIALS ── */}
      <section className="section section-subtle">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Why Choose Us */}
            <div>
              <p className="label mb-3">Why VAULTA</p>
              <h2 className="text-4xl font-black font-serif mb-6">Built Different.<br /><span style={{ color: "var(--gold)" }}>Built to Last.</span></h2>
              <p className="text-lg leading-relaxed mb-10" style={{ color: "var(--text-sec)" }}>
                Every VAULTA bag is the result of obsessive craftsmanship, premium materials, and decades of design experience. We do not cut corners — ever.
              </p>
              <div className="space-y-5">
                {[
                  { emoji: "🔨", title: "Obsessive Craftsmanship",  desc: "Hand-inspected at every stage. Every stitch is intentional." },
                  { emoji: "🛡",  title: "Lifetime Structural Warranty", desc: "We repair or replace, no questions asked, forever." },
                  { emoji: "🌍",  title: "Sustainable Sourcing",    desc: "Premium materials from certified ethical suppliers worldwide." },
                  { emoji: "✨",  title: "Premium Materials Only",  desc: "Full-grain leather, Cordura nylon, Italian canvas — nothing less." },
                ].map(f => (
                  <div key={f.title} className="flex gap-4 p-5 rounded-2xl transition-all duration-200"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-border)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "var(--gold-pale)" }}>
                      {f.emoji}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1" style={{ color: "var(--text)" }}>{f.title}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-sec)" }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <Link href="/shop" className="btn-gold flex items-center gap-2">
                  Shop Now <ArrowRight size={15} />
                </Link>
                <Link href="/about" className="btn-outline">Our Story</Link>
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <p className="label mb-3">Customer Stories</p>
              <h2 className="text-4xl font-black font-serif mb-8">What They Say About Us</h2>
              <TestimonialSlider />

              {/* Review summary */}
              <div className="mt-6 p-5 rounded-2xl flex items-center gap-5"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="text-center">
                  <p className="text-4xl font-black font-serif" style={{ color: "var(--gold)" }}>4.9</p>
                  <div className="flex justify-center gap-0.5 my-1">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Overall</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map(s => {
                    const pct = s===5?74:s===4?18:s===3?5:s===2?2:1;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-xs w-2" style={{ color: "var(--text-muted)" }}>{s}</span>
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-muted)" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#FBBF24" }} />
                        </div>
                        <span className="text-xs w-6 text-right" style={{ color: "var(--text-muted)" }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="label mb-2">✨ Just Dropped</p>
              <h2 className="text-4xl font-black font-serif">New Arrivals</h2>
            </div>
            <Link href="/shop?sort=newest" className="btn-outline btn-sm flex items-center gap-1.5">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── RECENTLY VIEWED ── */}
      {recentlyViewed.length > 0 && (
        <section className="section-sm section-subtle">
          <div className="container">
            <p className="label mb-3">Your History</p>
            <h2 className="text-3xl font-black font-serif mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {recentlyViewed.slice(0, 4).map(p => <ProductCard key={p.id} product={p} compact />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section className="section-sm"
        style={{ background: "linear-gradient(135deg, var(--gold-pale) 0%, #FDF3DC 50%, var(--gold-pale) 100%)", borderTop: "1px solid var(--gold-border)" }}>
        <div className="container-sm text-center">
          <p className="label mb-4">Limited Time Offer</p>
          <h2 className="text-5xl font-black font-serif mb-5" style={{ color: "var(--text)" }}>
            Built to Last.<br /><span style={{ color: "var(--gold)" }}>Backed for Life.</span>
          </h2>
          <p className="text-xl mb-10" style={{ color: "var(--text-sec)" }}>
            Every VAULTA bag ships with a lifetime structural warranty and free returns. No catches, no fine print.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop" className="btn-gold btn-lg flex items-center gap-2">
              Shop the Collection <ArrowRight size={18} />
            </Link>
            <Link href="/about" className="btn-outline btn-lg">Learn Our Story</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
