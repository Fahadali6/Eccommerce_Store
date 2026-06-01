"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Eye, Zap } from "lucide-react";
import { useStore } from "@/context/store";
import { cn, formatPrice, getProductImageUrl } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

interface Props {
  product:   Product;
  compact?:  boolean;
  priority?: boolean;
}

export function ProductCard({ product, compact = false, priority = false }: Props) {
  const [hovered,  setHovered]  = useState(false);
  const [imgError, setImgError] = useState(false);
  const [adding,   setAdding]   = useState(false);

  const addToCart           = useStore(s => s.addToCart);
  const toggleWishlist      = useStore(s => s.toggleWishlist);
  const isWishlisted        = useStore(s => s.isWishlisted(product.id));
  const addToRecentlyViewed = useStore(s => s.addToRecentlyViewed);

  const imgSrc   = imgError
    ? `https://picsum.photos/seed/vaulta${product.imageId}/600/600`
    : getProductImageUrl(product, 0, 600, 600);
  const isBase64 = imgSrc.startsWith("data:");

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    addToCart(product, 1);
    toast.success(`${product.name} added!`, { icon: "🛍️" });
    setTimeout(() => setAdding(false), 1200);
  }

  function handleWish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      icon: isWishlisted ? "💔" : "❤️",
    });
  }

  const productUrl = `/product/${product.slug}`;

  return (
    <div
      className="product-card group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image container — plain div, NOT a Link ── */}
      {/* Buttons are siblings here, NOT nested inside <a> */}
      <div
        className={cn("card-img relative", compact ? "h-48" : "h-64")}
        style={{ background:"var(--bg-subtle)" }}
      >
        {/* Clickable image area — the only <a> in this block */}
        <Link
          href={productUrl}
          onClick={() => addToRecentlyViewed(product)}
          className="absolute inset-0 block z-0"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            unoptimized={isBase64}
            onError={() => setImgError(true)}
          />
        </Link>

        {/* Gradient overlay — non-interactive, above image, below buttons */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-[1]"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* ── Badges top-left — z-[2] so they sit above overlay ── */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-[2] pointer-events-none">
          {discount > 0 && (
            <span className="badge badge-red">-{discount}%</span>
          )}
          {product.trending && (
            <span className="badge badge-amber flex items-center gap-1">
              <Zap size={9} className="fill-current" />Trending
            </span>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="badge badge-red">Only {product.stock} left</span>
          )}
          {product.stock === 0 && (
            <span className="badge badge-gray">Sold Out</span>
          )}
        </div>

        {/* ── Action buttons top-right — z-[2], pointer-events-auto ── */}
        {/* These are siblings of the <Link>, NOT inside it — no nested <a> */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-[2]">
          {/* Wishlist — button, not a link */}
          <button
            type="button"
            onClick={handleWish}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm"
            style={{
              background:   isWishlisted ? "#FEE2E2" : "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
              border:       isWishlisted ? "1px solid #FECACA" : "1px solid rgba(255,255,255,0.5)",
              transform:    hovered ? "translateX(0) scale(1)" : "translateX(8px) scale(0.9)",
              opacity:      hovered ? 1 : 0,
              transitionDelay: "0ms",
            }}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={14} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"} />
          </button>

          {/* Quick view — a separate Link at z-[2], sibling of the image Link */}
          <Link
            href={productUrl}
            onClick={e => e.stopPropagation()}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm"
            style={{
              background:   "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
              border:       "1px solid rgba(255,255,255,0.5)",
              transform:    hovered ? "translateX(0) scale(1)" : "translateX(8px) scale(0.9)",
              opacity:      hovered ? 1 : 0,
              transitionDelay: "60ms",
            }}
            title="Quick view"
            aria-label="Quick view"
          >
            <Eye size={14} className="text-gray-600" />
          </Link>
        </div>

        {/* ── Quick add to cart — bottom overlay, z-[2] ── */}
        <div
          className="absolute inset-x-0 bottom-0 px-3 pb-3 z-[2] transition-all duration-300"
          style={{
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            opacity:   hovered ? 1 : 0,
          }}
        >
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding || product.stock === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background:   adding ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.92)",
              color:        "var(--text)",
              backdropFilter: "blur(12px)",
              boxShadow:    "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            {adding ? (
              <>
                <span className="spin inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full" />
                Adding...
              </>
            ) : product.stock === 0 ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingBag size={15} />
                Quick Add — {formatPrice(product.price)}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Product info ── */}
      <div className={cn("p-4", compact && "p-3")} style={{ background:"var(--bg-card)" }}>

        {/* Category + Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="label" style={{ fontSize:"10px" }}>{product.category}</span>
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length:5 }).map((_,i) => (
                <Star key={i} size={10}
                  className={i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"}
                />
              ))}
            </div>
            <span className="text-[10px] font-medium" style={{ color:"var(--text-muted)" }}>
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Product name link */}
        <Link
          href={productUrl}
          onClick={() => addToRecentlyViewed(product)}
        >
          <h3
            className={cn("font-bold font-serif leading-tight mb-1.5 transition-colors duration-200",
              compact ? "text-sm" : "text-[15px]")}
            style={{ color: hovered ? "var(--gold)" : "var(--text)" }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Material */}
        {!compact && (
          <p className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>
            {product.material} · {product.color}
          </p>
        )}

        {/* Tags */}
        {!compact && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0,3).map(tag => (
              <span key={tag} className="badge badge-gray" style={{ fontSize:"10px" }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Price + add button */}
        <div className="flex items-center justify-between pt-1"
          style={{ borderTop:"1px solid var(--border)" }}>
          <div className="flex items-baseline gap-2">
            <span
              className={cn("font-black", compact ? "text-base" : "text-lg")}
              style={{ color:"var(--text)", fontFamily:"'Playfair Display',serif" }}
            >
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through" style={{ color:"var(--text-faint)" }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={adding || product.stock === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
            style={{
              background: hovered ? "var(--gold)"      : "var(--gold-pale)",
              color:      hovered ? "#fff"             : "var(--gold)",
              boxShadow:  hovered ? "var(--shadow-gold)" : "none",
            }}
          >
            <ShoppingBag size={12} />
            {!compact && "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
