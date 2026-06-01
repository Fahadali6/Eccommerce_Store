"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex(i => (i + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [paused, next]);

  const t = TESTIMONIALS[index];

  return (
    <section
      className="py-20 sm:py-24 px-4 sm:px-6 bg-[var(--bg-subtle)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p className="label mb-3">Customer Stories</p>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-[var(--text)]">
            Loved by Thousands
          </h2>
        </div>

        <div className="relative card rounded-3xl p-8 sm:p-12 bg-[var(--bg-white)] shadow-[var(--shadow-md)] border border-[var(--border)]">
          <Quote
            size={40}
            className="absolute top-6 left-6 sm:top-8 sm:left-8 text-[var(--gold)]/20"
            strokeWidth={1}
          />

          <div className="relative z-10 text-center">
            <div className="flex justify-center gap-0.5 mb-6">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p
              key={index}
              className="text-base sm:text-lg leading-relaxed italic text-[var(--text-sec)] mb-8 animate-fade-in max-w-2xl mx-auto"
            >
              &ldquo;{t.text}&rdquo;
            </p>

            <div className="flex items-center justify-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base bg-[var(--gold-pale)] text-[var(--gold)]">
                {t.avatar}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[var(--text)]">{t.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--bg-white)] text-[var(--text-sec)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index
                      ? "w-8 bg-[var(--gold)]"
                      : "w-2 bg-[var(--border-dark)] hover:bg-[var(--text-faint)]"
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--bg-white)] text-[var(--text-sec)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
