"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  EyeOff,
  ImageOff,
  CircleDollarSign,
  ArrowUpRight,
  Sparkles,
  LineChart,
  ChevronRight,
} from "lucide-react";

const PROBLEMS = [
  {
    icon: EyeOff,
    title: "Invisible on booking platforms",
    body: "Your hotel is buried on page 10 of Booking.com while competitors take your guests.",
  },
  {
    icon: ImageOff,
    title: "Listings that don't sell",
    body: "Poor photos, weak descriptions, and unoptimized pricing push travelers away in seconds.",
  },
  {
    icon: CircleDollarSign,
    title: "Revenue left on the table",
    body: "Empty rooms every night are profit you never get back.",
  },
];

const SOLUTIONS = [
  {
    icon: ArrowUpRight,
    title: "Rank higher, get seen",
    body: "We optimize your listings to climb search results on every major platform.",
  },
  {
    icon: Sparkles,
    title: "Listings that convert",
    body: "Professional presentation that turns browsers into booked guests.",
  },
  {
    icon: LineChart,
    title: "Occupancy that grows",
    body: "More visibility + better conversion = measurable revenue growth.",
  },
];

export function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLParagraphElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const problemItems = problemRef.current?.querySelectorAll("[data-item]");
      const solutionItems = solutionRef.current?.querySelectorAll("[data-item]");
      const borders = solutionRef.current?.querySelectorAll("[data-border]");
      const chevrons = sectionRef.current?.querySelectorAll("[data-chevron]");

      if (problemItems?.length) {
        gsap.from(problemItems, {
          opacity: 0,
          y: 32,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: { trigger: problemRef.current, start: "top 75%" },
        });
      }

      if (solutionItems?.length) {
        gsap.from(solutionItems, {
          opacity: 0,
          y: 32,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
          delay: 0.15,
          scrollTrigger: { trigger: solutionRef.current, start: "top 75%" },
        });
      }

      // Gold left-borders draw in (height 0 -> 100%)
      if (borders?.length) {
        gsap.fromTo(
          borders,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
            delay: 0.3,
            transformOrigin: "top",
            scrollTrigger: { trigger: solutionRef.current, start: "top 75%" },
          }
        );
      }

      // Chevron flow: light up sequentially, looping subtly
      if (chevrons?.length) {
        gsap.set(chevrons, { opacity: 0.2 });
        gsap.to(chevrons, {
          opacity: 1,
          duration: 0.5,
          stagger: 0.25,
          repeat: -1,
          repeatDelay: 0.6,
          yoyo: true,
          ease: "power1.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        });
      }

      if (closingRef.current) {
        gsap.from(closingRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: closingRef.current, start: "top 90%" },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="problem-solution"
      className="relative overflow-hidden bg-white-soft py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            The Challenge
          </p>
          <h2 className="font-serif text-3xl leading-tight text-ink sm:text-5xl">
            Great Hotels Stay Empty for One Reason: Nobody Finds Them
          </h2>
        </div>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
          {/* BEFORE — problem column */}
          <div ref={problemRef} className="space-y-6">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-ink-mute md:text-left">
              Before
            </p>
            {PROBLEMS.map((item, i) => (
              <div
                key={item.title}
                data-item
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex gap-4 rounded-2xl border border-ink/10 bg-sand/40 p-5 saturate-[0.7] transition-all duration-300 ${
                  activeIndex === i
                    ? "ring-2 ring-gold-500/50 saturate-100"
                    : ""
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink-mute">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="relative mb-1 inline-block font-semibold text-ink/70">
                    {item.title}
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink-mute/40"
                    />
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Transformation flow — vertical chevrons (desktop) / horizontal (mobile) */}
          <div
            aria-hidden
            className="flex items-center justify-center gap-2 py-2 md:flex-col md:px-3 md:py-0"
          >
            {[0, 1, 2].map((n) => (
              <ChevronRight
                key={n}
                data-chevron
                className="h-6 w-6 text-gold-500 drop-shadow-[0_0_6px_rgba(201,162,39,0.5)] md:rotate-90"
                strokeWidth={2.5}
              />
            ))}
          </div>

          {/* AFTER — solution column */}
          <div ref={solutionRef} className="space-y-6">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-gold-600 drop-shadow-[0_0_10px_rgba(201,162,39,0.35)] md:text-left">
              After
            </p>
            {SOLUTIONS.map((item, i) => (
              <div
                key={item.title}
                data-item
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`relative flex gap-4 overflow-hidden rounded-2xl border border-gold-500/20 bg-ivory p-5 pl-6 shadow-[var(--shadow-warm-sm)] transition-all duration-300 ${
                  activeIndex === i ? "ring-2 ring-gold-500/60" : ""
                }`}
              >
                {/* Draw-in gold left border */}
                <span
                  data-border
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-1 origin-top bg-gold-500"
                />
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white-soft">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-ink">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p
          ref={closingRef}
          className="mx-auto mt-16 max-w-2xl text-center font-serif text-xl italic text-ink/80 sm:text-2xl"
        >
          This transformation is what we do. Every day.
        </p>
      </div>
    </section>
  );
}
