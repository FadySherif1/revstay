"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Within four months our Booking.com ranking went from invisible to the first page. Weekends are now fully booked.",
    name: "Omar H.",
    role: "Boutique Hotel Owner, Cairo",
  },
  {
    quote:
      "Revstay rebuilt our Expedia listing from scratch. The photos, the copy, the pricing — everything finally looks like the hotel we actually run.",
    name: "Layla M.",
    role: "General Manager, Red Sea Resort",
  },
  {
    quote:
      "I used to manage three platforms myself and it was chaos. Now it's one team, one report, and steadily growing revenue.",
    name: "Karim S.",
    role: "Hotel Group Director",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll("[data-card]");
      if (!cards?.length) return;

      gsap.from(cards, {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative overflow-hidden bg-navy-900 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
            Client Stories
          </p>
          <h2 className="font-serif text-3xl leading-tight text-offwhite sm:text-5xl">
            Hoteliers Who Made the Switch
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              data-card
              className="group flex flex-col rounded-2xl border border-offwhite/10 bg-white/[0.03] p-7 transition-transform duration-300 will-change-transform hover:-rotate-1 hover:-translate-y-1"
            >
              <Quote
                className="mb-4 h-8 w-8 text-gold-500/40"
                strokeWidth={1.5}
                fill="currentColor"
              />
              <p className="mb-6 flex-1 text-sm leading-relaxed text-offwhite/75">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-sm font-semibold text-gold-400 ring-1 ring-gold-400/25">
                  {initials(t.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-offwhite">
                    {t.name}
                  </p>
                  <p className="text-xs text-offwhite/50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
