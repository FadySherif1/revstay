"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATS = [
  {
    target: 7,
    prefix: "",
    suffix: "",
    label: "Booking platforms managed under one strategy",
  },
  {
    target: 24,
    prefix: "",
    suffix: "/7",
    label: "Continuous listing monitoring & rate management",
  },
  {
    target: 1,
    prefix: "",
    suffix: "",
    label: "Dedicated team owning your entire OTA presence",
  },
  {
    target: 100,
    prefix: "",
    suffix: "%",
    label: "Transparency in reporting, always",
  },
];

export function Results() {
  const sectionRef = useRef<HTMLElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const pyramidsRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      numberRefs.current.forEach((el, i) => {
        if (el) el.textContent = `${STATS[i].prefix}${STATS[i].target}${STATS[i].suffix}`;
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (borderRef.current) {
        gsap.fromTo(
          borderRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power2.out",
            transformOrigin: "left",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
          }
        );
      }

      if (imageRef.current) {
        gsap.to(imageRef.current, {
          y: 80,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (pyramidsRef.current) {
        gsap.to(pyramidsRef.current, {
          y: 50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          STATS.forEach((stat, i) => {
            const el = numberRefs.current[i];
            if (!el) return;
            const counter = { value: 0 };
            gsap.to(counter, {
              value: stat.target,
              duration: 1.8,
              ease: "power2.out",
              delay: i * 0.1,
              onUpdate: () => {
                el.textContent = `${stat.prefix}${Math.round(counter.value)}${stat.suffix}`;
              },
            });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="results"
      className="relative overflow-hidden bg-sand py-24 sm:py-32"
    >
      <div
        ref={borderRef}
        aria-hidden
        className="absolute inset-x-0 top-0 z-20 h-px origin-left bg-gradient-to-r from-transparent via-gold-500/70 to-transparent"
      />

      {/* Parallax photo background */}
      <div
        ref={imageRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 h-[120%] will-change-transform"
      >
        <Image
          src="/images/pyramids1.jpg"
          alt=""
          fill
          quality={75}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Warm ivory overlay (~85%) so counters pop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-ivory/[0.88]"
      />

      {/* Ghosted pyramid outlines, recolored gold for light bg */}
      <div
        ref={pyramidsRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
      >
        <svg
          viewBox="0 0 1440 500"
          preserveAspectRatio="xMidYMax slice"
          className="h-full w-full opacity-[0.10]"
        >
          <polygon points="120,480 320,180 520,480" fill="none" stroke="#8a6c17" strokeWidth="2" />
          <polygon points="850,480 1080,120 1310,480" fill="none" stroke="#8a6c17" strokeWidth="2" />
          <polygon points="1000,480 1160,220 1320,480" fill="none" stroke="#8a6c17" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Our Commitment
          </p>
          <h2 className="font-serif text-3xl leading-tight text-ink sm:text-5xl">
            Built to Deliver
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <span
                ref={(el) => {
                  numberRefs.current[i] = el;
                }}
                className="block font-serif text-4xl text-gold-600 sm:text-5xl md:text-6xl"
              >
                {stat.prefix}
                {0}
                {stat.suffix}
              </span>
              <p className="mt-3 text-sm font-medium leading-relaxed text-ink-soft">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
