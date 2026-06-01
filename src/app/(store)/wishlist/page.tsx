"use client";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useStore } from "@/context/store";
import { ProductCard } from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/data";

export default function WishlistPage() {
  const wishlist = useStore(s => s.wishlist);
  const products = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen py-10" style={{ background:"var(--bg)" }}>
      <div className="container">
        <div className="flex items-center gap-5 mb-12">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background:"#FEE2E2", border:"1px solid #FECACA" }}>
            <Heart size={26} className="fill-red-400 text-red-400" />
          </div>
          <div>
            <h1 className="text-5xl font-black font-serif" style={{ color:"var(--text)" }}>
              Wishlist
            </h1>
            <p className="text-sm mt-1" style={{ color:"var(--text-muted)" }}>
              {products.length} saved {products.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-8"
              style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)" }}>
              <Heart size={48} style={{ color:"var(--text-faint)" }} />
            </div>
            <h2 className="text-3xl font-bold font-serif mb-4" style={{ color:"var(--text)" }}>
              Nothing saved yet
            </h2>
            <p className="text-base mb-10 max-w-sm" style={{ color:"var(--text-sec)" }}>
              Tap the heart icon on any product to save it here for later.
            </p>
            <Link href="/shop" className="btn-gold btn-lg inline-flex items-center gap-2">
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="mt-10 text-center">
              <Link href="/shop" className="btn-outline inline-flex items-center gap-2">
                Continue Shopping <ArrowRight size={15} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
