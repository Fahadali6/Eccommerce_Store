"use client";

import { useState, useCallback } from "react";
import { ChatButton } from "./ChatButton";
import { ChatWindow } from "./ChatWindow";

export interface Message {
  id:   string;
  role: "bot" | "user";
  text: string;
  time: string;
}

// ── Bot response engine ───────────────────────────────────────
const BOT_RESPONSES: Record<string, string> = {
  "track order":
    "Sure! To track your order, go to your email inbox and find the shipping confirmation from VAULTA. It contains a tracking link. You can also visit /order-success with your order ID. Need help with a specific order?",
  "view products":
    "You can browse our full collection at /shop — we have Travel, Office, Fashion, and Gym bags. Want me to highlight any particular category? 🛍️",
  "shipping info":
    "We offer FREE shipping on all orders over $150! Standard delivery takes 3–5 business days. Express (1–2 days) is available at checkout. We ship to 12+ countries worldwide. 🌍",
  "returns policy":
    "We offer FREE returns within 30 days — no questions asked. Every VAULTA bag also comes with a LIFETIME structural warranty. Just contact us and we handle everything. 🔄",
  "contact support":
    "You can reach our team at hello@vaulta.co or call +92 21 3456 7890 (Mon–Fri 9am–6pm PKT). Or visit our /contact page to send a message directly. We typically reply within a few hours! 📞",
  "hello":
    "Hey there! 👋 Great to hear from you. I'm VAULTA's support assistant. What can I help you with today?",
  "hi":
    "Hi! 👋 Welcome to VAULTA. I'm here to help with orders, products, shipping, and anything else. What's on your mind?",
  "price":
    "Our bags range from $89 (Carbon Slim Wallet) to $425 (Ivory Executive Briefcase). We always offer the best quality for the price, with free shipping over $150! 💰",
  "discount":
    "Great news — we have active coupon codes! Try VAULTA20 for 20% off, FIRST10 for 10% off your first order, or SAVE15 for 15% off. Apply them at checkout! 🎉",
  "coupon":
    "We have 3 coupon codes right now: VAULTA20 (20% off), FIRST10 (10% off first order), SAVE15 (15% off). Just enter them at checkout! 🛒",
  "warranty":
    "Every single VAULTA bag comes with a LIFETIME structural warranty. If anything breaks — we fix it or replace it, no questions asked. That's our promise. 🛡️",
  "material":
    "We use premium materials including Full-Grain Leather, Waxed Canvas, Cordura Nylon, Italian Leather, and Ballistic Nylon. All sourced from certified suppliers. ✨",
  "payment":
    "We accept all major credit cards (Visa, Mastercard, Amex), and our checkout is secured by Stripe with 256-bit SSL encryption. Completely safe! 💳",
  "cancel":
    "To cancel an order, please contact us within 2 hours of placing it at hello@vaulta.co. After that it may already be packed and shipped. We'll do our best to help! 📦",
  "size":
    "Our bags come in Small, Medium, and Large. Each product page shows exact dimensions and capacity in liters. Need help picking the right size for your needs?",
  "laptop":
    "Most of our bags fit laptops from 13\" to 17\". The Neural Laptop Folio (16\"), Summit Ridge Backpack (15\"), and Ivory Executive Briefcase (16\") are our most popular laptop-friendly bags. 💻",
  "gift":
    "Great choice! 🎁 All our bags make wonderful gifts. We can include a handwritten note — just mention it in the order notes at checkout. We also offer gift wrapping!",
  "thank":
    "You're very welcome! 😊 Is there anything else I can help you with today?",
  "thanks":
    "Happy to help! 😊 Feel free to reach out anytime. Is there anything else you need?",
  "bye":
    "Goodbye! 👋 Thanks for choosing VAULTA. Have a wonderful day! Don't hesitate to reach out if you need anything.",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  // Check for keyword matches
  for (const [key, response] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(key)) return response;
  }

  // Default responses
  const defaults = [
    "Thanks for your message! Our team will get back to you shortly. In the meantime, you can check our FAQ at /contact, browse /shop, or use one of the quick options below. 😊",
    "I'm not sure I have the perfect answer for that, but our support team at hello@vaulta.co can definitely help! They respond within a few hours. Is there anything else I can assist with? 🙌",
    "Great question! For the most accurate answer, please contact us at hello@vaulta.co or visit /contact. Our team is very responsive! Meanwhile, can I help with something else?",
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

function getTime(): string {
  return new Date().toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
}

function makeId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

const WELCOME: Message = {
  id:   makeId(),
  role: "bot",
  text: "Hi there! 👋 Welcome to VAULTA. I'm your personal shopping assistant. How can I help you today?",
  time: getTime(),
};

// ── Main widget ───────────────────────────────────────────────
export function ChatWidget() {
  const [isOpen,     setIsOpen]     = useState(false);
  const [isVisible,  setIsVisible]  = useState(false); // for animation on close
  const [messages,   setMessages]   = useState<Message[]>([WELCOME]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping,   setIsTyping]   = useState(false);
  const [hasUnread,  setHasUnread]  = useState(true);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsVisible(true);
    setHasUnread(false);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 260); // wait for slide-out animation
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) close(); else open();
  }, [isOpen, open, close]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id:makeId(), role:"user", text:trimmed, time:getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking (800ms–1800ms)
    const delay = 800 + Math.random() * 1000;
    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id:   makeId(),
        role: "bot",
        text: getBotResponse(trimmed),
        time: getTime(),
      };
      setMessages(prev => [...prev, botMsg]);
    }, delay);
  }, []);

  const handleSend = useCallback(() => {
    sendMessage(inputValue);
  }, [sendMessage, inputValue]);

  const handleQuickReply = useCallback((value: string) => {
    sendMessage(value);
  }, [sendMessage]);

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      {/* Chat window */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
          onQuickReply={handleQuickReply}
          isOpen={isVisible}
        />
      )}

      {/* Toggle button */}
      <ChatButton
        isOpen={isOpen}
        onClick={toggle}
        hasUnread={hasUnread}
      />
    </div>
  );
}
