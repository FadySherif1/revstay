"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Camera, TrendingUp, BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { TiltCard } from "@/components/ui/tilt-card";

const SERVICES = [
  {
    icon: Building2,
    key: "listing",
    image: "/images/services/listing.avif",
  },
  {
    icon: Camera,
    key: "content",
    image: "/images/services/content.avif",
  },
  {
    icon: TrendingUp,
    key: "visibility",
    image: "/images/services/visibility.jpg",
  },
  {
    icon: BarChart3,
    key: "growth",
    image: "/images/services/growth.jpg",
  },
];

export function Services() {
  const t = useTranslations("services");
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const currentStepRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !viewportRef.current ||
      !trackRef.current
    ) {
      return;
    }

    const currentStepElement = currentStepRef.current;
    const progressElement = progressRef.current;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current!;
      const viewport = viewportRef.current!;
      const track = trackRef.current!;
      const cards = gsap.utils.toArray<HTMLElement>(
        track.querySelectorAll("[data-card]")
      );
      const isRtl = document.documentElement.dir === "rtl";
      const lastCardIndex = cards.length - 1;

      const updateVisualState = (progress: number) => {
        const cardPosition = progress * lastCardIndex;
        const activeCardIndex = Math.round(cardPosition);

        cards.forEach((card, index) => {
          const distance = Math.min(
            Math.abs(index - cardPosition),
            1
          );

          gsap.set(card, {
            opacity: gsap.utils.interpolate(1, 0.48, distance),
            scale: gsap.utils.interpolate(1, 0.94, distance),
          });
        });

        if (currentStepElement) {
          currentStepElement.textContent = String(
            activeCardIndex + 1
          ).padStart(2, "0");
        }

        if (progressElement) {
          gsap.set(progressElement, {
            scaleX: (activeCardIndex + 1) / cards.length,
          });
        }
      };

      updateVisualState(0);

      gsap.to(track, {
        x: () => {
          const travel = track.scrollWidth - viewport.clientWidth;
          return isRtl ? travel : -travel;
        },
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () =>
            `+=${Math.max(window.innerHeight, 720) * lastCardIndex}`,
          pin: true,
          // The page's <main> is a flex column. Margin-based spacing keeps
          // the following section below the full pinned scroll distance.
          pinSpacing: "margin",
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap:
            lastCardIndex > 0
              ? {
                  snapTo: 1 / lastCardIndex,
                  duration: { min: 0.18, max: 0.45 },
                  delay: 0.05,
                  ease: "power2.inOut",
                }
              : undefined,
          onUpdate: (self) => {
            updateVisualState(self.progress);
          },
        },
      });

      gsap.from("[data-services-heading]", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => {
      ctx.revert();
      if (currentStepElement) {
        currentStepElement.textContent = "01";
      }
      if (progressElement) {
        gsap.set(progressElement, {
          clearProps: "transform",
        });
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-10 isolate h-[100svh] shrink-0 overflow-hidden bg-ivory"
    >
      {/* Quiet geometric texture behind the pinned carousel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.045]"
      >
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <pattern id="egypt-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M25,0 L50,25 L25,50 L0,25 Z" fill="none" stroke="var(--color-gold-600)" strokeWidth="1" />
            <circle cx="25" cy="25" r="4" fill="none" stroke="var(--color-gold-600)" strokeWidth="1" />
          </pattern>
          <rect width="400" height="400" fill="url(#egypt-grid)" />
        </svg>
      </div>

      <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-4 pb-5 pt-24 sm:px-6 sm:pb-7 lg:px-8">
        <div
          data-services-heading
          className="mx-auto mb-5 max-w-2xl shrink-0 text-center sm:mb-7"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            {t("eyebrow")}
          </p>
          <h2 className="mb-3 font-serif text-3xl leading-tight text-ink sm:text-5xl">
            {t("headline")}
          </h2>
          <p className="text-base text-ink-soft sm:text-lg">
            {t("sub")}
          </p>
        </div>

        <div
          ref={viewportRef}
          className="min-h-0 flex-1 snap-x snap-mandatory overflow-hidden motion-reduce:overflow-x-auto"
        >
          <div ref={trackRef} className="flex h-full w-full">
            {SERVICES.map((service, index) => (
              <div
                key={service.key}
                data-card
                className="flex h-full w-full shrink-0 snap-center items-center justify-center px-1 sm:px-3"
              >
                <TiltCard
                  maxTilt={2.5}
                  className="h-full w-full max-w-5xl"
                >
                  <article className="group relative grid h-full grid-rows-[42%_1fr] overflow-hidden rounded-3xl border border-gold-500/25 bg-white-soft shadow-[var(--shadow-warm)] transition-[border-color,box-shadow] duration-500 hover:border-gold-500/60 md:grid-cols-[1.08fr_0.92fr] md:grid-rows-1">
                    <span
                      aria-hidden
                      className="absolute inset-x-12 top-0 z-20 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
                    />

                    <div className="relative min-h-0 overflow-hidden">
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        quality={78}
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="object-cover transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.045]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fixed-dark/25 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-white-soft/20 rtl:md:bg-gradient-to-l"
                      />
                      <div aria-hidden className="dark-scrim" />
                    </div>

                    <div className="relative flex min-h-0 flex-col justify-center overflow-y-auto p-6 sm:p-9 md:p-12">
                      <span
                        aria-hidden
                        className="pointer-events-none absolute end-7 top-3 font-serif text-7xl leading-none text-gold-500/[0.08] sm:end-10 sm:top-6 sm:text-8xl"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="relative mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500 text-gold-ink shadow-[var(--shadow-warm-sm)] sm:mb-6 sm:h-14 sm:w-14">
                        <service.icon
                          className="h-6 w-6 sm:h-7 sm:w-7"
                          strokeWidth={1.75}
                        />
                      </div>

                      <p className="relative mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {String(SERVICES.length).padStart(2, "0")}
                      </p>
                      <h3 className="relative mb-3 font-serif text-2xl leading-tight text-ink sm:text-3xl">
                        {t(`items.${service.key}.title`)}
                      </h3>
                      <p className="relative max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
                        {t(`items.${service.key}.body`)}
                      </p>
                    </div>
                  </article>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>

        <div
          aria-hidden
          className="mx-auto mt-4 flex w-full max-w-5xl shrink-0 items-center gap-4 text-xs font-semibold tracking-[0.18em] text-ink-mute sm:mt-5"
        >
          <span ref={currentStepRef} className="w-6 text-gold-600">
            01
          </span>
          <div className="relative h-px flex-1 overflow-hidden bg-ink/15">
            <div
              ref={progressRef}
              className="absolute inset-y-0 start-0 w-full origin-left scale-x-25 bg-gold-500 rtl:origin-right"
            />
          </div>
          <span>{String(SERVICES.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
