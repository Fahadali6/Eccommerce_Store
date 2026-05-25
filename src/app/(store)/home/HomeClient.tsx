"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { HeroSlider } from "@/components/ui/HeroSlider";
import { useStore } from "@/context/store";
import { ProductCard } from "@/components/ui/ProductCard";
import { PRODUCTS, CATEGORIES, TESTIMONIALS } from "@/lib/data";
import { getRecommendations } from "@/lib/aiEngine";
import { getProductImageUrl } from "@/lib/utils";
import { getLocalProductImages } from "@/lib/imageStorage";
import type { Product } from "@/types";

export function HomeClient() {
  const [mounted, setMounted]           = useState(false);
  const [enriched, setEnriched]         = useState<Product[]>([]);
  const recentlyViewed                  = useStore(s => s.recentlyViewed);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  // Load locally-stored images for all products (dev mode)
  useEffect(() => {
    const enrichedProducts = PRODUCTS.map(p => {
      if (p.images.length > 0) return p;
      const local = getLocalProductImages(p.id);
      return local.length > 0 ? { ...p, images: local } : p;
    });
    setEnriched(enrichedProducts);
  }, []);

  const products = enriched.length > 0 ? enriched : PRODUCTS;

  const featured = recentlyViewed.length > 0
    ? getRecommendations({ viewed: recentlyViewed, limit: 4 })
    : products.filter(p => p.featured).slice(0, 4);

  const trending      = products.filter(p => p.trending).slice(0, 4);
  const isPersonalized = recentlyViewed.length > 0;
  const heroProduct   = products.find(p => p.slug === "summit-ridge-backpack") ?? products[4];
  const heroImgSrc    = getProductImageUrl(heroProduct, 0, 800, 960);
  const heroIsBase64  = heroImgSrc.startsWith("data:");

  return (
    <div className="min-h-screen">

      {/* ── HERO SLIDER ── */}
      <HeroSlider />

            {/* ── CATEGORIES ── */}
      <section className="py-24 px-6 section-subtle">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-14">
            <p className="label mb-3">Collections</p>
            <h2 className="text-4xl font-black font-serif">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href={`/shop?cat=${cat.name}`}
                className="card section-white flex flex-col items-center text-center p-10 gap-3 rounded-2xl group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-all group-hover:scale-110"
                  style={{ background:"var(--gold-pale)" }}>
                  {cat.emoji}
                </div>
                <h3 className="font-bold font-serif text-base mb-1" style={{ color:"var(--text)" }}>{cat.name}</h3>
                <p className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>{cat.desc}</p>
                <span className="text-xs font-semibold" style={{ color:"var(--gold)" }}>Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI PICKS ── */}
      <section className="py-24 px-6 section-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="label mb-2">{isPersonalized ? "✦ Curated For You" : "✦ Featured"}</p>
              <h2 className="text-4xl font-black font-serif">
                {isPersonalized ? "AI-Picked For You" : "Editor's Picks"}
              </h2>
              {isPersonalized && (
                <p className="text-sm mt-1" style={{ color:"var(--text-muted)" }}>
                  Based on your browsing history
                </p>
              )}
            </div>
            <Link href="/shop" className="btn-outline text-sm">View All</Link>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── FEATURE STRIP ── */}
      <section className="py-16 px-6" style={{ background:"var(--text)" }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-3 gap-10">
          {[
            { n:"50,000+", l:"Bags delivered worldwide" },
            { n:"4.9 ★",   l:"Average customer rating"  },
            { n:"100%",    l:"Lifetime warranty coverage" },
          ].map(s => (
            <div key={s.l} className="text-center">
              <p className="text-4xl font-black font-serif mb-2" style={{ color:"var(--gold-light)" }}>{s.n}</p>
              <p className="text-sm" style={{ color:"rgba(255,255,255,0.6)" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRENDING ── */}
      <section className="py-24 px-6 section-subtle">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="label mb-2">Hot Right Now</p>
              <h2 className="text-4xl font-black font-serif">Trending Now</h2>
            </div>
            <Link href="/shop?sort=trending" className="btn-outline text-sm">See All</Link>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {trending.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── RECENTLY VIEWED ── */}
      {recentlyViewed.length > 0 && (
        <section className="py-20 px-6 section-white">
          <div className="max-w-[1400px] mx-auto">
            <p className="label mb-3">Your History</p>
            <h2 className="text-3xl font-black font-serif mb-10">Recently Viewed</h2>
            <div className="grid grid-cols-4 gap-5">
              {recentlyViewed.slice(0,4).map(p => <ProductCard key={p.id} product={p} compact />)}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6 section-subtle">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <p className="label mb-3">Stories</p>
            <h2 className="text-4xl font-black font-serif">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="card section-white rounded-2xl p-8">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({length:5}).map((_,j) =>
                    <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                  )}
                </div>
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color:"var(--text-sec)" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base"
                    style={{ background:"var(--gold-pale)", color:"var(--gold)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{t.name}</p>
                    <p className="text-xs" style={{ color:"var(--text-muted)" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6"
        style={{ background:"var(--gold-pale)", borderTop:"1px solid #E8D5A3" }}>
        <div className="max-w-[800px] mx-auto text-center">
          <p className="label mb-4">Limited Time</p>
          <h2 className="text-5xl font-black font-serif mb-4" style={{ color:"var(--text)" }}>
            Built to Last. <span style={{ color:"var(--gold)" }}>Backed for Life.</span>
          </h2>
          <p className="text-lg mb-8" style={{ color:"var(--text-sec)" }}>
            Every VAULTA bag ships with a lifetime structural warranty and free returns.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop" className="btn-gold">Shop the Collection</Link>
            <Link href="/about" className="btn-outline">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
