"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const VALUE_PILLS = [
  "Platform Expertise",
  "Revenue-First Mindset",
  "Full Transparency",
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = contentRef.current?.querySelectorAll("[data-reveal]");
      if (!items?.length) return;

      gsap.from(items, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-navy-900 py-24 sm:py-32"
    >
      <div
        ref={contentRef}
        className="mx-auto max-w-3xl px-6 text-center lg:px-8"
      >
        <p data-reveal className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
          Who We Are
        </p>
        <h2 data-reveal className="mb-6 font-serif text-3xl leading-tight text-offwhite sm:text-5xl">
          Built by People Who Know How Travelers Book
        </h2>
        <p data-reveal className="mb-10 text-lg leading-relaxed text-offwhite/70">
          Revstay was founded on real-world experience managing hotel
          listings across Booking.com, Expedia, and TripAdvisor. We&apos;ve
          seen — from the inside — exactly what makes a listing rise to the
          top and what leaves great hotels invisible. That knowledge is now
          your advantage.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {VALUE_PILLS.map((pill) => (
            <span
              key={pill}
              data-reveal
              className="rounded-full border border-gold-400/25 bg-gold-500/[0.06] px-5 py-2 text-sm font-medium text-gold-300"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
