"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

export function ContactForm() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sending, setSending] = useState(false);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  function submit() {
    if (!form.name || !form.email || !form.message) { toast.error("Please fill all required fields"); return; }
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We will reply within 24 hours.");
      setForm({ name:"", email:"", subject:"", message:"" });
      setSending(false);
    }, 1200);
  }

  return (
    <div className="card-flat section-white rounded-2xl p-8">
      <h2 className="text-2xl font-bold font-serif mb-6" style={{ color:"var(--text)" }}>Send a Message</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[{l:"Name *",k:"name",ph:"Your name"},{l:"Email *",k:"email",ph:"you@example.com"}].map(f => (
            <div key={f.k}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color:"var(--text-muted)" }}>{f.l}</label>
              <input value={(form as Record<string,string>)[f.k]} onChange={e=>set(f.k,e.target.value)}
                placeholder={f.ph} className="input" />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color:"var(--text-muted)" }}>Subject</label>
          <input value={form.subject} onChange={e=>set("subject",e.target.value)}
            placeholder="Order inquiry, product question..." className="input" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color:"var(--text-muted)" }}>Message *</label>
          <textarea value={form.message} onChange={e=>set("message",e.target.value)}
            rows={6} placeholder="Tell us how we can help..." className="input resize-none" />
        </div>
        <button onClick={submit} disabled={sending}
          className="btn-gold w-full flex items-center justify-center gap-2 text-sm"
          style={sending ? { opacity:0.7, cursor:"not-allowed" } : {}}>
          {sending
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin" />
            : <Send size={14} />}
          {sending ? "Sending..." : "Send Message"}
        </button>
      </div>
    </div>
  );
}
