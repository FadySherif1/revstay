"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = trackRef.current?.querySelectorAll("[data-step]");
      if (cards?.length) {
        // Staggered fade/slide reveal as the section enters — no pin.
        gsap.from(cards, {
          opacity: 0,
          y: 28,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: { trigger: trackRef.current, start: "top 80%" },
        });
      }

      // Progress rail fill draws across as the steps reveal.
      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: trackRef.current, start: "top 80%" },
          }
        );
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative isolate overflow-hidden bg-cream py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <Image
          src="/images/how-it-works-bg.png"
          alt=""
          fill
          quality={82}
          sizes="100vw"
          className="object-cover object-[72%_center] sm:object-center"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-cream) 86%, transparent) 0%, color-mix(in srgb, var(--color-cream) 74%, transparent) 48%, color-mix(in srgb, var(--color-cream) 88%, transparent) 100%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-3xl leading-tight text-ink sm:text-5xl">
            {t("headline")}
          </h2>
        </div>

        {/* Progress rail — number badges with a gold line that draws in */}
        <div className="relative mx-auto mb-12 hidden max-w-3xl md:block">
          <div className="absolute inset-x-0 top-5 h-px bg-ink/10" />
          <div
            ref={railRef}
            className="absolute inset-x-0 top-5 h-px origin-left bg-gold-500 rtl:origin-right"
          />
          <div className="relative flex justify-between">
            {STEP_KEYS.map((step) => (
              <div
                key={step.key}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500 bg-gold-500 text-sm font-semibold text-gold-ink"
              >
                {STEP_KEYS.indexOf(step) + 1}
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
              className="rounded-2xl border border-gold-500/30 bg-white-soft p-7 shadow-[var(--shadow-warm-sm)] transition-shadow duration-300 hover:shadow-[var(--shadow-warm)]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-gold-ink">
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
