"use client";

export function FinalCta() {
  return (
    <section
      id="book"
      className="relative overflow-hidden bg-navy-950 py-32 sm:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/20 blur-[140px]"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="mb-6 font-serif text-4xl leading-tight text-offwhite sm:text-6xl">
          Your Rooms Won&apos;t Fill Themselves
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-lg text-offwhite/70">
          Book a free 30-minute consultation. We&apos;ll audit your current
          presence and show you exactly where the revenue is hiding.
        </p>

        <button
          type="button"
          onClick={() => {
            // TODO: open auth + booking flow once implemented
          }}
          className="hero-cta-glow rounded-full bg-gold-500 px-10 py-4 text-lg font-semibold text-navy-950 transition-transform hover:scale-[1.03] hover:bg-gold-400"
        >
          Book a Free Consultation
        </button>

        <p className="mt-5 text-sm text-offwhite/50">
          No commitment. No pressure. Just clarity.
        </p>
      </div>
    </section>
  );
}
