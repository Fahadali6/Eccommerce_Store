"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id:       1,
    image:    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1600&q=90",
    badge:    "New Arrival 2025",
    heading:  ["The Ultimate", "Travel Companion"],
    accent:   "Travel Companion",
    sub:      "Engineered for those who never stop moving. Full-grain leather that only gets better with every mile.",
    cta:      "Shop Travel Bags",
    href:     "/shop?cat=Travel",
    theme:    "dark",
    overlay:  "rgba(10,8,6,0.52)",
  },
  {
    id:       2,
    image:    "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=1600&q=90",
    badge:    "Editor's Pick",
    heading:  ["Command Every", "Boardroom"],
    accent:   "Boardroom",
    sub:      "Premium office bags crafted for professionals who demand both style and function every single day.",
    cta:      "Shop Office Bags",
    href:     "/shop?cat=Office",
    theme:    "dark",
    overlay:  "rgba(8,10,18,0.58)",
  },
  {
    id:       3,
    image:    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&q=90",
    badge:    "Bestseller",
    heading:  ["Style Meets", "Everyday Life"],
    accent:   "Everyday Life",
    sub:      "Fashion-forward bags that carry your world in effortless elegance. From streets to boardrooms.",
    cta:      "Shop Fashion",
    href:     "/shop?cat=Fashion",
    theme:    "dark",
    overlay:  "rgba(12,6,10,0.50)",
  },
  {
    id:       4,
    image:    "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=1600&q=90",
    badge:    "Train Harder",
    heading:  ["No Limits,", "No Excuses"],
    accent:   "No Excuses",
    sub:      "Performance gym bags built for athletes who refuse to compromise. Sweat-proof, spacious, unstoppable.",
    cta:      "Shop Gym Bags",
    href:     "/shop?cat=Gym",
    theme:    "dark",
    overlay:  "rgba(6,10,6,0.55)",
  },
];

