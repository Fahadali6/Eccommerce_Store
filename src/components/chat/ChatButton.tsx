"use client";
import { MessageCircle, X } from "lucide-react";

interface Props {
  isOpen:   boolean;
  onClick:  () => void;
  hasUnread: boolean;
}

export function ChatButton({ isOpen, onClick, hasUnread }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300"
      style={{
        background:    isOpen ? "var(--text)" : "var(--gold)",
        transform:     isOpen ? "rotate(0deg) scale(1)" : "rotate(0deg) scale(1)",
        boxShadow:     isOpen
          ? "0 8px 30px rgba(0,0,0,0.25)"
          : "0 8px 30px rgba(184,134,11,0.45)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.08)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
    >
      <div
        className="transition-all duration-300"
        style={{
          opacity:   1,
          transform: isOpen ? "rotate(0deg)" : "rotate(0deg)",
        }}
      >
        {isOpen ? (
          <X size={22} color="#fff" strokeWidth={2.5} />
        ) : (
          <MessageCircle size={22} color="#fff" strokeWidth={2} />
        )}
      </div>

      {/* Unread badge */}
      {hasUnread && !isOpen && (
        <span
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white"
          style={{ background:"#EF4444" }}
        >
          1
        </span>
      )}

      {/* Pulse ring when closed */}
      {!isOpen && (
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            background:  "rgba(184,134,11,0.35)",
            animationDuration: "2.5s",
          }}
        />
      )}
    </button>
  );
}
