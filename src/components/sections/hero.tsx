"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HEADLINE = "Turn Empty Rooms Into Booked Nights";

const PLATFORMS = ["Booking.com", "Expedia", "TripAdvisor"];

const FLOATING_STATS = [
  { label: "+42% Direct Bookings", className: "left-[4%] top-[18%] md:left-[8%]" },
  { label: "Occupancy 94%", className: "right-[4%] top-[30%] md:right-[10%]" },
  { label: "+3.1★ Guest Rating", className: "left-[10%] bottom-[14%] md:left-[16%]" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
      className="relative flex min-h-screen items-center overflow-hidden bg-navy-900"
    >
      {/* Animated gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="hero-glow absolute left-1/2 top-1/3 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/20 blur-[120px]" />
      </div>

      {/* Grain overlay */}
      <div aria-hidden className="hero-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.06]" />

      {/* Floating stat cards */}
      {FLOATING_STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  opacity: 1,
                  y: [0, -14, 0],
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  opacity: { duration: 0.8, delay: 0.6 + i * 0.15 },
                  y: {
                    duration: 5 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1 + i * 0.3,
                  },
                }
          }
          className={`pointer-events-none absolute z-10 hidden rounded-2xl border border-gold-300/20 bg-white/5 px-5 py-3 text-sm font-medium text-offwhite/90 shadow-lg backdrop-blur-md sm:block will-change-transform ${
            i === 2 ? "lg:block" : "sm:block"
          } ${stat.className}`}
        >
          {stat.label}
        </motion.div>
      ))}

      <div
        ref={contentRef}
        className="relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-24 text-center will-change-transform"
      >
        <motion.p
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={fadeUp(0)}
          className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400"
        >
          OTA Revenue Management for Hotels
        </motion.p>

        <h1 className="mb-6 font-serif text-4xl leading-tight text-offwhite sm:text-6xl md:text-7xl">
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
          className="mb-10 max-w-2xl text-lg text-offwhite/70 sm:text-xl"
        >
          Revstay builds and optimizes your hotel&apos;s presence on
          Booking.com, Expedia, and TripAdvisor — so travelers find you
          first, book faster, and your revenue grows.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={fadeUp(0.7)}
          className="mb-8 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#book"
            className="hero-cta-glow rounded-full bg-gold-500 px-8 py-3.5 text-base font-semibold text-navy-950 transition-transform hover:scale-[1.03] hover:bg-gold-400"
          >
            Book a Free Consultation
          </a>
          <a
            href="#services"
            className="rounded-full border border-offwhite/25 px-8 py-3.5 text-base font-semibold text-offwhite/90 transition-colors hover:border-gold-400/60 hover:text-gold-300"
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
          <p className="text-xs uppercase tracking-[0.15em] text-offwhite/50">
            Trusted expertise across the world&apos;s leading booking platforms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {PLATFORMS.map((platform) => (
              <span
                key={platform}
                className="rounded-full border border-offwhite/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-offwhite/60"
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
          className="h-9 w-5 rounded-full border border-offwhite/30 p-1 will-change-transform"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