export function HeroSlider() {
  const [current, setCurrent]     = useState(0);
  const [prev, setPrev]           = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [dir, setDir]             = useState<"next" | "prev">("next");
  const [paused, setPaused]       = useState(false);
  const timerRef                  = useRef<ReturnType<typeof setInterval> | null>(null);
  const TOTAL                     = SLIDES.length;
  const DURATION                  = 5000;

  const goTo = useCallback((next: number, direction: "next" | "prev" = "next") => {
    if (animating) return;
    setDir(direction);
    setPrev(current);
    setAnimating(true);
    setCurrent(next);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 700);
  }, [animating, current]);

  const goNext = useCallback(() => goTo((current + 1) % TOTAL, "next"),  [goTo, current, TOTAL]);
  const goPrev = useCallback(() => goTo((current - 1 + TOTAL) % TOTAL, "prev"), [goTo, current, TOTAL]);

  // Autoplay
  useEffect(() => {
    if (paused) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(goNext, DURATION);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [goNext, paused]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative w-full overflow-hidden hero-slider-section"
      style={{ height:"100vh", minHeight:"680px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      {/* ── Slides ── */}
      {SLIDES.map((s, i) => {
        const isActive  = i === current;
        const isPrev    = i === prev;
        if (!isActive && !isPrev) return null;

        let transform = "translateX(0)";
        let opacity   = 1;
        const zIndex    = isActive ? 2 : 1;

        if (isActive && animating) {
          transform = "translateX(0)";
          opacity   = 1;
        }
        if (isPrev && animating) {
          transform = dir === "next" ? "translateX(-8%)" : "translateX(8%)";
          opacity   = 0;
        }

        return (
          <div key={s.id}
            className="absolute inset-0"
            style={{
              zIndex,
              transform,
              opacity,
              transition: animating ? "transform 0.7s cubic-bezier(0.77,0,0.18,1), opacity 0.7s ease" : "none",
            }}
          >
            {/* Background image */}
            <div
              className="absolute inset-0"
              style={{
                transform: isActive && animating ? "scale(1)" : "scale(1.04)",
                transition: "transform 6s ease-out",
              }}
            >
              <Image
                src={s.image}
                alt={s.heading.join(" ")}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0" style={{ background: s.overlay }} />

            {/* Gradient at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3"
              style={{ background:"linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
          </div>
        );
      })}

      {/* ── Content ── */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="max-w-[1400px] mx-auto px-10 md:px-20 w-full">
          <div className="max-w-2xl">

            {/* Badge */}
            <div
              key={`badge-${current}`}
              className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                background: "rgba(184,134,11,0.15)",
                border: "1px solid rgba(184,134,11,0.5)",
                color: "#E8C97A",
                animation: "slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: "0.1s",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
              {slide.badge}
            </div>

            {/* Heading */}
            <h1
              key={`heading-${current}`}
              className="font-black font-serif text-white leading-[1.05] mb-6 hero-slider-heading"
              style={{
                fontSize: "clamp(48px, 6.5vw, 92px)",
                animation: "slideUp 0.65s cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: "0.2s",
                textShadow: "0 2px 30px rgba(0,0,0,0.3)",
              }}
            >
              {slide.heading[0]}<br />
              <span style={{ color:"#E8C97A" }}>{slide.heading[1]}</span>
            </h1>

            {/* Subtext */}
            <p
              key={`sub-${current}`}
              className="text-xl leading-relaxed mb-10 max-w-xl"
              style={{
                color: "rgba(255,255,255,0.82)",
                animation: "slideUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: "0.3s",
                textShadow: "0 1px 10px rgba(0,0,0,0.3)",
              }}
            >
              {slide.sub}
            </p>

            {/* CTA buttons */}
            <div
              key={`cta-${current}`}
              className="flex gap-4 flex-wrap"
              style={{
                animation: "slideUp 0.75s cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: "0.4s",
              }}
            >
              <Link href={slide.href}
                className="group flex items-center gap-2.5 font-bold text-sm px-8 py-4 rounded-xl transition-all duration-300"
                style={{
                  background: "#B8860B",
                  color: "#fff",
                  boxShadow: "0 8px 30px rgba(184,134,11,0.45)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "#D4A017";
                  (e.currentTarget as HTMLElement).style.transform  = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow  = "0 12px 40px rgba(184,134,11,0.55)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "#B8860B";
                  (e.currentTarget as HTMLElement).style.transform  = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow  = "0 8px 30px rgba(184,134,11,0.45)";
                }}
              >
                {slide.cta}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link href="/shop"
                className="flex items-center gap-2 font-semibold text-base px-9 py-5 rounded-xl transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.22)";
                  (e.currentTarget as HTMLElement).style.transform  = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLElement).style.transform  = "translateY(0)";
                }}
              >
                View All Bags
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Prev / Next arrows ── */}
      {[
        { label:"Previous", action:goPrev, pos:"left-6", Icon:ChevronLeft },
        { label:"Next",     action:goNext, pos:"right-6", Icon:ChevronRight },
      ].map(btn => (
        <button
          key={btn.label}
          aria-label={btn.label}
          onClick={btn.action}
          className={`absolute top-1/2 -translate-y-1/2 ${btn.pos} z-20 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hero-slider-arrows`}
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#fff",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(184,134,11,0.8)";
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1.08)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <btn.Icon size={22} strokeWidth={2} />
        </button>
      ))}

      {/* ── Dots ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
            className="transition-all duration-400 rounded-full"
            style={{
              width:      i === current ? "32px" : "9px",
              height:     "9px",
              background: i === current ? "#B8860B" : "rgba(255,255,255,0.4)",
              border:     i === current ? "none" : "1px solid rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div className="absolute bottom-0 inset-x-0 h-1 z-20"
        style={{ background:"rgba(255,255,255,0.1)" }}>
        {!paused && (
          <div
            key={`progress-${current}`}
            className="h-full"
            style={{
              background: "#B8860B",
              animation: `progressBar ${DURATION}ms linear both`,
            }}
          />
        )}
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute top-8 right-8 z-20 flex items-center gap-2"
        style={{ color:"rgba(255,255,255,0.75)", fontSize:"14px", fontWeight:600, letterSpacing:"1px" }}>
        <span style={{ color:"#E8C97A", fontSize:"22px", fontWeight:800 }}>{String(current + 1).padStart(2,"0")}</span>
        <span style={{ color:"rgba(255,255,255,0.3)" }}>/</span>
        <span>{String(TOTAL).padStart(2,"0")}</span>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes progressBar {
          from { width:0%; }
          to   { width:100%; }
        }
      `}</style>
    </section>
  );
}
