"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Camera, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";

const SERVICES = [
  {
    icon: Building2,
    title: "OTA Listing Creation",
    body: "We build your hotel's pages across all major booking platforms — Booking.com, Agoda, Expedia, Airbnb, Hotelbeds, Hotels.com, and Trip.com — structured to rank and designed to sell.",
    image: "/images/services/listing.avif",
  },
  {
    icon: Camera,
    title: "Content & Presentation",
    body: "Compelling room showcases, persuasive descriptions, and visual storytelling that makes travelers stop scrolling.",
    image: "/images/services/content.avif",
  },
  {
    icon: TrendingUp,
    title: "Visibility Optimization",
    body: "Continuous tuning of rankings, reviews strategy, and platform algorithms to keep you ahead.",
    image: "/images/services/visibility.jpg",
  },
  {
    icon: BarChart3,
    title: "Performance & Growth",
    body: "Transparent reporting on occupancy, bookings, and revenue — so you see exactly what we deliver.",
    image: "/images/services/growth.jpg",
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
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { clipPath: "inset(0% 0% 100% 0%)", y: 24 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: gridRef.current, start: "top 78%" },
          }
        );
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
            <TiltCard key={service.title} maxTilt={4} className="h-full">
              <article
                data-card
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white-soft shadow-[var(--shadow-warm-sm)] transition-shadow duration-300 hover:shadow-[var(--shadow-warm)]"
              >
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
                        "linear-gradient(to bottom, rgba(43,38,32,0.05) 0%, transparent 35%, rgba(255,253,249,0.15) 78%, var(--color-white-soft) 100%)",
                    }}
                  />
                </div>

                {/* Text area */}
                <div className="relative flex flex-1 flex-col p-6 pt-9">
                  {/* Frosted-glass icon, overlapping the image/text boundary */}
                  <div className="absolute -top-6 left-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white-soft/70 text-gold-600 shadow-[var(--shadow-warm-sm)] backdrop-blur-md">
                    <service.icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>

                  <h3 className="mb-2 font-serif text-lg text-ink">
                    {service.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-ink-soft">
                    {service.body}
                  </p>

                  {/* Learn more — slides in on hover */}
                  <button
                    type="button"
                    // TODO: link to /services/<slug> once service detail pages exist
                    aria-label={`Learn more about ${service.title}`}
                    className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-gold-600 opacity-0 transition-all duration-300 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 focus-visible:translate-x-0 focus-visible:opacity-100 focus-visible:outline-none"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
