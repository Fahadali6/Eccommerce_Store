"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, CreditCard, MapPin, User, Mail, ChevronRight, Lock } from "lucide-react";
import { useStore, useCartTotals } from "@/context/store";
import { formatPrice, generateOrderId, getProductImageUrl } from "@/lib/utils";
import { getLocalProductImages } from "@/lib/imageStorage";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import type { CartItem } from "@/types";

export default function CheckoutPage() {
  const router    = useRouter();
  const cart      = useStore(s => s.cart);
  const clearCart = useStore(s => s.clearCart);
  const { subtotal, shipping, discountAmt, total } = useCartTotals();
  const [loading, setLoading]         = useState(false);
  const [enrichedCart, setEnrichedCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    name:"", email:"", address:"", city:"", country:"Pakistan",
    card:"", expiry:"", cvv:"",
  });

  useEffect(() => {
    const enriched = cart.map(item => {
      if (item.images && item.images.length > 0) return item;
      const local = getLocalProductImages(item.id);
      return local.length > 0 ? { ...item, images: local } : item;
    });
    setEnrichedCart(enriched);
  }, [cart]);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const displayCart = enrichedCart.length > 0 ? enrichedCart : cart;

  function submit() {
    if (!form.name || !form.email || !form.address || !form.city) {
      toast.error("Please fill all shipping fields"); return;
    }
    if (!form.card || !form.expiry || !form.cvv) {
      toast.error("Please fill payment details"); return;
    }
    setLoading(true);
    setTimeout(() => {
      const orderId = generateOrderId();
      clearCart();
      localStorage.setItem("vaulta_order", JSON.stringify({ orderId, total, items: cart }));
      router.push("/order-success");
    }, 2000);
  }

  const Field = ({ label, k, placeholder, type = "text", icon: Icon }: {
    label:string; k:string; placeholder:string; type?:string; icon?:React.ElementType;
  }) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color:"var(--text-muted)" }}>{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color:"var(--text-faint)" }} />}
        <input
          type={type}
          value={(form as Record<string,string>)[k]}
          onChange={e => set(k, e.target.value)}
          placeholder={placeholder}
          className="input"
          style={Icon ? { paddingLeft:"40px" } : {}}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen section-subtle pt-24 pb-20">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-8 pt-4"
          style={{ color:"var(--text-muted)" }}>
          <Link href="/home" className="hover:opacity-70">Home</Link>
          <ChevronRight size={12} />
          <Link href="/cart" className="hover:opacity-70">Cart</Link>
          <ChevronRight size={12} />
          <span style={{ color:"var(--text)" }}>Checkout</span>
        </nav>

        <h1 className="text-5xl font-black font-serif mb-10">Checkout</h1>

        <div className="grid grid-cols-[1fr_380px] gap-8">
          {/* Forms */}
          <div className="space-y-5">
            {/* Shipping */}
            <div className="card-flat section-white rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background:"var(--gold-pale)" }}>
                  <MapPin size={16} style={{ color:"var(--gold)" }} />
                </div>
                <h2 className="text-lg font-bold font-serif" style={{ color:"var(--text)" }}>
                  Shipping Information
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Field label="Full Name" k="name" placeholder="John Doe" icon={User} />
                </div>
                <div className="col-span-2">
                  <Field label="Email Address" k="email" placeholder="john@example.com"
                    type="email" icon={Mail} />
                </div>
                <div className="col-span-2">
                  <Field label="Street Address" k="address" placeholder="123 Main Street"
                    icon={MapPin} />
                </div>
                <Field label="City" k="city" placeholder="Karachi" />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color:"var(--text-muted)" }}>Country</label>
                  <select value={form.country} onChange={e => set("country", e.target.value)}
                    className="input">
                    {["Pakistan","United States","United Kingdom","Canada","Australia",
                      "UAE","Germany","France","Singapore","Japan"].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card-flat section-white rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background:"var(--gold-pale)" }}>
                  <CreditCard size={16} style={{ color:"var(--gold)" }} />
                </div>
                <h2 className="text-lg font-bold font-serif" style={{ color:"var(--text)" }}>
                  Payment Details
                </h2>
              </div>
              <p className="text-xs mb-6 ml-12" style={{ color:"var(--text-faint)" }}>
                Stripe-secured · Test mode: use any card number
              </p>
              <div className="space-y-4">
                <Field label="Card Number" k="card" placeholder="4242 4242 4242 4242"
                  icon={CreditCard} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry" k="expiry" placeholder="MM/YY" />
                  <Field label="CVV" k="cvv" placeholder="123" />
                </div>
              </div>
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="space-y-4">
            <div className="card-flat section-white rounded-2xl p-6 sticky top-24">
              <h2 className="font-bold font-serif text-lg mb-5" style={{ color:"var(--text)" }}>
                Your Order
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-5 max-h-56 overflow-y-auto">
                {displayCart.map(item => {
                  const imgSrc   = getProductImageUrl(item, 0, 96, 96);
                  const isBase64 = imgSrc.startsWith("data:");
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ background:"var(--bg-subtle)" }}>
                        <Image
                          src={imgSrc}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                          unoptimized={isBase64}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color:"var(--text)" }}>
                          {item.name}
                        </p>
                        <p className="text-xs" style={{ color:"var(--text-muted)" }}>×{item.qty}</p>
                      </div>
                      <span className="text-sm font-semibold flex-shrink-0"
                        style={{ color:"var(--text)" }}>
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2.5 border-t pt-4 mb-6"
                style={{ borderColor:"var(--border)" }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color:"var(--text-sec)" }}>Subtotal</span>
                  <span style={{ color:"var(--text)" }}>{formatPrice(subtotal)}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Discount</span>
                    <span className="text-emerald-600">-{formatPrice(discountAmt)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span style={{ color:"var(--text-sec)" }}>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-600" : ""}
                    style={{ color: shipping === 0 ? undefined : "var(--text)" }}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2"
                  style={{ borderTop:"1px solid var(--border)" }}>
                  <span style={{ color:"var(--text)" }}>Total</span>
                  <span className="text-xl font-black font-serif"
                    style={{ color:"var(--text)" }}>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Pay button */}
              <button
                onClick={submit}
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2 text-sm"
                style={loading ? { opacity:0.7, cursor:"not-allowed" } : {}}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin" />
                ) : (
                  <Lock size={14} />
                )}
                {loading ? "Processing..." : `Pay ${formatPrice(total)}`}
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs"
                style={{ color:"var(--text-faint)" }}>
                <Shield size={11} />
                256-bit SSL · Secured by Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
