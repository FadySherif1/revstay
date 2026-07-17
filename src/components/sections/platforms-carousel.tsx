"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PLATFORM_DETAILS } from "@/lib/platforms";
import { TiltCard } from "@/components/ui/tilt-card";

const RESUME_DELAY_MS = 3000;

export function PlatformsCarousel() {
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

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    restartAutoScroll();
  }, [emblaApi, restartAutoScroll]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    restartAutoScroll();
  }, [emblaApi, restartAutoScroll]);

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

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Booking platforms we manage"
      className="relative overflow-hidden bg-cream py-24 sm:py-32"
    >
      <div className="mx-auto mb-14 max-w-3xl px-6 text-center lg:px-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Where We Put You
        </p>
        <h2 className="font-serif text-3xl leading-tight text-ink sm:text-5xl">
          Seven Platforms. One Strategy. Total Coverage.
        </h2>
      </div>

      <div className="relative">
        {/* Viewport */}
        <div className="overflow-hidden px-6 lg:px-8" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {PLATFORM_DETAILS.map((platform) => (
              <div
                key={platform.name}
                className="min-w-0 shrink-0 grow-0 basis-[82%] pl-4 first:pl-0 sm:basis-[46%] lg:basis-[28.5%]"
              >
                <TiltCard className="h-full">
                  <article
                    tabIndex={0}
                    aria-label={`${platform.name} — ${platform.description}`}
                    className="group flex h-full flex-col justify-between rounded-2xl border bg-white-soft p-6 shadow-[var(--shadow-warm-sm)] outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-warm)] focus-visible:ring-2 focus-visible:ring-gold-500"
                    style={{
                      borderColor: `rgba(${platform.accent}, 0.35)`,
                    }}
                  >
                    <div className="mb-8 flex items-start justify-between gap-3">
                      <span className="font-serif text-2xl tracking-tight text-ink">
                        {platform.name}
                      </span>
                      <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider"
                        style={{
                          color: `rgb(${platform.accent})`,
                          backgroundColor: `rgba(${platform.accent}, 0.1)`,
                        }}
                      >
                        {platform.tag}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-soft">
                      {platform.description}
                    </p>
                  </article>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow controls */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous platform"
            onClick={scrollPrev}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-ink shadow-[var(--shadow-warm-sm)] transition-transform hover:scale-105 hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Next platform"
            onClick={scrollNext}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-ink shadow-[var(--shadow-warm-sm)] transition-transform hover:scale-105 hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
