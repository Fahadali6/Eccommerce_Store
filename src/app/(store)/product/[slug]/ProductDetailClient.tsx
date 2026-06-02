"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, ShoppingBag, Shield, RotateCcw,
  Star, Minus, Plus, ChevronRight, Share2, Truck, Check, ZoomIn,
} from "lucide-react";
import { useStore } from "@/context/store";
import { ProductCard } from "@/components/ui/ProductCard";
import { getRecommendations } from "@/lib/aiEngine";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { getLocalProductImages } from "@/lib/imageStorage";
import type { Product } from "@/types";
import toast from "react-hot-toast";

const REVIEWS = [
  { user:"Marcus T.",  rating:5, date:"Nov 15, 2024", verified:true,  comment:"Exceptional quality. The leather improves with age — far better than anything else I have owned. Every detail is perfect." },
  { user:"Sarah K.",   rating:5, date:"Nov 20, 2024", verified:true,  comment:"Survived 3 weeks of constant travel without a scratch. Completely worth every penny." },
  { user:"David L.",   rating:4, date:"Dec 01, 2024", verified:true,  comment:"Stunning in person. Hardware quality is unmatched. Took a week to break in but now it is perfect." },
  { user:"Priya M.",   rating:5, date:"Dec 05, 2024", verified:true,  comment:"Got this as a gift and have not stopped using it. The attention to detail is incredible." },
];

