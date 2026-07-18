"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Search, Hammer, LineChart } from "lucide-react";

const STEP_KEYS = [
  { icon: Search, key: "analyze" },
  { icon: Hammer, key: "build" },
  { icon: LineChart, key: "grow" },
] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = trackRef.current?.querySelectorAll("[data-step]");
      if (!cards?.length) return;

      // Pin the section and step the active index across the scroll span.
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.min(
            STEP_KEYS.length - 1,
            Math.floor(self.progress * STEP_KEYS.length)
          );
          setActive(idx);
        },
      });

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0.35, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${i * 33}% top`,
              end: `top+=${(i + 1) * 33}% top`,
              scrub: true,
            },
          }
        );
      });

      ScrollTrigger.refresh();

      return () => st.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative flex min-h-screen items-center overflow-hidden bg-cream py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-3xl leading-tight text-ink sm:text-5xl">
            {t("headline")}
          </h2>
        </div>

        {/* Progress rail */}
        <div className="relative mx-auto mb-12 hidden max-w-3xl md:block">
          <div className="absolute inset-x-0 top-5 h-px bg-ink/10" />
          <div
            className="absolute top-5 h-px bg-gold-500 transition-[width] duration-500 ease-out ltr:left-0 rtl:right-0"
            style={{ width: `${((active + 1) / STEP_KEYS.length) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {STEP_KEYS.map((step, i) => (
              <div
                key={step.key}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-500 ${
                  i <= active
                    ? "border-gold-500 bg-gold-500 text-gold-ink"
                    : "border-ink/15 bg-cream text-ink-mute"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div
          ref={trackRef}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {STEP_KEYS.map((step, i) => (
            <div
              key={step.key}
              data-step
              className={`rounded-2xl border p-7 transition-all duration-500 ${
                i === active
                  ? "border-gold-500/40 bg-white-soft shadow-[var(--shadow-warm)]"
                  : "border-ink/10 bg-white-soft/60 shadow-[var(--shadow-warm-sm)]"
              }`}
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-500 ${
                  i === active
                    ? "bg-gold-500 text-gold-ink"
                    : "bg-gold-500/10 text-gold-600"
                }`}
              >
                <step.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-gold-600">
                {i + 1} / {STEP_KEYS.length}
              </p>
              <h3 className="mb-2 font-serif text-xl text-ink">
                {t(`steps.${step.key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-ink-soft">
                {t(`steps.${step.key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
