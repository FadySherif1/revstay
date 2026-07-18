"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLocale } from "next-intl";
import { useTheme } from "@/components/ui/theme-provider";

const RAY_COUNT = 8;
const KNOB_TRAVEL = 20;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const locale = useLocale();
  // In RTL the pill is mirrored, so the knob must travel toward screen-left.
  const knobDir = locale === "ar" ? -1 : 1;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);
  const raysRef = useRef<SVGGElement>(null);
  const coreRef = useRef<SVGCircleElement>(null);
  const biteRef = useRef<SVGCircleElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!knobRef.current || !raysRef.current || !coreRef.current || !biteRef.current) {
      return;
    }

    const isDark = theme === "dark";

    if (prefersReducedMotion) {
      gsap.set(knobRef.current, { x: isDark ? KNOB_TRAVEL * knobDir : 0 });
      gsap.set(raysRef.current, { opacity: isDark ? 0 : 1, scale: isDark ? 0.4 : 1 });
      gsap.set(biteRef.current, { opacity: isDark ? 1 : 0, x: isDark ? 5 : 12 });
      return;
    }

    tlRef.current?.kill();
    const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });
    tlRef.current = tl;

    tl.to(knobRef.current, { x: isDark ? KNOB_TRAVEL * knobDir : 0, duration: 0.5, ease: "elastic.out(1, 0.65)" }, 0);
    tl.to(raysRef.current, {
      opacity: isDark ? 0 : 1,
      scale: isDark ? 0.4 : 1,
      rotate: isDark ? 45 : 0,
      transformOrigin: "center",
    }, 0);
    tl.to(coreRef.current, { duration: 0.5 }, 0);
    tl.to(biteRef.current, {
      opacity: isDark ? 1 : 0,
      x: isDark ? 5 : 12,
      duration: 0.5,
    }, 0.05);

    return () => {
      tl.kill();
    };
  }, [theme, knobDir]);

  function handleClick() {
    if (isTransitioning || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    toggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={handleClick}
      disabled={isTransitioning}
      className={`relative flex h-8 w-12 shrink-0 items-center rounded-full border border-ink/15 bg-cream px-1 transition-colors disabled:cursor-wait ${className ?? ""}`}
    >
      <span
        ref={knobRef}
        className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 shadow-[var(--shadow-warm-sm)] will-change-transform"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 overflow-visible">
          <g ref={raysRef} stroke="currentColor" className="text-gold-ink" strokeWidth="2" strokeLinecap="round">
            {Array.from({ length: RAY_COUNT }).map((_, i) => {
              const angle = (i * Math.PI * 2) / RAY_COUNT;
              const x1 = 12 + Math.cos(angle) * 8;
              const y1 = 12 + Math.sin(angle) * 8;
              const x2 = 12 + Math.cos(angle) * 10.5;
              const y2 = 12 + Math.sin(angle) * 10.5;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
          <circle ref={coreRef} cx="12" cy="12" r="5.5" fill="currentColor" className="text-gold-ink" />
          <circle
            ref={biteRef}
            cx="12"
            cy="9"
            r="5"
            fill="currentColor"
            className="text-gold-500 opacity-0"
          />
        </svg>
      </span>
    </button>
  );
}
