"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import { PLATFORM_DETAILS } from "@/lib/platforms";
import { TiltCard } from "@/components/ui/tilt-card";
import { useTheme } from "@/components/ui/theme-provider";

const RESUME_DELAY_MS = 3000;

const DESC_KEYS: Record<string, string> = {
  "Booking.com": "booking",
  Agoda: "agoda",
  Expedia: "expedia",
  Airbnb: "airbnb",
  Hotelbeds: "hotelbeds",
  "Hotels.com": "hotelscom",
  "Trip.com": "tripcom",
};

export function PlatformsCarousel() {
  const t = useTranslations("platforms");
  const locale = useLocale();
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(false);
  if (typeof window !== "undefined") {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      containScroll: false,
      direction: locale === "ar" ? "rtl" : "ltr",
    },
    prefersReducedMotion.current
      ? []
      : [
          AutoScroll({
            speed: 1,
            startDelay: 0,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            stopOnFocusIn: true,
          }),
        ]
  );

  const [canAutoResume] = useState(!prefersReducedMotion.current);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const restartAutoScroll = useCallback(() => {
    if (!canAutoResume || !emblaApi) return;
    const autoScroll = emblaApi.plugins()?.autoScroll;
    if (!autoScroll) return;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      if (!autoScroll.isPlaying()) autoScroll.play();
    }, RESUME_DELAY_MS);
  }, [canAutoResume, emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins()?.autoScroll;
    if (!autoScroll) return;
    // Resume ~3s after the user finishes dragging/selecting.
    emblaApi.on("pointerUp", restartAutoScroll);
    emblaApi.on("select", restartAutoScroll);
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      emblaApi.off("pointerUp", restartAutoScroll);
      emblaApi.off("select", restartAutoScroll);
    };
  }, [emblaApi, restartAutoScroll]);

  useEffect(() => {
    if (
      !sectionRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const headingItems =
        headingRef.current?.querySelectorAll("[data-platform-reveal]");
      const cards =
        cardsRef.current?.querySelectorAll("[data-platform-card]");

      if (headingItems?.length) {
        gsap.from(headingItems, {
          autoAlpha: 0,
          y: 24,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 82%",
            once: true,
          },
        });
      }

      if (cards?.length) {
        gsap.from(cards, {
          autoAlpha: 0,
          y: 42,
          rotateX: 5,
          transformPerspective: 900,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 86%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label={t("regionLabel")}
      className="relative overflow-hidden bg-cream py-24 sm:py-32"
    >
      <div
        ref={headingRef}
        className="mx-auto mb-14 max-w-3xl px-6 text-center lg:px-8"
      >
        <p
          data-platform-reveal
          className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600"
        >
          {t("eyebrow")}
        </p>
        <h2
          data-platform-reveal
          className="font-serif text-3xl leading-tight text-ink sm:text-5xl"
        >
          {t("headline")}
        </h2>
      </div>

      <div ref={cardsRef} className="relative">
        {/* Viewport — edge-fade-x dissolves cards softly at both edges */}
        <div className="edge-fade-x overflow-hidden px-6 lg:px-8" ref={emblaRef}>
          <div className="-mx-2 flex touch-pan-y">
            {PLATFORM_DETAILS.map((platform) => {
              const accent =
                theme === "dark" ? platform.accentDark : platform.accentLight;
              const descKey = DESC_KEYS[platform.name];
              return (
                <div
                  key={platform.name}
                  data-platform-card
                  className="min-w-0 shrink-0 grow-0 basis-[82%] px-2 sm:basis-[46%] lg:basis-[28.5%]"
                >
                  <TiltCard className="h-full">
                    <article
                      tabIndex={0}
                      aria-label={`${platform.name} — ${t(`descriptions.${descKey}`)}`}
                      className="group flex h-full flex-col justify-between rounded-2xl border bg-white-soft p-6 shadow-[var(--shadow-warm-sm)] outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-warm)] focus-visible:ring-2 focus-visible:ring-gold-500"
                      style={{
                        borderColor: `rgba(${accent}, 0.35)`,
                      }}
                    >
                      <div className="mb-8 flex items-start justify-between gap-3">
                        <span className="font-serif text-2xl tracking-tight text-ink">
                          {platform.name}
                        </span>
                        <span
                          className="shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider"
                          style={{
                            color: `rgb(${accent})`,
                            backgroundColor: `rgba(${accent}, 0.1)`,
                          }}
                        >
                          {t(`tags.${platform.tag}`)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-ink-soft">
                        {t(`descriptions.${descKey}`)}
                      </p>
                    </article>
                  </TiltCard>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
