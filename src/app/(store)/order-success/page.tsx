"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Package, Mail, ArrowRight, Home } from "lucide-react";
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
    <div className="min-h-screen section-subtle pt-24 pb-20 flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        {/* Success icon */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background:"#D1FAE5", border:"4px solid #6EE7B7" }}>
            <CheckCircle size={38} className="text-emerald-600" />
          </div>
          <h1 className="text-5xl font-black font-serif mb-3" style={{ color:"var(--text)" }}>Order Placed!</h1>
          {order && (
            <p className="text-sm" style={{ color:"var(--text-muted)" }}>
              Order ID: <span className="font-bold font-mono" style={{ color:"var(--gold)" }}>{order.orderId}</span>
            </p>
          )}
        </div>

        {/* Confirmation note */}
        <div className="card-flat section-white rounded-2xl p-6 mb-5 text-center">
          <p className="text-sm leading-relaxed" style={{ color:"var(--text-sec)" }}>
            Thank you for choosing VAULTA. A confirmation has been sent to your email.
            Your bag will arrive in <strong style={{ color:"var(--text)" }}>3–5 business days</strong>, packed with care.
          </p>
        </div>

        {/* Order items */}
        {order && (
          <div className="card-flat section-white rounded-2xl p-6 mb-5">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color:"var(--text-muted)" }}>
              Your Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span style={{ color:"var(--text-sec)" }}>{item.name} ×{item.qty}</span>
                  <span className="font-semibold" style={{ color:"var(--text)" }}>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="divider mt-4 mb-3" />
            <div className="flex justify-between font-bold">
              <span style={{ color:"var(--text)" }}>Total</span>
              <span className="text-lg font-black font-serif" style={{ color:"var(--text)" }}>{formatPrice(order.total)}</span>
            </div>
          </div>
        )}

        {/* Next steps */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { icon: Mail,    title: "Confirmation Email", desc: "Check your inbox for order details" },
            { icon: Package, title: "Tracking Info",       desc: "Ships within 1 business day" },
          ].map(s => (
            <div key={s.title} className="card-flat section-white rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5"
                style={{ background:"var(--gold-pale)" }}>
                <s.icon size={15} style={{ color:"var(--gold)" }} />
              </div>
              <p className="text-sm font-semibold mb-0.5" style={{ color:"var(--text)" }}>{s.title}</p>
              <p className="text-xs" style={{ color:"var(--text-muted)" }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <Link href="/shop" className="btn-gold flex-1 flex items-center justify-center gap-2">
            Continue Shopping <ArrowRight size={15} />
          </Link>
          <Link href="/home" className="btn-outline flex items-center gap-2">
            <Home size={15} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
