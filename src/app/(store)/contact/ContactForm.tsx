"use client";
import { useState } from "react";
import { Send, User, Mail } from "lucide-react";
import toast from "react-hot-toast";

export function ContactForm() {
  const [form, setForm]     = useState({ name:"", email:"", subject:"", message:"" });
  const [sending, setSending] = useState(false);
  const [sent, setSent]      = useState(false);
  const set = (k:string, v:string) => setForm(p => ({ ...p, [k]:v }));

  function submit() {
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all required fields"); return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll reply within 24 hours.");
      setSent(true); setSending(false);
    }, 1400);
  }

  if (sent) {
    return (
      <div className="rounded-3xl p-10 text-center card-flat"
        style={{ background:"var(--bg-white)" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background:"#D1FAE5", border:"3px solid #34D399" }}>
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="text-2xl font-bold font-serif mb-3" style={{ color:"var(--text)" }}>Message Sent!</h3>
        <p className="text-sm" style={{ color:"var(--text-sec)" }}>
          Thanks for reaching out. We will get back to you within 24 hours.
        </p>
        <button onClick={() => setSent(false)} className="btn-outline btn-sm mt-6">Send Another</button>
      </div>
    );
  }

  const Field = ({ label, k, ph, type="text", Icon }: { label:string; k:string; ph:string; type?:string; Icon:React.ElementType }) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2"
        style={{ color:"var(--text-muted)" }}>{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color:"var(--text-faint)" }} />
        <input type={type} value={(form as Record<string,string>)[k]}
          onChange={e => set(k, e.target.value)} placeholder={ph}
          className="input" style={{ paddingLeft:"42px" }} />
      </div>
    </div>
  );

  return (
    <div className="rounded-3xl p-8 card-flat" style={{ background:"var(--bg-white)" }}>
      <h2 className="text-2xl font-bold font-serif mb-6" style={{ color:"var(--text)" }}>
        Send a Message
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name *"  k="name"  ph="Your name"       Icon={User} />
          <Field label="Email *" k="email" ph="you@example.com" Icon={Mail} type="email" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color:"var(--text-muted)" }}>Subject</label>
          <input value={form.subject} onChange={e => set("subject", e.target.value)}
            placeholder="Order inquiry, product question..." className="input" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color:"var(--text-muted)" }}>Message *</label>
          <textarea value={form.message} onChange={e => set("message", e.target.value)}
            rows={6} placeholder="How can we help you?" className="input resize-none" />
        </div>
        <button onClick={submit} disabled={sending}
          className="btn-gold w-full flex items-center justify-center gap-2"
          style={sending ? { opacity:0.75, cursor:"not-allowed" } : {}}>
          {sending
            ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white spin" />Sending...</>
            : <><Send size={15} />Send Message</>}
        </button>
      </div>
    </div>
  );
}
