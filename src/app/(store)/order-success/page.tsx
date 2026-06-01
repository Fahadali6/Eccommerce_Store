"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Package, Mail, ArrowRight, Home, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface LastOrder {
  orderId: string;
  total: number;
  items: { name: string; qty: number; price: number }[];
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("vaulta_order");
    if (raw) { setOrder(JSON.parse(raw)); localStorage.removeItem("vaulta_order"); }
  }, []);

  return (
    <div className="min-h-screen py-20 flex items-center justify-center px-6"
      style={{ background:"var(--bg)" }}>
      <div className="max-w-xl w-full">

        {/* Success icon */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background:"#D1FAE5", border:"4px solid #34D399" }}>
            <CheckCircle size={44} className="text-emerald-500" />
          </div>
          <h1 className="text-5xl font-black font-serif mb-3" style={{ color:"var(--text)" }}>
            Order Placed! 🎉
          </h1>
          {order && (
            <p className="text-sm" style={{ color:"var(--text-muted)" }}>
              Order ID: <span className="font-black font-mono" style={{ color:"var(--gold)" }}>
                {order.orderId}
              </span>
            </p>
          )}
        </div>

        {/* Message */}
        <div className="rounded-3xl p-7 mb-5 text-center"
          style={{ background:"var(--bg-white)", border:"1px solid var(--border)" }}>
          <p className="text-base leading-relaxed" style={{ color:"var(--text-sec)" }}>
            Thank you for choosing <strong style={{ color:"var(--gold)" }}>VAULTA</strong>.
            A confirmation email has been sent. Your bag will arrive in{" "}
            <strong style={{ color:"var(--text)" }}>3–5 business days</strong>, packed with care.
          </p>
        </div>

        {/* Items */}
        {order && (
          <div className="rounded-3xl p-6 mb-5"
            style={{ background:"var(--bg-white)", border:"1px solid var(--border)" }}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color:"var(--text-muted)" }}>Your Items</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span style={{ color:"var(--text-sec)" }}>{item.name} ×{item.qty}</span>
                  <span className="font-bold" style={{ color:"var(--text)" }}>
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="divider mt-4 mb-4" />
            <div className="flex justify-between items-center">
              <span className="font-bold" style={{ color:"var(--text)" }}>Total</span>
              <span className="text-2xl font-black font-serif" style={{ color:"var(--text)" }}>
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        )}

        {/* Next steps */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { Icon:Mail,    title:"Confirmation",  desc:"Check your inbox" },
            { Icon:Package, title:"Tracking Info", desc:"Sent within 24hrs" },
          ].map(s => (
            <div key={s.title} className="rounded-2xl p-5"
              style={{ background:"var(--bg-white)", border:"1px solid var(--border)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background:"var(--gold-pale)" }}>
                <s.Icon size={18} style={{ color:"var(--gold)" }} />
              </div>
              <p className="text-sm font-bold mb-0.5" style={{ color:"var(--text)" }}>{s.title}</p>
              <p className="text-xs" style={{ color:"var(--text-muted)" }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <Link href="/shop" className="btn-gold flex-1 flex items-center justify-center gap-2">
            Continue Shopping <ArrowRight size={16} />
          </Link>
          <Link href="/home" className="btn-outline flex items-center gap-2">
            <Home size={16} />Home
          </Link>
        </div>
      </div>
    </div>
  );
}
