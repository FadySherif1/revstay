"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import {
  EyeOff,
  ImageOff,
  CircleDollarSign,
  ArrowUpRight,
  Sparkles,
  LineChart,
  ChevronRight,
} from "lucide-react";

const PROBLEM_KEYS = [
  { icon: EyeOff, key: "invisible" },
  { icon: ImageOff, key: "notSelling" },
  { icon: CircleDollarSign, key: "revenueLost" },
] as const;

const SOLUTION_KEYS = [
  { icon: ArrowUpRight, key: "rankHigher" },
  { icon: Sparkles, key: "convert" },
  { icon: LineChart, key: "occupancy" },
] as const;

export function ProblemSolution() {
  const t = useTranslations("problemSolution");
  const sectionRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLParagraphElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const problemItems = problemRef.current?.querySelectorAll("[data-item]");
      const solutionItems = solutionRef.current?.querySelectorAll("[data-item]");
      const borders = solutionRef.current?.querySelectorAll("[data-border]");
      const chevrons = sectionRef.current?.querySelectorAll("[data-chevron]");

      if (problemItems?.length) {
        gsap.fromTo(
          problemItems,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.15,
            scrollTrigger: { trigger: problemRef.current, start: "top 85%" },
          }
        );
      }

      if (solutionItems?.length) {
        gsap.fromTo(
          solutionItems,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.15,
            delay: 0.15,
            scrollTrigger: { trigger: solutionRef.current, start: "top 85%" },
          }
        );
      }

      // Gold left-borders draw in (height 0 -> 100%)
      if (borders?.length) {
        gsap.fromTo(
          borders,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
            delay: 0.3,
            transformOrigin: "top",
            scrollTrigger: { trigger: solutionRef.current, start: "top 75%" },
          }
        );
      }

      // Chevron flow: light up sequentially, looping subtly
      if (chevrons?.length) {
        gsap.set(chevrons, { opacity: 0.2 });
        gsap.to(chevrons, {
          opacity: 1,
          duration: 0.5,
          stagger: 0.25,
          repeat: -1,
          repeatDelay: 0.6,
          yoyo: true,
          ease: "power1.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        });
      }

      if (closingRef.current) {
        gsap.fromTo(
          closingRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: closingRef.current, start: "top 95%" },
          }
        );
      }

      // Recalculate trigger positions after dynamic mount + Lenis layout.
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="problem-solution"
      className="relative overflow-hidden bg-white-soft py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-3xl leading-tight text-ink sm:text-5xl">
            {t("headline")}
          </h2>
        </div>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
          {/* BEFORE — problem column */}
          <div ref={problemRef} className="space-y-6">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-ink-mute md:text-start">
              {t("before")}
            </p>
            {PROBLEM_KEYS.map((item, i) => (
              <div
                key={item.key}
                data-item
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex gap-4 rounded-2xl border border-ink/10 bg-sand/40 p-5 saturate-[0.7] transition-all duration-300 ${
                  activeIndex === i
                    ? "ring-2 ring-gold-500/50 saturate-100"
                    : ""
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink-mute">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="relative mb-1 inline-block font-semibold text-ink/70">
                    {t(`problems.${item.key}.title`)}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink-mute/40"
                    />
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {t(`problems.${item.key}.body`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Transformation flow — vertical chevrons (desktop) / horizontal
              (mobile). rtl:-scale-x-100 flips the arrows to point from the
              problem column toward the solution column in Arabic. */}
          <div
            aria-hidden
            className="flex items-center justify-center gap-2 py-2 md:flex-col md:px-3 md:py-0"
          >
            {[0, 1, 2].map((n) => (
              <ChevronRight
                key={n}
                data-chevron
                className="h-6 w-6 text-gold-500 drop-shadow-[0_0_6px_color-mix(in_srgb,var(--color-gold-500)_50%,transparent)] rtl:-scale-x-100 md:rotate-90 md:rtl:scale-x-100"
                strokeWidth={2.5}
              />
            ))}
          </div>

          {/* AFTER — solution column */}
          <div ref={solutionRef} className="space-y-6">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-gold-600 drop-shadow-[0_0_10px_color-mix(in_srgb,var(--color-gold-500)_35%,transparent)] md:text-start">
              {t("after")}
            </p>
            {SOLUTION_KEYS.map((item, i) => (
              <div
                key={item.key}
                data-item
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`relative flex gap-4 overflow-hidden rounded-2xl border border-gold-500/20 bg-ivory p-5 ps-6 shadow-[var(--shadow-warm-sm)] transition-all duration-300 ${
                  activeIndex === i ? "ring-2 ring-gold-500/60" : ""
                }`}
              >
                {/* Draw-in gold border on the inline-start edge */}
                <span
                  data-border
                  aria-hidden
                  className="absolute inset-y-0 start-0 h-full w-1 origin-top bg-gold-500"
                />
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500 text-gold-ink">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-ink">{t(`solutions.${item.key}.title`)}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {t(`solutions.${item.key}.body`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p
          ref={closingRef}
          className="mx-auto mt-16 max-w-2xl text-center font-serif text-xl italic text-ink/80 sm:text-2xl"
        >
          {t("closing")}
        </p>
      </div>
    </section>
  );
}
