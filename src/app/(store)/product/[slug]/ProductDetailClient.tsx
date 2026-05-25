"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Shield, RotateCcw, Package, Star, Minus, Plus, ChevronRight } from "lucide-react";
import { useStore } from "@/context/store";
import { ProductCard } from "@/components/ui/ProductCard";
import { getRecommendations } from "@/lib/aiEngine";
import { formatPrice, getProductImageUrl, cn } from "@/lib/utils";
import { getLocalProductImages } from "@/lib/imageStorage";
import type { Product } from "@/types";
import toast from "react-hot-toast";

const REVIEWS = [
  { user:"Marcus T.",  rating:5, comment:"Exceptional quality. The leather improves with age — far better than anything else I have owned.", date:"Nov 15, 2024", verified:true },
  { user:"Sarah K.",   rating:5, comment:"Survived 3 weeks of constant travel without a scratch. Completely worth every penny.",                date:"Nov 20, 2024", verified:true },
  { user:"David L.",   rating:4, comment:"Stunning in person. Hardware quality is unmatched. Took a week to break in but now it is perfect.",   date:"Dec 1, 2024",  verified:true },
  { user:"Priya M.",   rating:5, comment:"Got this as a gift and have not stopped using it since. The attention to detail is incredible.",       date:"Dec 5, 2024",  verified:true },
];

