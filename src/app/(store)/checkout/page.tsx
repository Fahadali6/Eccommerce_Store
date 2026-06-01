"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, CreditCard, MapPin, User, Mail, ChevronRight, Lock, Check } from "lucide-react";
import { useStore, useCartTotals } from "@/context/store";
import { formatPrice, generateOrderId, getProductImageUrl } from "@/lib/utils";
import { getLocalProductImages } from "@/lib/imageStorage";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import type { CartItem } from "@/types";

const STEPS = ["Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const router    = useRouter();
  const cart      = useStore(s => s.cart);
  const clearCart = useStore(s => s.clearCart);
  const { subtotal, shipping, discountAmt, total } = useCartTotals();

  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [enriched, setEnriched] = useState<CartItem[]>([]);

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [address, setAddress] = useState("");
  const [city,    setCity]    = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [card,    setCard]    = useState("");
  const [expiry,  setExpiry]  = useState("");
  const [cvv,     setCvv]     = useState("");

  useEffect(() => {
    setEnriched(cart.map(item => {
      if (item.images?.length > 0) return item;
      const local = getLocalProductImages(item.id);
      return local.length > 0 ? { ...item, images: local } : item;
    }));
  }, [cart]);

  const displayCart = enriched.length > 0 ? enriched : cart;

  function nextStep() {
    if (step === 0) {
      if (!name || !email || !address || !city) { toast.error("Please fill all shipping fields"); return; }
    }
    if (step === 1) {
      if (!card || !expiry || !cvv) { toast.error("Please fill payment details"); return; }
    }
    if (step === 2) {
      setLoading(true);
      setTimeout(() => {
        const orderId = generateOrderId();
        clearCart();
        localStorage.setItem("vaulta_order", JSON.stringify({ orderId, total, items: cart }));
        router.push("/order-success");
      }, 2000);
      return;
    }
    setStep(s => s + 1);
  }

  const Field = ({ label, value, onChange, placeholder, type="text", icon: Icon }: {
    label:string; value:string; onChange:(v:string)=>void; placeholder:string; type?:string; icon?:React.ElementType;
  }) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2"
        style={{ color:"var(--text-muted)" }}>{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color:"var(--text-faint)" }} />}
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} className="input"
          style={Icon ? { paddingLeft:"42px" } : {}} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-10" style={{ background:"var(--bg)" }}>
      <div className="container">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-8" style={{ color:"var(--text-muted)" }}>
          <Link href="/home" className="hover:opacity-70">Home</Link>
          <ChevronRight size={12} />
          <Link href="/cart" className="hover:opacity-70">Cart</Link>
          <ChevronRight size={12} />
          <span style={{ color:"var(--text)", fontWeight:500 }}>Checkout</span>
        </nav>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                  style={{
                    background: i <= step ? "var(--gold)" : "var(--bg-muted)",
                    color:      i <= step ? "#fff"        : "var(--text-muted)",
                    border:     `2px solid ${i <= step ? "var(--gold)" : "var(--border)"}`,
                  }}>
                  {i < step ? <Check size={16} /> : i+1}
                </div>
                <span className="text-xs mt-2 font-medium"
                  style={{ color: i <= step ? "var(--gold)" : "var(--text-muted)" }}>{s}</span>
              </div>
              {i < STEPS.length-1 && (
                <div className="w-20 h-0.5 mx-2 mb-5"
                  style={{ background: i < step ? "var(--gold)" : "var(--border)" }} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Form */}
          <div>
            {/* Step 0: Shipping */}
            {step === 0 && (
              <div className="rounded-3xl p-8"
                style={{ background:"var(--bg-white)", border:"1px solid var(--border)" }}>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background:"var(--gold-pale)" }}>
                    <MapPin size={18} style={{ color:"var(--gold)" }} />
                  </div>
                  <h2 className="text-xl font-bold font-serif" style={{ color:"var(--text)" }}>
                    Shipping Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Field label="Full Name *" value={name} onChange={setName}
                      placeholder="John Doe" icon={User} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Email Address *" value={email} onChange={setEmail}
                      placeholder="john@example.com" type="email" icon={Mail} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Street Address *" value={address} onChange={setAddress}
                      placeholder="123 Main Street" icon={MapPin} />
                  </div>
                  <Field label="City *" value={city} onChange={setCity} placeholder="Karachi" />
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color:"var(--text-muted)" }}>Country</label>
                    <select value={country} onChange={e => setCountry(e.target.value)} className="input">
                      {["Pakistan","United States","United Kingdom","Canada","Australia","UAE","Germany","France","Singapore","Japan"].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="rounded-3xl p-8"
                style={{ background:"var(--bg-white)", border:"1px solid var(--border)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background:"var(--gold-pale)" }}>
                    <CreditCard size={18} style={{ color:"var(--gold)" }} />
                  </div>
                  <h2 className="text-xl font-bold font-serif" style={{ color:"var(--text)" }}>
                    Payment Details
                  </h2>
                </div>
                <p className="text-xs mb-7 ml-14" style={{ color:"var(--text-faint)" }}>
                  Stripe-secured · Test mode: use any card number
                </p>
                <div className="space-y-5">
                  <Field label="Card Number *" value={card} onChange={setCard}
                    placeholder="4242 4242 4242 4242" icon={CreditCard} />
                  <div className="grid grid-cols-2 gap-5">
                    <Field label="Expiry Date *" value={expiry} onChange={setExpiry} placeholder="MM/YY" />
                    <Field label="CVV *" value={cvv} onChange={setCvv} placeholder="123" />
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-xl flex items-center gap-3"
                  style={{ background:"var(--gold-pale)", border:"1px solid var(--gold-border)" }}>
                  <Shield size={16} style={{ color:"var(--gold)" }} />
                  <p className="text-xs" style={{ color:"var(--text-sec)" }}>
                    Your payment info is encrypted with 256-bit SSL. We never store card details.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="rounded-3xl p-8"
                style={{ background:"var(--bg-white)", border:"1px solid var(--border)" }}>
                <h2 className="text-xl font-bold font-serif mb-7" style={{ color:"var(--text)" }}>
                  Review Your Order
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-7">
                  <div className="p-4 rounded-2xl" style={{ background:"var(--bg-subtle)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:"var(--text-muted)" }}>Shipping to</p>
                    <p className="text-sm font-semibold" style={{ color:"var(--text)" }}>{name}</p>
                    <p className="text-xs mt-1" style={{ color:"var(--text-sec)" }}>{address}, {city}, {country}</p>
                    <p className="text-xs" style={{ color:"var(--text-sec)" }}>{email}</p>
                  </div>
                  <div className="p-4 rounded-2xl" style={{ background:"var(--bg-subtle)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:"var(--text-muted)" }}>Payment</p>
                    <p className="text-sm font-semibold" style={{ color:"var(--text)" }}>•••• •••• •••• {card.slice(-4) || "****"}</p>
                    <p className="text-xs mt-1 text-emerald-600 flex items-center gap-1"><Shield size={11} />Secured by Stripe</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {displayCart.map(item => {
                    const imgSrc = getProductImageUrl(item, 0, 96, 96);
                    return (
                      <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl"
                        style={{ background:"var(--bg-subtle)" }}>
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={imgSrc} alt={item.name} fill className="object-cover"
                            sizes="56px" unoptimized={imgSrc.startsWith("data:")} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color:"var(--text)" }}>{item.name}</p>
                          <p className="text-xs" style={{ color:"var(--text-muted)" }}>×{item.qty}</p>
                        </div>
                        <span className="font-bold text-sm" style={{ color:"var(--text)" }}>
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-5">
              {step > 0 && (
                <button onClick={() => setStep(s => s-1)} className="btn-outline flex-1">
                  ← Back
                </button>
              )}
              <button onClick={nextStep} disabled={loading}
                className="btn-gold flex-1 flex items-center justify-center gap-2"
                style={loading ? { opacity:0.75, cursor:"not-allowed" } : {}}>
                {loading ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white spin" />Processing...</>
                ) : step === 2 ? (
                  <><Lock size={16} />Pay {formatPrice(total)}</>
                ) : (
                  <>Continue →</>
                )}
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-3xl p-7 h-fit sticky top-24"
            style={{ background:"var(--bg-white)", border:"1px solid var(--border)", boxShadow:"var(--shadow-sm)" }}>
            <h2 className="font-bold font-serif text-xl mb-6" style={{ color:"var(--text)" }}>
              Order Summary
            </h2>
            <div className="space-y-4 mb-5 max-h-60 overflow-y-auto pr-1">
              {displayCart.map(item => {
                const imgSrc = getProductImageUrl(item, 0, 96, 96);
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ background:"var(--bg-subtle)" }}>
                      <Image src={imgSrc} alt={item.name} fill className="object-cover"
                        sizes="48px" unoptimized={imgSrc.startsWith("data:")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color:"var(--text)" }}>{item.name}</p>
                      <p className="text-xs" style={{ color:"var(--text-muted)" }}>×{item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold flex-shrink-0" style={{ color:"var(--text)" }}>
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="divider mb-4" />
            <div className="space-y-2.5 mb-5">
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
                <span className={shipping===0?"text-emerald-600 font-semibold":""} style={{ color:shipping===0?undefined:"var(--text)" }}>
                  {shipping===0?"Free":""+formatPrice(shipping)}
                </span>
              </div>
              <div className="divider" />
              <div className="flex justify-between font-black">
                <span style={{ color:"var(--text)" }}>Total</span>
                <span className="text-2xl font-black font-serif" style={{ color:"var(--text)" }}>
                  {formatPrice(total)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs"
              style={{ color:"var(--text-faint)" }}>
              <Shield size={11} />256-bit SSL · Powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
