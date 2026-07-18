"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

const VALUE_PILLS = ["expertise", "revenue", "transparency"];

function CompassOrnament() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="mx-auto mb-8 h-16 w-16 text-gold-600/60"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="60" cy="60" r="46" strokeWidth="1" />
      <circle cx="60" cy="60" r="2" fill="currentColor" stroke="none" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const x1 = 60 + Math.cos(angle) * 38;
        const y1 = 60 + Math.sin(angle) * 38;
        const x2 = 60 + Math.cos(angle) * 46;
        const y2 = 60 + Math.sin(angle) * 46;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1" />
        );
      })}
      <path
        d="M60,24 L68,60 L60,96 L52,60 Z"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function About() {
  const t = useTranslations("about");
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const compassRef = useRef<HTMLDivElement>(null);

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

      if (compassRef.current) {
        gsap.to(compassRef.current, {
          rotate: 90,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-white-soft py-24 sm:py-32"
    >
      <div
        ref={contentRef}
        className="mx-auto max-w-3xl px-6 text-center lg:px-8"
      >
        <div ref={compassRef} data-reveal className="will-change-transform">
          <CompassOrnament />
        </div>

        <p data-reveal className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          {t("eyebrow")}
        </p>
        <h2 data-reveal className="mb-6 font-serif text-3xl leading-tight text-ink sm:text-5xl">
          {t("headline")}
        </h2>
        <p data-reveal className="mb-10 text-lg leading-relaxed text-ink-soft">
          {t("body")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {VALUE_PILLS.map((pill) => (
            <span
              key={pill}
              data-reveal
              className="rounded-full border border-teal-500/30 bg-teal-500/[0.08] px-5 py-2 text-sm font-semibold text-teal-600"
            >
              {t(`pills.${pill}`)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
