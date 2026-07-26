"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ORNAMENT_X = [80, 260, 440, 620, 800, 980, 1160, 1340];

function LotusOrnament({ x }: { x: number }) {
  return (
    <g data-ornament transform={`translate(${x},60)`} opacity={0}>
      <path
        d="M0,20 Q-10,0 0,-16 Q10,0 0,20"
        fill="none"
        stroke="var(--color-gold-600)"
        strokeWidth="1.5"
      />
      <path
        d="M-14,14 Q-16,0 -4,-8"
        fill="none"
        stroke="var(--color-gold-600)"
        strokeWidth="1"
      />
      <path
        d="M14,14 Q16,0 4,-8"
        fill="none"
        stroke="var(--color-gold-600)"
        strokeWidth="1"
      />
    </g>
  );
}

export function ScrollScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      const ornaments =
        sectionRef.current.querySelectorAll<SVGGElement>("[data-ornament]");
      ornaments.forEach((ornament) => {
        ornament.style.opacity = "1";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const line = lineRef.current;
      const ornaments = sectionRef.current?.querySelectorAll("[data-ornament]");
      if (!line) return;

      const length = line.getTotalLength();
      gsap.set(line, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      gsap.to(line, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 60%",
          scrub: true,
        },
      });

      if (ornaments?.length) {
        gsap.to(ornaments, {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      aria-hidden
      className="relative mx-auto h-24 w-full max-w-6xl overflow-hidden px-6"
    >
      {/* Hieroglyph-inspired geometric pattern strip, very low opacity */}
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-[0.06]"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <rect
            key={i}
            x={i * 60 + 10}
            y={30}
            width="18"
            height="60"
            fill="none"
            stroke="var(--color-gold-600)"
            strokeWidth="1"
          />
        ))}
      </svg>

      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="relative h-full w-full"
      >
        <line
          ref={lineRef}
          x1="40"
          y1="60"
          x2="1400"
          y2="60"
          stroke="var(--color-gold-600)"
          strokeWidth="1.5"
        />
        {ORNAMENT_X.map((x) => (
          <LotusOrnament key={x} x={x} />
        ))}
      </svg>
    </div>
  );
}
