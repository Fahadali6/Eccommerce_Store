"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useStore } from "@/context/store";
import { ProductCard } from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/data";

export default function WishlistPage() {
  const wishlist = useStore(s => s.wishlist);
  const products = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen section-subtle pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center gap-4 mb-12 pt-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background:"#FEE2E2" }}>
            <Heart size={22} className="fill-red-400 text-red-400" />
          </div>
          <div>
            <h1 className="text-5xl font-black font-serif" style={{ color:"var(--text)" }}>Wishlist</h1>
            <p className="text-sm mt-0.5" style={{ color:"var(--text-muted)" }}>
              {products.length} saved {products.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background:"var(--bg-muted)" }}>
              <Heart size={40} style={{ color:"var(--text-faint)" }} />
            </div>
            <h2 className="text-2xl font-bold font-serif mb-3" style={{ color:"var(--text)" }}>Nothing saved yet</h2>
            <p className="text-sm mb-8" style={{ color:"var(--text-muted)" }}>
              Tap the heart icon on any product to save it here.
            </p>
            <Link href="/shop" className="btn-gold">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
