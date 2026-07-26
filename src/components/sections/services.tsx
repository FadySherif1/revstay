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
  const gridRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;

    const hoverCleanups: Array<() => void> = [];
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll("[data-card]");
      if (cards?.length) {
        const cardElements = gsap.utils.toArray<HTMLElement>(cards);

        gsap.fromTo(
          cardElements,
          { opacity: 0, y: 42, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );

        const canHover = window.matchMedia(
          "(hover: hover) and (pointer: fine)"
        ).matches;

        if (canHover) {
          cardElements.forEach((card) => {
            const otherCards = cardElements.filter((item) => item !== card);

            const handlePointerEnter = () => {
              gsap.set(card, { zIndex: 10 });
              gsap.to(card, {
                y: -12,
                scale: 1.025,
                opacity: 1,
                duration: 0.45,
                ease: "power3.out",
                overwrite: "auto",
              });
              gsap.to(otherCards, {
                y: 3,
                scale: 0.985,
                opacity: 0.68,
                duration: 0.4,
                ease: "power3.out",
                overwrite: "auto",
              });
            };

            const handlePointerLeave = () => {
              gsap.to(cardElements, {
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: "power3.out",
                overwrite: "auto",
                onComplete: () => {
                  gsap.set(cardElements, { clearProps: "zIndex" });
                },
              });
            };

            card.addEventListener("pointerenter", handlePointerEnter);
            card.addEventListener("pointerleave", handlePointerLeave);
            hoverCleanups.push(() => {
              card.removeEventListener("pointerenter", handlePointerEnter);
              card.removeEventListener("pointerleave", handlePointerLeave);
            });
          });
        }
      }

      if (patternRef.current) {
        gsap.to(patternRef.current, {
          y: 60,
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

    return () => {
      hoverCleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-ivory py-24 sm:py-32"
    >
      {/* Parallax geometric motif background */}
      <div
        ref={patternRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] will-change-transform"
      >
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
          className="h-[130%] w-full"
        >
          <pattern id="egypt-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M25,0 L50,25 L25,50 L0,25 Z" fill="none" stroke="var(--color-gold-600)" strokeWidth="1" />
            <circle cx="25" cy="25" r="4" fill="none" stroke="var(--color-gold-600)" strokeWidth="1" />
          </pattern>
          <rect width="400" height="400" fill="url(#egypt-grid)" />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            {t("eyebrow")}
          </p>
          <h2 className="mb-4 font-serif text-3xl leading-tight text-ink sm:text-5xl">
            {t("headline")}
          </h2>
          <p className="text-lg text-ink-soft">
            {t("sub")}
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SERVICES.map((service) => (
            <div key={service.key} data-card className="h-full">
              <TiltCard maxTilt={3} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white-soft shadow-[var(--shadow-warm-sm)] transition-[border-color,box-shadow] duration-500 hover:border-gold-500/55 hover:shadow-[var(--shadow-warm)]">
                  <span
                    aria-hidden
                    className="absolute inset-x-8 top-0 z-20 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
                  />

                  {/* Image area (~55%) */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      quality={72}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[600ms] ease-out will-change-transform group-hover:scale-[1.06]"
                    />
                    {/* Warm scrim fading into the text area */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, color-mix(in srgb, var(--color-fixed-dark) 5%, transparent) 0%, transparent 35%, color-mix(in srgb, var(--color-white-soft) 15%, transparent) 78%, var(--color-white-soft) 100%)",
                      }}
                    />
                    <div aria-hidden className="dark-scrim" />
                  </div>

                  {/* Text area */}
                  <div className="relative flex flex-1 flex-col p-6 pt-9">
                    {/* Frosted-glass icon, overlapping the image/text boundary */}
                    <div className="absolute -top-6 left-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white-soft/70 text-gold-600 shadow-[var(--shadow-warm-sm)] backdrop-blur-md">
                      <service.icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>

                    <h3 className="mb-2 font-serif text-lg text-ink">
                      {t(`items.${service.key}.title`)}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-ink-soft">
                      {t(`items.${service.key}.body`)}
                    </p>
                  </div>
                </article>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
