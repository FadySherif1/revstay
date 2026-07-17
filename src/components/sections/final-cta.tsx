"use client";

import Image from "next/image";

export function FinalCta() {
  return (
    <section
      id="book"
      className="relative overflow-hidden py-32 sm:py-40"
    >
      {/* Golden-hour photo background */}
      <Image
        src="/images/egyptian-wall-with-hieroglyphs.jpg"
        alt=""
        fill
        quality={78}
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* Warm dark overlay for text contrast */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(43,38,32,0.78) 0%, rgba(43,38,32,0.62) 50%, rgba(43,38,32,0.80) 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="mb-6 font-serif text-4xl leading-tight text-white-soft sm:text-6xl">
          Your Rooms Won&apos;t Fill Themselves
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-lg text-white-soft/85">
          Book a free 30-minute consultation. We&apos;ll audit your current
          presence and show you exactly where the revenue is hiding.
        </p>

        <button
          type="button"
          onClick={() => {
            // TODO: open auth + booking flow once implemented
          }}
          className="hero-cta-glow rounded-full bg-gold-500 px-10 py-4 text-lg font-semibold text-ink transition-transform hover:scale-[1.03] hover:bg-gold-400"
        >
          Book a Free Consultation
        </button>

        <p className="mt-5 text-sm text-white-soft/70">
          No commitment. No pressure. Just clarity.
        </p>
      </div>
    </section>
  );
}
