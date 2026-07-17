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
    body: "We build your hotel's pages across all major booking platforms — Booking.com, Agoda, Expedia, Airbnb, Hotelbeds, Hotels.com, and Trip.com — structured to rank and designed to sell.",
    gradient: "from-gold-300 to-gold-500",
  },
  {
    icon: Camera,
    title: "Content & Presentation",
    body: "Compelling room showcases, persuasive descriptions, and visual storytelling that makes travelers stop scrolling.",
    gradient: "from-teal-400 to-teal-600",
  },
  {
    icon: TrendingUp,
    title: "Visibility Optimization",
    body: "Continuous tuning of rankings, reviews strategy, and platform algorithms to keep you ahead.",
    gradient: "from-gold-400 to-teal-500",
  },
  {
    icon: BarChart3,
    title: "Performance & Growth",
    body: "Transparent reporting on occupancy, bookings, and revenue — so you see exactly what we deliver.",
    gradient: "from-teal-500 to-gold-500",
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
        if (icon) gsap.set(icon, { scale: 0.4, opacity: 0 });
      });

      gsap.from(cards, {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: { trigger: gridRef.current, start: "top 75%" },
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
            <path d="M25,0 L50,25 L25,50 L0,25 Z" fill="none" stroke="#a9861d" strokeWidth="1" />
            <circle cx="25" cy="25" r="4" fill="none" stroke="#a9861d" strokeWidth="1" />
          </pattern>
          <rect width="400" height="400" fill="url(#egypt-grid)" />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            What We Do
          </p>
          <h2 className="mb-4 font-serif text-3xl leading-tight text-ink sm:text-5xl">
            Your Hotel, Everywhere Travelers Book
          </h2>
          <p className="text-lg text-ink-soft">
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
                className="group h-full overflow-hidden rounded-2xl border border-ink/10 bg-white-soft shadow-[var(--shadow-warm-sm)] transition-shadow duration-300 hover:shadow-[var(--shadow-warm)]"
              >
                {/* Decorative gradient top area with zoom-on-hover */}
                <div className="relative h-28 overflow-hidden">
                  <div
                    className={`absolute inset-0 scale-100 bg-gradient-to-br ${service.gradient} transition-transform duration-500 will-change-transform group-hover:scale-110`}
                  />
                  <div
                    data-icon
                    className="absolute bottom-3 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white-soft/90 text-gold-600 shadow-sm ring-1 ring-white/50"
                  >
                    <service.icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 font-serif text-lg text-ink">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {service.body}
                  </p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
