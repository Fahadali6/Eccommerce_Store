"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Shield, ChevronRight } from "lucide-react";
import { useStore, useCartTotals } from "@/context/store";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { getLocalProductImages } from "@/lib/imageStorage";
import type { CartItem } from "@/types";
import toast from "react-hot-toast";

export default function CartPage() {
  const cart        = useStore(s => s.cart);
  const removeFromCart = useStore(s => s.removeFromCart);
  const updateQty   = useStore(s => s.updateQty);
  const couponCode  = useStore(s => s.couponCode);
  const discount    = useStore(s => s.discount);
  const applyCoupon = useStore(s => s.applyCoupon);
  const clearCoupon = useStore(s => s.clearCoupon);
  const { subtotal, shipping, discountAmt, total } = useCartTotals();
  const [couponInput, setCouponInput] = useState("");
  const [enrichedCart, setEnrichedCart] = useState<CartItem[]>([]);

  // Load locally-stored images for cart items (dev mode)
  useEffect(() => {
    const enriched = cart.map(item => {
      if (item.images && item.images.length > 0) return item;
      const local = getLocalProductImages(item.id);
      return local.length > 0 ? { ...item, images: local } : item;
    });
    setEnrichedCart(enriched);
  }, [cart]);

  function handleCoupon() {
    const result = applyCoupon(couponInput);
    if (result === "ok") toast.success("Coupon applied!");
    else toast.error("Invalid coupon code");
  }

  const displayCart = enrichedCart.length > 0 ? enrichedCart : cart;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen section-subtle pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background:"var(--bg-muted)" }}>
            <ShoppingBag size={40} style={{ color:"var(--text-faint)" }} />
          </div>
          <h2 className="text-3xl font-bold font-serif mb-3" style={{ color:"var(--text)" }}>Your cart is empty</h2>
          <p className="text-sm mb-8" style={{ color:"var(--text-muted)" }}>Discover our premium bag collection.</p>
          <Link href="/shop" className="btn-gold">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-subtle pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-8 pt-4" style={{ color:"var(--text-muted)" }}>
          <Link href="/home" className="hover:opacity-70">Home</Link>
          <ChevronRight size={12} />
          <span style={{ color:"var(--text)" }}>Cart</span>
        </nav>

        <h1 className="text-5xl font-black font-serif mb-10">Your Cart</h1>

        <div className="grid grid-cols-[1fr_360px] gap-8">
          {/* Items */}
          <div className="card-flat section-white rounded-2xl overflow-hidden"
               style={{ border:"1px solid var(--border)" }}>
            {displayCart.map(item => {
              const imgSrc   = getProductImageUrl(item, 0, 200, 200);
              const isBase64 = imgSrc.startsWith("data:");
              return (
                <div key={item.id} className="flex gap-5 p-6" style={{ borderBottom:"1px solid var(--border)" }}>
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background:"var(--bg-subtle)" }}>
                    <Image
                      src={imgSrc}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized={isBase64}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="label mb-1" style={{ fontSize:"9px" }}>{item.category}</p>
                    <h3 className="font-bold font-serif truncate mb-1"
                      style={{ color:"var(--text)", fontSize:"15px" }}>{item.name}</h3>
                    <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                      {item.material} · {item.color}
                    </p>
                    <p className="text-sm font-bold mt-2" style={{ color:"var(--text)" }}>
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <p className="font-bold text-lg" style={{ color:"var(--text)" }}>
                      {formatPrice(item.price * item.qty)}
                    </p>
                    <div className="flex items-center rounded-lg overflow-hidden card-flat">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-9 h-8 flex items-center justify-center hover:opacity-60 transition-opacity"
                        style={{ color:"var(--text)" }}>
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold"
                        style={{ color:"var(--text)" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-9 h-8 flex items-center justify-center hover:opacity-60 transition-opacity"
                        style={{ color:"var(--text)" }}>
                        <Plus size={13} />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="card-flat section-white rounded-2xl p-6">
              <h2 className="font-bold font-serif text-lg mb-5" style={{ color:"var(--text)" }}>
                Order Summary
              </h2>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span style={{ color:"var(--text-sec)" }}>Subtotal</span>
                  <span style={{ color:"var(--text)" }}>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Discount ({(discount * 100).toFixed(0)}%)</span>
                    <span className="text-emerald-600">-{formatPrice(discountAmt)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span style={{ color:"var(--text-sec)" }}>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}
                    style={{ color: shipping === 0 ? undefined : "var(--text)" }}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                {subtotal < 150 && (
                  <p className="text-xs p-2.5 rounded-lg"
                    style={{ background:"var(--bg-subtle)", color:"var(--text-muted)" }}>
                    Add {formatPrice(150 - subtotal)} more for free shipping
                  </p>
                )}
                <div className="divider" />
                <div className="flex justify-between font-bold">
                  <span style={{ color:"var(--text)" }}>Total</span>
                  <span className="text-xl font-black font-serif"
                    style={{ color:"var(--text)" }}>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-5">
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background:"#D1FAE5", border:"1px solid #6EE7B7" }}>
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                      <Tag size={13} />{couponCode} applied
                    </div>
                    <button onClick={clearCoupon}
                      className="text-xs text-emerald-600 hover:opacity-70">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === "Enter" && handleCoupon()}
                      placeholder="Coupon code"
                      className="input flex-1 text-sm py-2.5"
                    />
                    <button onClick={handleCoupon}
                      className="btn-outline text-sm"
                      style={{ padding:"10px 16px" }}>
                      Apply
                    </button>
                  </div>
                )}
                <p className="text-[10px] mt-1.5 ml-1" style={{ color:"var(--text-faint)" }}>
                  Try: VAULTA20 or FIRST10
                </p>
              </div>

              <Link href="/checkout"
                className="btn-gold w-full flex items-center justify-center gap-2 mb-3 text-sm">
                <ShoppingBag size={15} />Proceed to Checkout
              </Link>
              <Link href="/shop"
                className="btn-ghost w-full flex items-center justify-center text-sm">
                Continue Shopping
              </Link>
            </div>

            {/* Trust badges */}
            <div className="card-flat section-white rounded-2xl p-5 grid grid-cols-3 gap-3">
              {[
                { icon:Shield,      l:"Warranty" },
                { icon:Tag,         l:"Best Price" },
                { icon:ShoppingBag, l:"Easy Returns" },
              ].map(f => (
                <div key={f.l} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background:"var(--gold-pale)" }}>
                    <f.icon size={14} style={{ color:"var(--gold)" }} />
                  </div>
                  <p className="text-[10px] font-medium" style={{ color:"var(--text-sec)" }}>
                    {f.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