export function ProductDetailClient({ product: initialProduct }: { product: Product }) {
  const [product, setProduct]   = useState(initialProduct);
  const [qty, setQty]           = useState(1);
  const [activeImg, setImg]     = useState(0);
  const [tab, setTab]           = useState<"details"|"specs"|"reviews">("details");
  const [zoomed, setZoomed]     = useState(false);
  const [addingCart, setAddCart]= useState(false);

  const addToCart           = useStore(s => s.addToCart);
  const toggleWishlist      = useStore(s => s.toggleWishlist);
  const isWishlisted        = useStore(s => s.isWishlisted(product.id));
  const addToRecentlyViewed = useStore(s => s.addToRecentlyViewed);
  const recentlyViewed      = useStore(s => s.recentlyViewed);

  useEffect(() => {
    addToRecentlyViewed(product);
    if (product.images.length === 0) {
      const local = getLocalProductImages(product.id);
      if (local.length > 0) setProduct(p => ({ ...p, images: local }));
    }
  }, []); // eslint-disable-line

  const recs = getRecommendations({ current: product, viewed: recentlyViewed, limit: 4 });

  const galleryImages = product.images.length > 0
    ? product.images.map(img => img.url)
    : [0,1,2,3].map(i => getProductImageUrl(product, i, 800, 800));
  while (galleryImages.length < 4) {
    galleryImages.push(getProductImageUrl(product, galleryImages.length, 800, 800));
  }

  const primaryImage = galleryImages[activeImg] ?? galleryImages[0];
  const isBase64     = (url: string) => url.startsWith("data:");
  const discount     = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const specs = [
    { k:"Material",      v:product.material },
    { k:"Color",         v:product.color },
    { k:"Size",          v:product.size },
    { k:"Capacity",      v:`${product.capacity}L` },
    { k:"Laptop Fit",    v:product.laptopFit ?? "None" },
    { k:"Weight",        v:"~0.9 kg" },
    { k:"Water Resist.", v:"Water-Resistant Coating" },
    { k:"Availability",  v:product.stock < 10 ? `Only ${product.stock} left` : "In Stock" },
    { k:"SKU",           v:`VLT-${product.id.toString().padStart(4,"0")}` },
    { k:"Warranty",      v:"Lifetime Structural" },
  ];

  async function handleAdd() {
    if (addingCart) return;
    setAddCart(true);
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`, { icon:"🛍️" });
    setTimeout(() => setAddCart(false), 1200);
  }

  function handleWish() {
    toggleWishlist(product.id);
    toast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist",
      { icon: isWishlisted ? "💔" : "❤️" });
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  }

  return (
    <div className="min-h-screen" style={{ background:"var(--bg)" }}>
      <div className="container py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-8" style={{ color:"var(--text-muted)" }}>
          <Link href="/home" className="hover:opacity-70 transition-opacity">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:opacity-70 transition-opacity">Shop</Link>
          <ChevronRight size={12} />
          <Link href={`/shop?cat=${product.category}`}
            className="hover:opacity-70 transition-opacity">{product.category}</Link>
          <ChevronRight size={12} />
          <span style={{ color:"var(--text)", fontWeight:500 }}>{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-20">

          {/* ── Gallery ── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden cursor-zoom-in group"
              style={{ height:"520px", background:"var(--bg-subtle)", border:"1px solid var(--border)" }}
              onClick={() => setZoomed(true)}>
              <Image src={primaryImage} alt={product.name} fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width:1024px) 100vw, 50vw" priority
                unoptimized={isBase64(primaryImage)} />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {discount > 0 && <span className="badge badge-red">-{discount}%</span>}
                {product.trending && <span className="badge badge-amber">🔥 Trending</span>}
              </div>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background:"rgba(0,0,0,0.5)", color:"#fff", backdropFilter:"blur(8px)" }}>
                {activeImg+1} / {galleryImages.length}
              </div>

              {/* Zoom hint */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                style={{ background:"rgba(255,255,255,0.9)", backdropFilter:"blur(8px)" }}>
                <ZoomIn size={16} style={{ color:"var(--text)" }} />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2.5">
              {galleryImages.slice(0,4).map((src,i) => (
                <button key={i} onClick={() => setImg(i)}
                  className="relative rounded-2xl overflow-hidden transition-all duration-200"
                  style={{
                    height:"88px",
                    border:`2px solid ${activeImg===i ? "var(--gold)" : "var(--border)"}`,
                    boxShadow: activeImg===i ? "0 0 0 3px rgba(184,134,11,0.15)" : "none",
                  }}>
                  <Image src={src} alt={`View ${i+1}`} fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="100px" unoptimized={isBase64(src)} />
                </button>
              ))}
            </div>

            {product.images.length === 0 && (
              <p className="text-center text-[10px]" style={{ color:"var(--text-faint)" }}>
                Placeholder images — upload real photos in Admin Panel
              </p>
            )}
          </div>

          {/* ── Product Info ── */}
          <div>
            {/* Category + share */}
            <div className="flex items-center justify-between mb-3">
              <span className="label">{product.category}</span>
              <button onClick={handleShare} className="btn-icon btn-sm flex items-center gap-1.5">
                <Share2 size={15} />
              </button>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black font-serif leading-tight mb-4"
              style={{ color:"var(--text)" }}>
              {product.name}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-4 mb-5 pb-5" style={{ borderBottom:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({length:5}).map((_,i) => (
                    <Star key={i} size={16}
                      className={i<Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color:"var(--text)" }}>{product.rating}</span>
                <span className="text-sm" style={{ color:"var(--text-muted)" }}>
                  ({product.reviewCount} reviews)
                </span>
              </div>
              <span className="badge badge-green flex items-center gap-1">
                <Check size={10} />In Stock
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-5xl font-black font-serif" style={{ color:"var(--text)" }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl line-through" style={{ color:"var(--text-faint)" }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="badge badge-red text-sm">Save {formatPrice(product.originalPrice - product.price)}</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed mb-6" style={{ color:"var(--text-sec)" }}>
              {product.description}
            </p>

            {/* Mini specs */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {specs.slice(0,6).map(s => (
                <div key={s.k} className="rounded-xl px-3.5 py-3"
                  style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                    style={{ color:"var(--text-faint)" }}>{s.k}</p>
                  <p className="text-sm font-semibold"
                    style={{ color: s.k==="Availability" && product.stock<10 ? "#DC2626" : "var(--text)" }}>
                    {s.v}
                  </p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-7">
              {product.tags.map(t => <span key={t} className="badge badge-gold">{t}</span>)}
            </div>

            {/* Qty + CTA */}
            <div className="flex gap-3 mb-4">
              <div className="flex items-center rounded-xl overflow-hidden"
                style={{ border:"1.5px solid var(--border)", background:"var(--bg-card)" }}>
                <button onClick={() => setQty(q => Math.max(1,q-1))}
                  className="w-12 h-14 flex items-center justify-center transition-colors hover:opacity-60"
                  style={{ color:"var(--text)" }}>
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-black text-lg" style={{ color:"var(--text)" }}>
                  {qty}
                </span>
                <button onClick={() => setQty(q => q+1)}
                  className="w-12 h-14 flex items-center justify-center transition-colors hover:opacity-60"
                  style={{ color:"var(--text)" }}>
                  <Plus size={16} />
                </button>
              </div>

              <button onClick={handleAdd} disabled={addingCart}
                className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm transition-all duration-250"
                style={{
                  background: addingCart ? "var(--gold-hover)" : "var(--gold)",
                  color: "#fff",
                  boxShadow: "var(--shadow-gold)",
                  opacity: addingCart ? 0.8 : 1,
                }}>
                {addingCart ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white spin" />
                  Adding...</>
                ) : (
                  <><ShoppingBag size={18} />Add to Cart — {formatPrice(product.price * qty)}</>
                )}
              </button>

              <button onClick={handleWish}
                className="w-14 h-14 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: isWishlisted ? "#FEE2E2" : "var(--bg-card)",
                  border: `1.5px solid ${isWishlisted ? "#FECACA" : "var(--border)"}`,
                }}>
                <Heart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 py-5 mt-2"
              style={{ borderTop:"1px solid var(--border)" }}>
              {[
                { Icon:Shield,    l:"Lifetime Warranty", sub:"Structural" },
                { Icon:RotateCcw, l:"Free Returns",      sub:"30 days" },
                { Icon:Truck,     l:"Free Shipping",     sub:"Orders $150+" },
              ].map(g => (
                <div key={g.l} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl transition-all"
                  style={{ background:"var(--bg-subtle)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background:"var(--gold-pale)" }}>
                    <g.Icon size={15} style={{ color:"var(--gold)" }} />
                  </div>
                  <p className="text-xs font-bold" style={{ color:"var(--text)" }}>{g.l}</p>
                  <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>{g.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex p-1 rounded-2xl w-fit mb-10"
            style={{ background:"var(--bg-white)", border:"1px solid var(--border)" }}>
            {(["details","specs","reviews"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-7 py-3 rounded-xl text-sm font-semibold capitalize transition-all"
                style={{
                  background: tab===t ? "var(--gold)" : "transparent",
                  color:      tab===t ? "#fff"        : "var(--text-muted)",
                  boxShadow:  tab===t ? "var(--shadow-gold)" : "none",
                }}>
                {t}{t==="reviews" && ` (${REVIEWS.length})`}
              </button>
            ))}
          </div>

          {tab==="details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold font-serif mb-5">About This Bag</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color:"var(--text-sec)" }}>
                  {product.description}
                </p>
                <div className="space-y-3">
                  {["Premium certified materials","Hand-inspected quality control","Lifetime structural warranty","YKK premium hardware","Reinforced stitching at stress points","Water-resistant treatment"].map(f => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background:"var(--gold-pale)" }}>
                        <Check size={11} style={{ color:"var(--gold)" }} />
                      </div>
                      <span className="text-sm" style={{ color:"var(--text-sec)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-serif mb-5">In the Box</h3>
                <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
                  {[`1× ${product.name}`,"Dust bag (natural cotton)","Care & warranty card","VAULTA authenticity tag","Free return shipping label"].map((item,i) => (
                    <div key={item} className="flex items-center gap-3 px-5 py-4"
                      style={{ borderBottom:i<4?"1px solid var(--border)":"none",
                               background:i%2===0?"var(--bg-card)":"var(--bg-subtle)" }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:"var(--gold)" }} />
                      <span className="text-sm" style={{ color:"var(--text-sec)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab==="specs" && (
            <div className="max-w-2xl rounded-3xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
              {specs.map((s,i) => (
                <div key={s.k} className="flex justify-between items-center px-6 py-4"
                  style={{ borderBottom:i<specs.length-1?"1px solid var(--border)":"none",
                           background:i%2===0?"var(--bg-card)":"var(--bg-subtle)" }}>
                  <span className="text-sm font-medium" style={{ color:"var(--text-muted)" }}>{s.k}</span>
                  <span className="text-sm font-semibold"
                    style={{ color:s.k==="Availability"&&product.stock<10?"#DC2626":"var(--text)" }}>
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tab==="reviews" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 p-8 rounded-3xl"
                style={{ background:"var(--bg-white)", border:"1px solid var(--border)" }}>
                <div className="text-center">
                  <p className="text-7xl font-black font-serif mb-2" style={{ color:"var(--text)" }}>
                    {product.rating}
                  </p>
                  <div className="flex justify-center gap-0.5 mb-2">
                    {Array.from({length:5}).map((_,i) => (
                      <Star key={i} size={18} className={i<Math.floor(product.rating)?"fill-amber-400 text-amber-400":"fill-gray-200 text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-sm" style={{ color:"var(--text-muted)" }}>{product.reviewCount} reviews</p>
                </div>
                <div className="space-y-2.5">
                  {[5,4,3,2,1].map(star => {
                    const pct = star===5?72:star===4?20:star===3?5:star===2?2:1;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-xs w-3 text-right" style={{ color:"var(--text-muted)" }}>{star}</span>
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:"var(--bg-muted)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background:"#FBBF24" }} />
                        </div>
                        <span className="text-xs w-8" style={{ color:"var(--text-muted)" }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {REVIEWS.map((r,i) => (
                <div key={i} className="p-6 rounded-2xl" style={{ background:"var(--bg-white)", border:"1px solid var(--border)" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center font-black"
                        style={{ background:"var(--gold-pale)", color:"var(--gold)" }}>
                        {r.user[0]}
                      </div>
                      <div>
                        <p className="font-bold" style={{ color:"var(--text)" }}>{r.user}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({length:5}).map((_,j) => (
                            <Star key={j} size={12} className={j<r.rating?"fill-amber-400 text-amber-400":"fill-gray-200 text-gray-200"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs" style={{ color:"var(--text-faint)" }}>{r.date}</span>
                      {r.verified && (
                        <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                          <Check size={10} />Verified Purchase
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color:"var(--text-sec)" }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        {recs.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black"
                style={{ background:"var(--gold)", color:"#fff" }}>AI</div>
              <div>
                <p className="label">AI-Powered</p>
                <h2 className="text-3xl font-black font-serif">You May Also Like</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recs.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Zoom overlay */}
      {zoomed && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-8"
          style={{ background:"rgba(0,0,0,0.9)", backdropFilter:"blur(8px)" }}
          onClick={() => setZoomed(false)}>
          <div className="relative w-full max-w-3xl aspect-square rounded-3xl overflow-hidden">
            <Image src={primaryImage} alt={product.name} fill className="object-cover"
              sizes="800px" unoptimized={isBase64(primaryImage)} />
          </div>
          <button className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white"
            style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)" }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
