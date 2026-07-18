"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PLATFORMS } from "@/lib/platforms";

// Entrance is sequenced to begin after the hero headline/CTA (Framer)
// load animations have mostly played.
const ENTRANCE_DELAY = 1.1;

export function TrustBadges() {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const badges = Array.from(row.querySelectorAll<HTMLElement>("[data-badge]"));
    const dots = Array.from(row.querySelectorAll<HTMLElement>("[data-dot]"));

    if (prefersReducedMotion) {
      gsap.set([...badges, ...dots], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(badges, { opacity: 0, y: 12 });
      gsap.set(dots, { opacity: 0 });

      const tl = gsap.timeline({ delay: ENTRANCE_DELAY });
      // Wave of badges rising with a slight overshoot.
      tl.to(badges, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.4)",
        stagger: 0.06,
      });
      // Gold dots fade in between them, slightly behind the wave.
      tl.to(
        dots,
        { opacity: 1, duration: 0.4, ease: "power1.out", stagger: 0.06 },
        0.15
      );
    }, row);

    return () => ctx.revert();
  }, []);

  // ── Hover interaction (desktop / fine pointer only) ──────────────────
  function isFinePointer() {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  function handleEnter(index: number) {
    const row = rowRef.current;
    if (!row || !isFinePointer()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const badges = Array.from(row.querySelectorAll<HTMLElement>("[data-badge]"));
    const badge = badges[index];
    if (!badge) return;

    const label = badge.querySelector<HTMLElement>("[data-label]");
    const pill = badge.querySelector<HTMLElement>("[data-pill]");
    const chars = badge.querySelectorAll<HTMLElement>("[data-char]");

    gsap.to(label, { y: -3, duration: 0.3, ease: "power2.out", overwrite: "auto" });
    gsap.to(pill, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
    // Letter stagger-wave: each char nudges up 2px then settles.
    gsap.to(chars, {
      keyframes: [
        { y: -2, duration: 0.15, ease: "power2.out" },
        { y: 0, duration: 0.15, ease: "power2.in" },
      ],
      stagger: 0.025,
      overwrite: "auto",
    });
    // Neighbors lean away (magnetic repel).
    badges.forEach((b, i) => {
      if (i === index) return;
      const dir = i < index ? -1 : 1;
      const dist = Math.abs(i - index) === 1 ? 2 : 1;
      gsap.to(b, { x: dir * dist, duration: 0.3, ease: "power2.out", overwrite: "auto" });
    });
  }

  function handleLeave(index: number) {
    const row = rowRef.current;
    if (!row || !isFinePointer()) return;

    const badges = Array.from(row.querySelectorAll<HTMLElement>("[data-badge]"));
    const badge = badges[index];
    if (!badge) return;

    const label = badge.querySelector<HTMLElement>("[data-label]");
    const pill = badge.querySelector<HTMLElement>("[data-pill]");

    gsap.to(label, { y: 0, duration: 0.4, ease: "back.out(2)", overwrite: "auto" });
    gsap.to(pill, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      overwrite: "auto",
    });
    badges.forEach((b) => {
      gsap.to(b, { x: 0, duration: 0.4, ease: "back.out(1.6)", overwrite: "auto" });
    });
  }

  return (
    <div className="relative w-full max-w-3xl">
      {/* Edge-fade masks (logical inset for RTL) hint horizontal scroll. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-10 w-10 bg-gradient-to-r from-ivory to-transparent ltr:left-0 rtl:right-0 rtl:bg-gradient-to-l sm:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-10 w-10 bg-gradient-to-l from-ivory to-transparent ltr:right-0 rtl:left-0 rtl:bg-gradient-to-r sm:hidden"
      />

      <div
        ref={rowRef}
        className="scrollbar-hide flex items-center justify-start gap-1.5 overflow-x-auto px-6 sm:justify-center sm:overflow-visible sm:px-0"
      >
        {PLATFORMS.map((platform, i) => (
          <div key={platform} className="flex shrink-0 items-center">
            <button
              type="button"
              data-badge
              tabIndex={-1}
              aria-hidden
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => handleLeave(i)}
              className="relative cursor-default whitespace-nowrap px-2.5 py-1 will-change-transform lg:px-3"
            >
              {/* Gold pill/glow — reserved space, scales in on hover only */}
              <span
                data-pill
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 scale-[0.8] rounded-full bg-gold-500/15 opacity-0 shadow-[0_0_18px_-4px_color-mix(in_srgb,var(--color-gold-500)_60%,transparent)] ring-1 ring-gold-500/25"
              />
              <span
                data-label
                className="inline-block text-[0.7rem] font-semibold tracking-wide text-ink-soft will-change-transform lg:text-xs"
              >
                {platform.split("").map((ch, ci) => (
                  <span
                    key={ci}
                    data-char
                    className="inline-block will-change-transform"
                    // preserve spaces if any (platform names have none, but safe)
                    style={ch === " " ? { width: "0.25em" } : undefined}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            </button>

            {/* Gold dot separator between badges (not after the last) */}
            {i < PLATFORMS.length - 1 && (
              <span
                data-dot
                aria-hidden
                className="select-none px-0.5 text-xs leading-none text-gold-500/70"
              >
                ·
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
