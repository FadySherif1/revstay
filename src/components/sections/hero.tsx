"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { PLATFORMS } from "@/lib/platforms";

export function Hero() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!sectionRef.current || !contentRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const isMobile = window.matchMedia("(max-width: 640px)").matches;

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
          y: isMobile ? 60 : 140,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
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
      className="relative flex min-h-screen items-end overflow-hidden bg-cream pb-20 sm:items-center sm:pb-0"
    >
      {/* Full-bleed golden-hour photo with parallax + Ken Burns */}
      <div
        ref={imageRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 h-[120%] will-change-transform"
      >
        <div className={prefersReducedMotion ? "h-full w-full" : "ken-burns h-full w-full"}>
          <Image
            src="/images/pyramids2.jpg"
            alt=""
            fill
            priority
            quality={82}
            sizes="100vw"
            className="object-cover object-[center_30%]"
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
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-ivory) 10%, transparent) 0%, color-mix(in srgb, var(--color-ivory) 30%, transparent) 38%, color-mix(in srgb, var(--color-ivory) 82%, transparent) 72%, color-mix(in srgb, var(--color-ivory) 97%, transparent) 100%)",
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
          <a
            href="#book"
            className="hero-cta-glow rounded-full bg-gold-500 px-8 py-3.5 text-base font-semibold text-gold-ink transition-transform hover:scale-[1.03] hover:bg-gold-400"
          >
            {t("ctaPrimary")}
          </a>
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
          className="flex flex-col items-center gap-3"
        >
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-mute">
            {t("trust")}
          </p>
          <div className="flex max-w-xl flex-wrap items-center justify-center gap-2.5">
            {PLATFORMS.map((platform) => (
              <span
                key={platform}
                className="rounded-full border border-ink/10 bg-white-soft/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-ink-soft"
              >
                {platform}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
