"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EyeOff, ImageOff, CircleDollarSign, ArrowUpRight, Sparkles, LineChart } from "lucide-react";

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
  const dividerRef = useRef<HTMLDivElement>(null);

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

      if (problemItems?.length) {
        gsap.from(problemItems, {
          opacity: 0,
          y: 32,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: problemRef.current,
            start: "top 75%",
          },
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
          scrollTrigger: {
            trigger: solutionRef.current,
            start: "top 75%",
          },
        });
      }

      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1,
            ease: "power2.out",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="problem-solution"
      className="relative overflow-hidden bg-navy-900 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
            The Challenge
          </p>
          <h2 className="font-serif text-3xl leading-tight text-offwhite sm:text-5xl">
            Great Hotels Stay Empty for One Reason: Nobody Finds Them
          </h2>
        </div>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Divider line */}
          <div
            ref={dividerRef}
            aria-hidden
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-400/40 to-transparent md:block"
          />

          {/* Problem column */}
          <div ref={problemRef} className="space-y-8 opacity-90 grayscale-[35%]">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-offwhite/40">
              The Problem
            </h3>
            {PROBLEMS.map((item) => (
              <div
                key={item.title}
                data-item
                className="flex gap-4 rounded-2xl border border-offwhite/10 bg-white/[0.02] p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-offwhite/5 text-offwhite/50">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-offwhite/80">
                    {item.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-offwhite/50">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Solution column */}
          <div ref={solutionRef} className="space-y-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-400">
              The Revstay Solution
            </h3>
            {SOLUTIONS.map((item) => (
              <div
                key={item.title}
                data-item
                className="flex gap-4 rounded-2xl border border-gold-400/20 bg-gold-500/[0.06] p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-offwhite">
                    {item.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-offwhite/70">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
