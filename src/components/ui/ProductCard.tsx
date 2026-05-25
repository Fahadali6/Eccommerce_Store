"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useStore } from "@/context/store";
import { cn, formatPrice, getProductImageUrl } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const addToCart           = useStore(s => s.addToCart);
  const toggleWishlist      = useStore(s => s.toggleWishlist);
  const isWishlisted        = useStore(s => s.isWishlisted(product.id));
  const addToRecentlyViewed = useStore(s => s.addToRecentlyViewed);

  const imgSrc = getProductImageUrl(product, 0, 600, 600);
  const isBase64 = imgSrc.startsWith("data:");

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`, { icon: "🛍️" });
  }
  function handleWish(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(product.id);
    toast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist", {
      icon: isWishlisted ? "💔" : "♥",
    });
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="card rounded-2xl overflow-hidden group"
      style={{ transform: hovered ? "translateY(-4px)" : "translateY(0)", cursor: "pointer" }}
    >
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        onClick={() => addToRecentlyViewed(product)}
        className={cn("block relative overflow-hidden", compact ? "h-44" : "h-60")}
        style={{ background: "var(--bg-subtle)" }}
      >
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className={cn("object-cover transition-transform duration-500", hovered && "scale-105")}
          sizes="(max-width:768px) 100vw, 33vw"
          unoptimized={isBase64}
        />
        <div className={cn(
          "absolute inset-0 bg-black/10 transition-opacity duration-300",
          hovered ? "opacity-100" : "opacity-0"
        )} />

        {/* Badges */}
        {product.stock < 10 && (
          <span className="badge badge-red absolute top-3 left-3 z-10">Only {product.stock} left</span>
        )}
        {product.trending && (
          <span className="badge badge-amber absolute top-3 right-10 z-10">Trending</span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full z-10"
            style={{ background: "#16A34A", color: "#fff" }}>
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        )}

        {/* Wishlist */}
        <button onClick={handleWish}
          className={cn(
            "absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm",
            isWishlisted ? "bg-red-50 border border-red-200" : "bg-white/90 border border-white/60 hover:bg-white"
          )}>
          <Heart size={13} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </Link>

      {/* Info */}
      <div className={cn("p-4 section-white", compact && "p-3")}>
        <Link href={`/product/${product.slug}`} onClick={() => addToRecentlyViewed(product)}>
          <p className="label mb-1" style={{ fontSize: "10px" }}>{product.category}</p>
          <h3 className={cn("font-bold font-serif leading-tight mb-2", compact ? "text-sm" : "text-[15px]")}
            style={{ color: "var(--text)" }}>
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11}
                className={i < Math.floor(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-200 fill-gray-200"} />
            ))}
          </div>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} className="badge badge-gray text-[10px]">{tag}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className={cn("font-bold", compact ? "text-base" : "text-lg")} style={{ color: "var(--text)" }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through" style={{ color: "var(--text-faint)" }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button onClick={handleAdd}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-250",
              hovered ? "btn-gold" : "btn-ghost border"
            )}
            style={hovered ? {} : { borderColor: "var(--border-dark)" }}>
            <ShoppingBag size={12} />
            {!compact && "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
