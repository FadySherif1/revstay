"use client";

import { PLATFORMS } from "@/lib/platforms";

export function Platforms() {
  return (
    <section
      aria-label="Booking platforms we manage"
      className="relative overflow-hidden border-y border-ink/5 bg-cream py-10"
    >
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-mute">
        One team, every platform that matters
      </p>

      {/* Marquee on wide screens; graceful wrap under reduced motion */}
      <div className="platform-marquee relative flex overflow-hidden [--gap:0.75rem] motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-3 motion-reduce:px-6">
        <ul className="platform-track flex shrink-0 items-center gap-3 pr-3 motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0">
          {PLATFORMS.map((platform) => (
            <li key={platform}>
              <span className="inline-block whitespace-nowrap rounded-full border border-ink/10 bg-white-soft px-5 py-2 text-sm font-semibold tracking-wide text-ink-soft shadow-[var(--shadow-warm-sm)]">
                {platform}
              </span>
            </li>
          ))}
        </ul>
        {/* Duplicate track for seamless loop (hidden from AT + reduced motion) */}
        <ul
          aria-hidden
          className="platform-track flex shrink-0 items-center gap-3 pr-3 motion-reduce:hidden"
        >
          {PLATFORMS.map((platform) => (
            <li key={`dup-${platform}`}>
              <span className="inline-block whitespace-nowrap rounded-full border border-ink/10 bg-white-soft px-5 py-2 text-sm font-semibold tracking-wide text-ink-soft shadow-[var(--shadow-warm-sm)]">
                {platform}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Edge fade masks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent motion-reduce:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream to-transparent motion-reduce:hidden"
      />
    </section>
  );
}
