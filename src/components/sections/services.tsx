"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Camera, TrendingUp, BarChart3 } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";

const SERVICES = [
  {
    icon: Building2,
    title: "OTA Listing Creation",
    body: "We build your hotel's pages on Booking.com, Expedia, and TripAdvisor from scratch — structured to rank and designed to sell.",
  },
  {
    icon: Camera,
    title: "Content & Presentation",
    body: "Compelling room showcases, persuasive descriptions, and visual storytelling that makes travelers stop scrolling.",
  },
  {
    icon: TrendingUp,
    title: "Visibility Optimization",
    body: "Continuous tuning of rankings, reviews strategy, and platform algorithms to keep you ahead.",
  },
  {
    icon: BarChart3,
    title: "Performance & Growth",
    body: "Transparent reporting on occupancy, bookings, and revenue — so you see exactly what we deliver.",
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll("[data-card]");
      if (!cards?.length) return;

      cards.forEach((card) => {
        const icon = card.querySelector("[data-icon]");
        if (icon) {
          gsap.set(icon, { scale: 0.4, opacity: 0 });
        }
      });

      gsap.from(cards, {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 75%",
        },
        onComplete: () => {
          cards.forEach((card) => {
            const icon = card.querySelector("[data-icon]");
            if (icon) {
              gsap.to(icon, {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: "back.out(2)",
              });
            }
          });
        },
      });

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

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-navy-900 py-24 sm:py-32"
    >
      {/* Parallax geometric motif background, ~3% opacity */}
      <div
        ref={patternRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] will-change-transform"
      >
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
          className="h-[130%] w-full"
        >
          <pattern
            id="egypt-grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M25,0 L50,25 L25,50 L0,25 Z"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1"
            />
            <circle cx="25" cy="25" r="4" fill="none" stroke="#d4af37" strokeWidth="1" />
          </pattern>
          <rect width="400" height="400" fill="url(#egypt-grid)" />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
            What We Do
          </p>
          <h2 className="mb-4 font-serif text-3xl leading-tight text-offwhite sm:text-5xl">
            Your Hotel, Everywhere Travelers Book
          </h2>
          <p className="text-lg text-offwhite/60">
            End-to-end management of your presence on the world&apos;s leading
            travel platforms.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SERVICES.map((service) => (
            <TiltCard key={service.title}>
              <div
                data-card
                className="group rounded-2xl border border-offwhite/10 bg-white/[0.04] p-6 backdrop-blur-md transition-transform duration-300 will-change-transform hover:-translate-y-1.5 hover:border-gold-400/40 hover:shadow-[0_0_30px_-8px_rgba(212,175,55,0.35)]"
              >
                <div
                  data-icon
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 ring-1 ring-gold-400/25"
                >
                  <service.icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="mb-2 font-serif text-lg text-offwhite">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-offwhite/60">
                  {service.body}
                </p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
