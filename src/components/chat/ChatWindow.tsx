"use client";

import { useEffect, useRef } from "react";
import { Shield, Star, Clock } from "lucide-react";
import type { Message } from "./ChatWidget";

interface Props {
  messages:     Message[];
  isTyping:     boolean;
  inputValue:   string;
  onInputChange:(v: string) => void;
  onSend:       () => void;
  onQuickReply: (text: string) => void;
  isOpen:       boolean;
}

const QUICK_REPLIES = [
  { label:"🔍 Track my order",      value:"Track order"     },
  { label:"👜 View products",        value:"View products"   },
  { label:"📦 Shipping info",        value:"Shipping info"   },
  { label:"🔄 Returns & warranty",   value:"Returns policy"  },
  { label:"💬 Contact support",      value:"Contact support" },
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 mb-3">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black"
        style={{ background:"var(--gold)", color:"#fff" }}>V</div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
        style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)" }}>
        {[0,1,2].map(i => (
          <span key={i} className="w-1.5 h-1.5 rounded-full inline-block"
            style={{
              background: "var(--text-muted)",
              animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isBot = msg.role === "bot";
  return (
    <div className={`flex items-end gap-2.5 mb-3 ${isBot ? "" : "flex-row-reverse"}`}>
      {/* Avatar */}
      {isBot ? (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black"
          style={{ background:"var(--gold)", color:"#fff" }}>V</div>
      ) : (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black"
          style={{ background:"var(--bg-muted)", color:"var(--text-sec)" }}>U</div>
      )}

      {/* Bubble */}
      <div
        className="max-w-[75%] px-4 py-2.5 text-sm leading-relaxed"
        style={{
          borderRadius:    isBot ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
          background:      isBot ? "var(--bg-subtle)"   : "var(--gold)",
          color:           isBot ? "var(--text)"        : "#fff",
          border:          isBot ? "1px solid var(--border)" : "none",
          boxShadow:       isBot ? "none" : "0 4px 15px rgba(184,134,11,0.3)",
          animation:       "bubbleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {msg.text}
        <p className="text-[10px] mt-1 opacity-60">
          {msg.time}
        </p>
      </div>
    </div>
  );
}

export function ChatWindow({
  messages, isTyping, inputValue, onInputChange, onSend, onQuickReply, isOpen,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 400);
  }, [isOpen]);

  const showQuickReplies = messages.length <= 1;

  return (
    <div
      className="absolute bottom-20 right-0 flex flex-col rounded-3xl overflow-hidden"
      style={{
        width:         "360px",
        height:        "520px",
        background:    "var(--bg-white)",
        border:        "1px solid var(--border)",
        boxShadow:     "0 25px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)",
        transformOrigin: "bottom right",
        animation:     isOpen
          ? "chatSlideIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both"
          : "chatSlideOut 0.25s ease-in both",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
        style={{ background:"var(--text)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
        <div className="relative">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-base"
            style={{ background:"var(--gold)", color:"#fff" }}>V</div>
          {/* Online dot */}
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
            style={{ background:"#22C55E", borderColor:"var(--text)" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">VAULTA Support</p>
          <p className="text-[11px] flex items-center gap-1"
            style={{ color:"rgba(255,255,255,0.6)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Online · Replies instantly
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full"
            style={{ background:"rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.8)" }}>
            <Star size={10} className="fill-amber-400 text-amber-400" />4.9
          </div>
        </div>
      </div>

      {/* ── Trust bar ── */}
      <div className="flex items-center justify-center gap-4 px-5 py-2 flex-shrink-0"
        style={{ background:"var(--gold-pale)", borderBottom:"1px solid #E8D5A3" }}>
        {[
          { icon:Shield, text:"Secure chat" },
          { icon:Clock,  text:"24/7 support" },
          { icon:Star,   text:"4.9 rated" },
        ].map(({ icon:Icon, text }) => (
          <div key={text} className="flex items-center gap-1 text-[10px] font-semibold"
            style={{ color:"var(--gold)" }}>
            <Icon size={10} />{text}
          </div>
        ))}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4"
        style={{ scrollbarWidth:"thin", scrollbarColor:"var(--border) transparent" }}>

        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        {isTyping && <TypingIndicator />}

        {/* Quick replies */}
        {showQuickReplies && (
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2"
              style={{ color:"var(--text-faint)" }}>Quick options</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map(qr => (
                <button
                  key={qr.value}
                  onClick={() => onQuickReply(qr.value)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
                  style={{
                    background:  "var(--bg-subtle)",
                    border:      "1px solid var(--border)",
                    color:       "var(--text-sec)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background   = "var(--gold-pale)";
                    el.style.borderColor  = "var(--gold)";
                    el.style.color        = "var(--gold)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background   = "var(--bg-subtle)";
                    el.style.borderColor  = "var(--border)";
                    el.style.color        = "var(--text-sec)";
                  }}
                >
                  {qr.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-4 py-3"
        style={{ borderTop:"1px solid var(--border)", background:"var(--bg-white)" }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl"
          style={{ background:"var(--bg-subtle)", border:"1.5px solid var(--border)" }}>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && onSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-sm font-sans"
            style={{ color:"var(--text)" }}
          />
          <button
            onClick={onSend}
            disabled={!inputValue.trim()}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              background: inputValue.trim() ? "var(--gold)" : "var(--bg-muted)",
              color:      inputValue.trim() ? "#fff"        : "var(--text-faint)",
              transform:  inputValue.trim() ? "scale(1)"    : "scale(0.9)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] mt-2" style={{ color:"var(--text-faint)" }}>
          Powered by VAULTA · avg. reply &lt; 1 min
        </p>
      </div>

      <style>{`
        @keyframes chatSlideIn {
          from { opacity:0; transform:scale(0.85) translateY(20px); }
          to   { opacity:1; transform:scale(1)    translateY(0); }
        }
        @keyframes chatSlideOut {
          from { opacity:1; transform:scale(1)    translateY(0); }
          to   { opacity:0; transform:scale(0.85) translateY(20px); }
        }
        @keyframes bubbleIn {
          from { opacity:0; transform:scale(0.85) translateY(8px); }
          to   { opacity:1; transform:scale(1)    translateY(0); }
        }
        @keyframes typingBounce {
          0%,60%,100% { transform:translateY(0); }
          30%          { transform:translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