export function ProductDetailClient({ product: initialProduct }: { product: Product }) {
  const [product, setProduct] = useState(initialProduct);
  const addToCart           = useStore(s => s.addToCart);
  const toggleWishlist      = useStore(s => s.toggleWishlist);
  const isWishlisted        = useStore(s => s.isWishlisted(product.id));
  const addToRecentlyViewed = useStore(s => s.addToRecentlyViewed);
  const recentlyViewed      = useStore(s => s.recentlyViewed);

  const [qty, setQty]       = useState(1);
  const [activeImg, setImg] = useState(0);
  const [tab, setTab]       = useState<"details"|"specs"|"reviews">("details");

  // Load locally-uploaded images (dev mode)
  useEffect(() => {
    addToRecentlyViewed(product);
    if (product.images.length === 0) {
      const local = getLocalProductImages(product.id);
      if (local.length > 0) {
        setProduct(p => ({ ...p, images: local }));
      }
    }
  }, []); // eslint-disable-line

  const recs = getRecommendations({ current: product, viewed: recentlyViewed, limit: 4 });

  // Build gallery: uploaded images first, then picsum fallbacks
  const galleryImages: string[] = product.images.length > 0
    ? product.images.map(img => img.url)
    : [0, 1, 2, 3].map(i => getProductImageUrl(product, i, 800, 800));

  // Ensure at least 4 gallery slots
  while (galleryImages.length < 4) {
    galleryImages.push(getProductImageUrl(product, galleryImages.length, 800, 800));
  }

  const primaryImage = galleryImages[activeImg] ?? galleryImages[0];
  const isBase64     = (url: string) => url.startsWith("data:");

  const specs = [
    { k:"Material",     v:product.material },
    { k:"Color",        v:product.color },
    { k:"Size",         v:product.size },
    { k:"Capacity",     v:`${product.capacity}L` },
    { k:"Laptop Fit",   v:product.laptopFit ?? "None" },
    { k:"Weight",       v:"~0.9 kg" },
    { k:"Water Resist", v:"Water-Resistant Coating" },
    { k:"Stock",        v:product.stock < 10 ? `Only ${product.stock} left` : "In Stock" },
  ];

  function handleAdd() {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`, { icon:"🛍️" });
  }
  function handleWish() {
    toggleWishlist(product.id);
    toast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist", { icon: isWishlisted ? "💔" : "♥" });
  }

  return (
    <div className="min-h-screen section-subtle pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-8 pt-4" style={{ color:"var(--text-muted)" }}>
          <Link href="/home" className="hover:opacity-70 transition-opacity">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:opacity-70 transition-opacity">Shop</Link>
          <ChevronRight size={12} />
          <span style={{ color:"var(--text)" }}>{product.name}</span>
        </nav>

        {/* Main layout */}
        <div className="grid grid-cols-2 gap-14 mb-20">

          {/* ── Gallery ── */}
          <div>
            {/* Main image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden card-flat section-white mb-3 group">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width:1400px) 50vw, 700px"
                priority
                unoptimized={isBase64(primaryImage)}
              />
              {product.originalPrice && (
                <div className="absolute top-4 left-4 badge badge-green">
                  Save {formatPrice(product.originalPrice - product.price)}
                </div>
              )}
              {product.stock < 10 && (
                <div className="absolute top-4 right-4 badge badge-red">
                  Only {product.stock} left
                </div>
              )}
              {/* Image counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background:"rgba(0,0,0,0.5)", color:"#fff" }}>
                  {activeImg + 1} / {galleryImages.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2.5">
              {galleryImages.slice(0, 4).map((src, i) => (
                <button key={i} onClick={() => setImg(i)}
                  className={cn(
                    "relative h-20 rounded-xl overflow-hidden border-2 transition-all",
                    activeImg === i
                      ? "border-[var(--gold)] shadow-sm"
                      : "border-transparent hover:border-gray-200"
                  )}>
                  <Image
                    src={src}
                    alt={`View ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                    unoptimized={isBase64(src)}
                  />
                </button>
              ))}
            </div>

            {/* Image credit if no custom images */}
            {product.images.length === 0 && (
              <p className="text-[10px] mt-2 text-center" style={{ color:"var(--text-faint)" }}>
                Placeholder images — upload real photos in the Admin Panel
              </p>
            )}
          </div>

          {/* ── Product Info ── */}
          <div>
            <p className="label mb-2">{product.category}</p>
            <h1 className="text-5xl font-black font-serif leading-tight mb-4" style={{ color:"var(--text)" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15}
                    className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                ))}
              </div>
              <span className="text-sm" style={{ color:"var(--text-muted)" }}>
                {product.rating} · {product.reviewCount} reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6" style={{ borderBottom:"1px solid var(--border)" }}>
              <span className="text-4xl font-black font-serif" style={{ color:"var(--text)" }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl line-through" style={{ color:"var(--text-faint)" }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="badge badge-green">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>

            <p className="text-sm leading-relaxed mb-7" style={{ color:"var(--text-sec)" }}>
              {product.description}
            </p>

            {/* Specs mini-grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {specs.slice(0, 6).map(s => (
                <div key={s.k} className="card-flat rounded-xl px-4 py-3 section-white">
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
                    style={{ color:"var(--text-faint)" }}>{s.k}</p>
                  <p className={cn("text-sm font-semibold",
                    s.k === "Stock" && product.stock < 10 ? "text-red-500" : "")}
                    style={{ color: s.k === "Stock" && product.stock < 10 ? undefined : "var(--text)" }}>
                    {s.v}
                  </p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-7">
              {product.tags.map(t => <span key={t} className="badge badge-gold">{t}</span>)}
            </div>

            {/* Qty + CTA */}
            <div className="flex gap-3 mb-4">
              <div className="flex items-center rounded-xl overflow-hidden card-flat section-white">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-11 h-12 flex items-center justify-center transition-colors hover:opacity-60"
                  style={{ color:"var(--text)" }}>
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-bold" style={{ color:"var(--text)" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-11 h-12 flex items-center justify-center transition-colors hover:opacity-60"
                  style={{ color:"var(--text)" }}>
                  <Plus size={16} />
                </button>
              </div>

              <button onClick={handleAdd} className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm">
                <ShoppingBag size={16} />
                Add to Cart — {formatPrice(product.price * qty)}
              </button>

              <button onClick={handleWish}
                className={cn(
                  "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all",
                  isWishlisted ? "bg-red-50 border-red-300" : "card-flat section-white hover:border-red-200"
                )}>
                <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-5" style={{ borderTop:"1px solid var(--border)" }}>
              {[
                { icon:Shield,    l:"Lifetime Warranty" },
                { icon:RotateCcw, l:"Free Returns" },
                { icon:Package,   l:"Free Shipping" },
              ].map(g => (
                <div key={g.l} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-sec)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background:"var(--gold-pale)" }}>
                    <g.icon size={13} style={{ color:"var(--gold)" }} />
                  </div>
                  {g.l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mb-20">
          <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit section-white card-flat">
            {(["details", "specs", "reviews"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={cn("px-6 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all", tab === t ? "shadow-sm" : "hover:opacity-70")}
                style={{
                  background: tab === t ? "var(--bg-white)" : "transparent",
                  color:      tab === t ? "var(--text)" : "var(--text-muted)",
                  boxShadow:  tab === t ? "var(--shadow-sm)" : "none",
                }}>
                {t}{t === "reviews" && ` (${REVIEWS.length})`}
              </button>
            ))}
          </div>

          {tab === "details" && (
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold font-serif mb-4">About This Bag</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color:"var(--text-sec)" }}>{product.description}</p>
                <ul className="space-y-3">
                  {[
                    "Premium materials from certified suppliers",
                    "Hand-inspected quality control",
                    "Lifetime structural warranty",
                    "YKK premium hardware throughout",
                    "Reinforced stitching at all stress points",
                  ].map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm" style={{ color:"var(--text-sec)" }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ background:"var(--gold-pale)", color:"var(--gold)" }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-serif mb-4">In the Box</h3>
                <ul className="divide-y" style={{ borderColor:"var(--border)" }}>
                  {[`1× ${product.name}`, "Dust bag (natural cotton)", "Care card & warranty card", "VAULTA authenticity tag", "Free return label"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm py-3" style={{ color:"var(--text-sec)" }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:"var(--gold)" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "specs" && (
            <div className="max-w-xl card-flat section-white rounded-2xl overflow-hidden">
              {specs.map((s, i) => (
                <div key={s.k} className="flex justify-between items-center px-6 py-4"
                  style={{
                    borderBottom: i < specs.length - 1 ? "1px solid var(--border)" : "none",
                    background: i % 2 === 0 ? "transparent" : "var(--bg-subtle)",
                  }}>
                  <span className="text-sm" style={{ color:"var(--text-muted)" }}>{s.k}</span>
                  <span className={cn("text-sm font-semibold", s.k === "Stock" && product.stock < 10 ? "text-red-500" : "")}
                    style={{ color: s.k === "Stock" && product.stock < 10 ? undefined : "var(--text)" }}>
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tab === "reviews" && (
            <div>
              {/* Summary */}
              <div className="flex items-center gap-10 p-8 card-flat section-white rounded-2xl mb-6">
                <div className="text-center">
                  <p className="text-6xl font-black font-serif mb-1" style={{ color:"var(--text)" }}>{product.rating}</p>
                  <div className="flex justify-center gap-0.5 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16}
                        className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color:"var(--text-muted)" }}>{product.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map(star => {
                    const pct = star===5?72:star===4?20:star===3?5:star===2?2:1;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-xs w-3" style={{ color:"var(--text-muted)" }}>{star}</span>
                        <Star size={11} className="fill-amber-400 text-amber-400 flex-shrink-0" />
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:"var(--bg-muted)" }}>
                          <div className="h-full rounded-full" style={{ width:`${pct}%`, background:"#FBBF24" }} />
                        </div>
                        <span className="text-xs w-7" style={{ color:"var(--text-muted)" }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews */}
              <div className="space-y-4">
                {REVIEWS.map((r, i) => (
                  <div key={i} className="card-flat section-white rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                          style={{ background:"var(--gold-pale)", color:"var(--gold)" }}>
                          {r.user[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{r.user}</p>
                          <div className="flex gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} size={11}
                                className={j < r.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs" style={{ color:"var(--text-faint)" }}>{r.date}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color:"var(--text-sec)" }}>{r.comment}</p>
                    {r.verified && (
                      <p className="text-xs font-semibold text-emerald-600 mt-3">✓ Verified Purchase</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── AI Recommendations ── */}
        {recs.length > 0 && (
          <div>
            <p className="label mb-2">AI-Powered</p>
            <h2 className="text-3xl font-black font-serif mb-8">You May Also Like</h2>
            <div className="grid grid-cols-4 gap-5">
              {recs.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
