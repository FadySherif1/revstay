"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useAuthModal } from "@/components/auth/auth-provider";
import { TrustBadges } from "@/components/sections/trust-badges";

export function Hero() {
  const t = useTranslations("hero");
  const { requestBooking } = useAuthModal();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!sectionRef.current || !contentRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      if (imageRef.current) {
        gsap.to(imageRef.current, {
          // The image layer starts 5% above the hero and is 125% tall. Moving
          // it up by 16% travels the remaining 20% of the hero, progressively
          // trading the ceiling for the bed at the bottom of the photo.
          yPercent: -16,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const wordVariants = {
    hidden: { opacity: 0, y: "0.6em" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: prefersReducedMotion ? 0 : 0.08 * i,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  const fadeUp = (delay: number) => ({
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: prefersReducedMotion ? 0 : delay,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate flex min-h-screen items-end overflow-hidden bg-cream pb-20 sm:items-center sm:pb-0"
    >
      {/* Full-bleed hotel-room photo with parallax + Ken Burns */}
      <div
        ref={imageRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[5%] -z-20 h-[125%] will-change-transform"
      >
        <div
          className={
            prefersReducedMotion
              ? "h-full w-full"
              : "ken-burns h-full w-full origin-bottom"
          }
        >
          <Image
            src="/images/hero-hotel-room2.png"
            alt=""
            fill
            priority
            quality={82}
            sizes="100vw"
            className="section-photo object-cover object-[70%_center] sm:object-center"
          />
          <div aria-hidden className="dark-scrim" />
        </div>
      </div>

      {/* Readability overlays: theme background rising from the bottom + soft top light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-ivory) 10%, transparent) 0%, color-mix(in srgb, var(--color-ivory) 26%, transparent) 38%, color-mix(in srgb, var(--color-ivory) 60%, transparent) 70%, color-mix(in srgb, var(--color-ivory) 78%, transparent) 90%, var(--color-ivory) 100%)",
        }}
      />

      <div
        ref={contentRef}
        className="relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-24 text-center will-change-transform"
      >
        <motion.p
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={fadeUp(0)}
          className="mb-6 rounded-full bg-white-soft/70 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600 backdrop-blur-sm"
        >
          {t("eyebrow")}
        </motion.p>

        <h1 className="mb-6 font-serif text-4xl leading-tight text-ink sm:text-6xl md:text-7xl">
          {t("headline").split(" ").map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              custom={i}
              initial={prefersReducedMotion ? undefined : "hidden"}
              animate="visible"
              variants={wordVariants}
              className="inline-block pe-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={fadeUp(0.5)}
          className="mb-10 max-w-2xl text-lg font-medium text-ink-soft sm:text-xl"
        >
          {t("sub")}
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={fadeUp(0.7)}
          className="mb-8 flex flex-col items-center gap-4 sm:flex-row"
        >
          <button
            type="button"
            onClick={requestBooking}
            className="hero-cta-glow rounded-full bg-gold-500 px-8 py-3.5 text-base font-semibold text-gold-ink transition-transform hover:scale-[1.03] hover:bg-gold-400"
          >
            {t("ctaPrimary")}
          </button>
          <a
            href="#how-it-works"
            className="rounded-full border border-ink/25 bg-white-soft/60 px-8 py-3.5 text-base font-semibold text-ink backdrop-blur-sm transition-colors hover:border-gold-500 hover:text-gold-600"
          >
            {t("ctaSecondary")}
          </a>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={fadeUp(0.9)}
          className="flex w-full flex-col items-center gap-4"
        >
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-mute">
            {t("trust")}
          </p>
          <TrustBadges />
        </motion.div>
      </div>
    </section>
  );
}
