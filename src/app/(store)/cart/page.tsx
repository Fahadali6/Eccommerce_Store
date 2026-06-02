"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Shield, Truck, RotateCcw, ArrowRight, ChevronRight } from "lucide-react";
import { useStore, useCartTotals } from "@/context/store";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { getLocalProductImages } from "@/lib/imageStorage";
import type { CartItem } from "@/types";
import toast from "react-hot-toast";

export default function CartPage() {
  const cart           = useStore(s => s.cart);
  const removeFromCart = useStore(s => s.removeFromCart);
  const updateQty      = useStore(s => s.updateQty);
  const couponCode     = useStore(s => s.couponCode);
  const discount       = useStore(s => s.discount);
  const applyCoupon    = useStore(s => s.applyCoupon);
  const clearCoupon    = useStore(s => s.clearCoupon);
  const { subtotal, shipping, discountAmt, total } = useCartTotals();
  const [couponInput, setCouponInput] = useState("");
  const [enriched, setEnriched]       = useState<CartItem[]>([]);

  useEffect(() => {
    setEnriched(cart.map(item => {
      if (item.images?.length > 0) return item;
      const local = getLocalProductImages(item.id);
      return local.length > 0 ? { ...item, images: local } : item;
    }));
  }, [cart]);

  const displayCart = enriched.length > 0 ? enriched : cart;

  function handleCoupon() {
    const result = applyCoupon(couponInput);
    if (result === "ok") toast.success(`Coupon applied! ${(discount * 100).toFixed(0)}% off`);
    else toast.error("Invalid coupon code. Try VAULTA20, FIRST10, or SAVE15");
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20"
        style={{ background:"var(--bg)" }}>
        <div className="text-center max-w-md px-6">
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-8"
            style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)" }}>
            <ShoppingBag size={48} style={{ color:"var(--text-faint)" }} />
          </div>
          <h2 className="text-4xl font-black font-serif mb-4" style={{ color:"var(--text)" }}>
            Your cart is empty
          </h2>
          <p className="text-base mb-10" style={{ color:"var(--text-sec)" }}>
            Discover our premium bag collection — crafted for extraordinary lives.
          </p>
          <Link href="/shop" className="btn-gold btn-lg inline-flex items-center gap-2">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10" style={{ background:"var(--bg)" }}>
      <div className="container">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-8" style={{ color:"var(--text-muted)" }}>
          <Link href="/home" className="hover:opacity-70">Home</Link>
          <ChevronRight size={12} />
          <span style={{ color:"var(--text)", fontWeight:500 }}>Cart</span>
        </nav>

        <div className="flex items-center justify-between mb-10">
          <h1 className="text-5xl font-black font-serif" style={{ color:"var(--text)" }}>
            Your Cart
          </h1>
          <span className="badge badge-gold text-sm">
            {cart.reduce((a,i)=>a+i.qty,0)} items
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* Items */}
          <div className="space-y-4">
            {displayCart.map(item => {
              const imgSrc   = getProductImageUrl(item, 0, 200, 200);
              const isBase64 = imgSrc.startsWith("data:");
              return (
                <div key={item.id}
                  className="flex gap-5 p-5 rounded-3xl transition-all duration-200"
                  style={{
                    background: "var(--bg-white)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xs)"}
                >
                  {/* Image */}
                  <Link href={`/product/${item.slug}`}
                    className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0"
                    style={{ background:"var(--bg-subtle)" }}>
                    <Image src={imgSrc} alt={item.name} fill className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="112px" unoptimized={isBase64} />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="label" style={{ fontSize:"9px" }}>{item.category}</span>
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="font-bold font-serif text-base mt-1 mb-1 hover:opacity-80 transition-opacity"
                        style={{ color:"var(--text)" }}>{item.name}</h3>
                    </Link>
                    <p className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>
                      {item.material} · {item.color} · {item.size}
                    </p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <p className="font-black text-lg font-serif" style={{ color:"var(--text)" }}>
                        {formatPrice(item.price * item.qty)}
                        <span className="text-sm font-normal ml-1.5" style={{ color:"var(--text-muted)" }}>
                          ({formatPrice(item.price)} each)
                        </span>
                      </p>
                      <div className="flex items-center gap-3">
                        {/* Qty */}
                        <div className="flex items-center rounded-xl overflow-hidden"
                          style={{ border:"1.5px solid var(--border)" }}>
                          <button onClick={() => updateQty(item.id, item.qty-1)}
                            className="w-9 h-9 flex items-center justify-center hover:opacity-60 transition-opacity"
                            style={{ color:"var(--text)" }}>
                            <Minus size={13} />
                          </button>
                          <span className="w-9 text-center text-sm font-bold" style={{ color:"var(--text)" }}>
                            {item.qty}
                          </span>
                          <button onClick={() => updateQty(item.id, item.qty+1)}
                            className="w-9 h-9 flex items-center justify-center hover:opacity-60 transition-opacity"
                            style={{ color:"var(--text)" }}>
                            <Plus size={13} />
                          </button>
                        </div>
                        {/* Remove */}
                        <button onClick={() => { removeFromCart(item.id); toast("Item removed", { icon:"🗑" }); }}
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                          style={{ background:"var(--bg-subtle)", color:"var(--text-muted)" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#FEE2E2"; (e.currentTarget as HTMLElement).style.color = "#DC2626"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-subtle)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue shopping */}
            <Link href="/shop"
              className="flex items-center gap-2 py-4 px-5 rounded-2xl text-sm font-semibold transition-all"
              style={{ color:"var(--gold)", background:"var(--gold-pale)", border:"1px solid var(--gold-border)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.8"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}>
              ← Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="rounded-3xl p-7"
              style={{ background:"var(--bg-white)", border:"1px solid var(--border)", boxShadow:"var(--shadow-sm)" }}>
              <h2 className="text-xl font-black font-serif mb-6" style={{ color:"var(--text)" }}>
                Order Summary
              </h2>

              {/* Coupon */}
              <div className="mb-5">
                {couponCode ? (
                  <div className="flex items-center justify-between p-3.5 rounded-xl"
                    style={{ background:"#D1FAE5", border:"1px solid #6EE7B7" }}>
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                      <Tag size={14} />{couponCode} — {(discount*100).toFixed(0)}% off!
                    </div>
                    <button onClick={clearCoupon} className="text-xs text-emerald-600 hover:opacity-70">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key==="Enter" && handleCoupon()}
                      placeholder="Enter coupon code"
                      className="input flex-1 text-sm" />
                    <button onClick={handleCoupon}
                      className="btn-outline text-sm px-4 flex-shrink-0">Apply</button>
                  </div>
                )}
                <p className="text-[10px] mt-2 ml-1" style={{ color:"var(--text-faint)" }}>
                  Try: VAULTA20, FIRST10, SAVE15
                </p>
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span style={{ color:"var(--text-sec)" }}>
                    Subtotal ({cart.reduce((a,i)=>a+i.qty,0)} items)
                  </span>
                  <span style={{ color:"var(--text)" }}>{formatPrice(subtotal)}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600 font-semibold">Discount ({(discount*100).toFixed(0)}% off)</span>
                    <span className="text-emerald-600 font-semibold">-{formatPrice(discountAmt)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span style={{ color:"var(--text-sec)" }}>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-semibold">Free 🎉</span>
                  ) : (
                    <span style={{ color:"var(--text)" }}>{formatPrice(shipping)}</span>
                  )}
                </div>
                {subtotal < 150 && (
                  <div className="py-2.5 px-3.5 rounded-xl text-xs"
                    style={{ background:"var(--gold-pale)", border:"1px solid var(--gold-border)", color:"var(--gold)" }}>
                    🚚 Add {formatPrice(150-subtotal)} more for FREE shipping!
                  </div>
                )}
              </div>

              <div className="divider mb-5" />
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg" style={{ color:"var(--text)" }}>Total</span>
                <span className="text-3xl font-black font-serif" style={{ color:"var(--text)" }}>
                  {formatPrice(total)}
                </span>
              </div>

              <Link href="/checkout" className="btn-gold w-full flex items-center justify-center gap-2 btn-lg mb-3">
                <ShoppingBag size={18} />Checkout — {formatPrice(total)}
              </Link>
            </div>

            {/* Trust */}
            <div className="rounded-3xl p-5 grid grid-cols-3 gap-3"
              style={{ background:"var(--bg-white)", border:"1px solid var(--border)" }}>
              {[
                { Icon:Shield,    l:"Secure",   sub:"SSL encrypted" },
                { Icon:Truck,     l:"Fast Ship", sub:"1-2 business days" },
                { Icon:RotateCcw, l:"Returns",  sub:"30 days free" },
              ].map(f => (
                <div key={f.l} className="flex flex-col items-center text-center gap-1">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
                    style={{ background:"var(--gold-pale)" }}>
                    <f.Icon size={15} style={{ color:"var(--gold)" }} />
                  </div>
                  <p className="text-[11px] font-bold" style={{ color:"var(--text)" }}>{f.l}</p>
                  <p className="text-[9px]" style={{ color:"var(--text-muted)" }}>{f.sub}</p>
                </div>
              ))}
            </div>

            {/* Payment methods */}
            <div className="rounded-2xl p-4 text-center"
              style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)" }}>
              <p className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>Secure payment powered by</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {["VISA","MC","AMEX","PayPal"].map(p => (
                  <div key={p} className="px-2.5 py-1 rounded-lg text-[10px] font-black"
                    style={{ background:"var(--bg-muted)", color:"var(--text-muted)", border:"1px solid var(--border)" }}>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
