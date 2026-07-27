"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { PLATFORM_DETAILS } from "@/lib/platforms";
import { TiltCard } from "@/components/ui/tilt-card";
import { useTheme } from "@/components/ui/theme-provider";

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
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const currentPlatformRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const progressElement = progressRef.current;
    const currentPlatformElement = currentPlatformRef.current;

    if (!section || !stage) return;

    const cards = gsap.utils.toArray<HTMLElement>(
      stage.querySelectorAll("[data-platform-card]")
    );
    const articles = cards.map((card) =>
      card.querySelector<HTMLElement>("[data-platform-content]")
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      articles.forEach((article) => {
        if (article) article.tabIndex = 0;
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const headingItems =
        headingRef.current?.querySelectorAll("[data-platform-reveal]");
      const isRtl = document.documentElement.dir === "rtl";
      const direction = isRtl ? -1 : 1;
      const lastCardIndex = cards.length - 1;
      const scrollState = { position: 0 };
      let activeCardIndex = -1;

      const updateCards = () => {
        const position = scrollState.position;
        const nextActiveCardIndex = Math.round(position);
        const stageWidth = stage.clientWidth;
        const isMobile = stageWidth < 640;
        const spacing = isMobile
          ? stageWidth * 0.58
          : Math.min(stageWidth * 0.31, 410);

        cards.forEach((card, index) => {
          let offset = index - position;
          const halfOrbit = cards.length / 2;

          // Wrap the far cards behind the stage so the deck always has
          // visual depth on both sides, including at the first/last item.
          if (offset > halfOrbit) offset -= cards.length;
          if (offset < -halfOrbit) offset += cards.length;

          const distance = Math.abs(offset);
          const cappedOffset = gsap.utils.clamp(-2.8, 2.8, offset);
          const opacity =
            distance > 2.65
              ? 0
              : gsap.utils.interpolate(
                  1,
                  0.12,
                  Math.min(distance / 2.65, 1)
                );
          const scale = gsap.utils.interpolate(
            1,
            0.66,
            Math.min(distance / 2.5, 1)
          );

          gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            x: direction * cappedOffset * spacing,
            y: Math.min(distance, 2.5) * 14,
            z: -Math.min(distance, 3) * 190,
            rotateY:
              direction *
              gsap.utils.clamp(-68, 68, -cappedOffset * 38),
            scale,
            opacity,
            zIndex: 100 - Math.round(distance * 10),
            pointerEvents:
              index === nextActiveCardIndex ? "auto" : "none",
            force3D: true,
            transformOrigin: "50% 50%",
          });
        });

        if (nextActiveCardIndex !== activeCardIndex) {
          activeCardIndex = nextActiveCardIndex;

          cards.forEach((card, index) => {
            const isActive = index === activeCardIndex;
            const article = articles[index];
            const glow = card.querySelector<HTMLElement>(
              "[data-platform-glow]"
            );

            card.setAttribute("aria-hidden", String(!isActive));
            card.dataset.active = String(isActive);
            if (article) article.tabIndex = isActive ? 0 : -1;
            if (glow) {
              gsap.to(glow, {
                opacity: isActive ? 1 : 0,
                duration: 0.35,
                ease: "power2.out",
                overwrite: true,
              });
            }
          });
        }

        if (currentPlatformElement) {
          currentPlatformElement.textContent = String(
            nextActiveCardIndex + 1
          ).padStart(2, "0");
        }

        if (progressElement) {
          gsap.set(progressElement, {
            scaleX: (position + 1) / cards.length,
          });
        }
      };

      updateCards();

      if (headingItems?.length) {
        gsap.from(headingItems, {
          autoAlpha: 0,
          y: 22,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });
      }

      gsap.to(scrollState, {
        position: lastCardIndex,
        ease: "none",
        onUpdate: updateCards,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () =>
            `+=${Math.max(window.innerHeight * 0.42, 360) * lastCardIndex}`,
          pin: true,
          // <main> is a flex column, so margin spacing must be explicit.
          pinSpacing: "margin",
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap:
            lastCardIndex > 0
              ? {
                  snapTo: 1 / lastCardIndex,
                  duration: { min: 0.16, max: 0.38 },
                  delay: 0.04,
                  ease: "power2.inOut",
                }
              : undefined,
          onRefresh: updateCards,
        },
      });

      ScrollTrigger.refresh();
    }, section);

    return () => {
      ctx.revert();
      cards.forEach((card, index) => {
        card.removeAttribute("aria-hidden");
        delete card.dataset.active;
        if (articles[index]) articles[index]!.tabIndex = 0;
      });
      if (currentPlatformElement) {
        currentPlatformElement.textContent = "01";
      }
      if (progressElement) {
        gsap.set(progressElement, { clearProps: "transform" });
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="platforms"
      aria-roledescription="carousel"
      aria-label={t("regionLabel")}
      className="relative z-10 isolate h-[100svh] shrink-0 overflow-hidden bg-cream"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_56%,color-mix(in_srgb,var(--color-gold-500)_10%,transparent),transparent_42%)]"
      />

      <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-4 pb-5 pt-24 sm:px-6 sm:pb-7 lg:px-8">
        <div
          ref={headingRef}
          className="mx-auto mb-2 max-w-3xl shrink-0 text-center sm:mb-4"
        >
          <p
            data-platform-reveal
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600"
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

        <div
          ref={stageRef}
          className="relative min-h-[280px] flex-1 overflow-hidden [perspective:1400px] motion-reduce:flex motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:items-center motion-reduce:gap-4 motion-reduce:overflow-x-auto motion-reduce:[perspective:none]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[54%] h-[42%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-gold-500/15 shadow-[0_0_70px_color-mix(in_srgb,var(--color-gold-500)_8%,transparent)] [transform:translate(-50%,-50%)_rotateX(68deg)] motion-reduce:hidden"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[55%] h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-500/25 to-transparent motion-reduce:hidden"
          />

          {PLATFORM_DETAILS.map((platform, index) => {
            const accent =
              theme === "dark" ? platform.accentDark : platform.accentLight;
            const descKey = DESC_KEYS[platform.name];

            return (
              <div
                key={platform.name}
                data-platform-card
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${PLATFORM_DETAILS.length}: ${platform.name}`}
                className="absolute left-1/2 top-1/2 h-[clamp(230px,36svh,330px)] w-[82vw] max-w-[480px] will-change-transform motion-reduce:relative motion-reduce:left-auto motion-reduce:top-auto motion-reduce:h-[260px] motion-reduce:w-[82%] motion-reduce:shrink-0 motion-reduce:snap-center motion-reduce:transform-none"
              >
                <TiltCard maxTilt={3} className="h-full">
                  <article
                    data-platform-content
                    tabIndex={index === 0 ? 0 : -1}
                    aria-label={`${platform.name} — ${t(`descriptions.${descKey}`)}`}
                    className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border bg-white-soft p-7 shadow-[var(--shadow-warm)] outline-none transition-[border-color,box-shadow] duration-500 focus-visible:ring-2 focus-visible:ring-gold-500 sm:p-9"
                    style={{
                      borderColor: `rgba(${accent}, 0.45)`,
                      boxShadow: `0 30px 80px -42px rgba(${accent}, 0.62), var(--shadow-warm)`,
                    }}
                  >
                    <div
                      data-platform-glow
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0"
                      style={{
                        background: `radial-gradient(circle at 18% 12%, rgba(${accent}, 0.2), transparent 42%)`,
                      }}
                    />
                    <span
                      aria-hidden
                      className="absolute inset-y-0 start-0 w-1"
                      style={{
                        background: `linear-gradient(to bottom, transparent, rgb(${accent}), transparent)`,
                      }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute end-6 top-14 font-serif text-7xl leading-none text-ink/[0.045] sm:text-8xl"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="relative flex items-start justify-between gap-4">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-ink-mute">
                        Revstay / {t("eyebrow")}
                      </p>
                      <span
                        className="shrink-0 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider"
                        style={{
                          color: `rgb(${accent})`,
                          backgroundColor: `rgba(${accent}, 0.11)`,
                        }}
                      >
                        {t(`tags.${platform.tag}`)}
                      </span>
                    </div>

                    <div className="relative">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                        {t("eyebrow")} ·{" "}
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-serif text-3xl leading-none tracking-tight text-ink sm:text-4xl">
                        {platform.name}
                      </h3>
                    </div>

                    <div className="relative flex items-end justify-between gap-5">
                      <p className="max-w-xs text-sm leading-relaxed text-ink-soft sm:text-base">
                        {t(`descriptions.${descKey}`)}
                      </p>
                      <span
                        aria-hidden
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor: `rgb(${accent})`,
                          boxShadow: `0 0 18px rgba(${accent}, 0.72)`,
                        }}
                      />
                    </div>
                  </article>
                </TiltCard>
              </div>
            );
          })}
        </div>

        <div
          aria-hidden
          className="mx-auto mt-2 flex w-full max-w-xl shrink-0 items-center gap-4 text-xs font-semibold tracking-[0.18em] text-ink-mute sm:mt-3"
        >
          <span ref={currentPlatformRef} className="w-6 text-gold-600">
            01
          </span>
          <div className="relative h-px flex-1 overflow-hidden bg-ink/15">
            <div
              ref={progressRef}
              className="absolute inset-y-0 start-0 w-full origin-left scale-x-[0.142857] bg-gold-500 rtl:origin-right"
            />
          </div>
          <span>{String(PLATFORM_DETAILS.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
