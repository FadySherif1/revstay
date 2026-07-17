"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PLATFORMS } from "@/lib/platforms";

const HEADLINE = "Turn Empty Rooms Into Booked Nights";

export function Hero() {
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
        </div>
      </div>

      {/* Readability overlays: warm ivory rising from the bottom + soft top light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(250,246,239,0.10) 0%, rgba(250,246,239,0.30) 38%, rgba(250,246,239,0.82) 72%, rgba(250,246,239,0.97) 100%)",
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
          OTA Revenue Management for Hotels
        </motion.p>

        <h1 className="mb-6 font-serif text-4xl leading-tight text-ink sm:text-6xl md:text-7xl">
          {HEADLINE.split(" ").map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              custom={i}
              initial={prefersReducedMotion ? undefined : "hidden"}
              animate="visible"
              variants={wordVariants}
              className="inline-block pr-[0.25em]"
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
          Revstay builds and optimizes your hotel&apos;s presence on
          Booking.com, Expedia, Agoda, Airbnb, and every platform that
          matters — so travelers find you first, book faster, and your
          revenue grows.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={fadeUp(0.7)}
          className="mb-8 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#book"
            className="hero-cta-glow rounded-full bg-gold-500 px-8 py-3.5 text-base font-semibold text-ink transition-transform hover:scale-[1.03] hover:bg-gold-400"
          >
            Book a Free Consultation
          </a>
          <a
            href="#services"
            className="rounded-full border border-ink/25 bg-white-soft/60 px-8 py-3.5 text-base font-semibold text-ink backdrop-blur-sm transition-colors hover:border-gold-500 hover:text-gold-600"
          >
            See How It Works
          </a>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={fadeUp(0.9)}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-mute">
            Trusted expertise across the world&apos;s leading booking platforms
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

      {/* Scroll indicator */}
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1.3, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-9 w-5 rounded-full border border-ink/30 p-1 will-change-transform"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-gold-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
