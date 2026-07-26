"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useAuthModal } from "@/components/auth/auth-provider";

export function FinalCta() {
  const t = useTranslations("finalCta");
  const { requestBooking } = useAuthModal();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !contentRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const content = contentRef.current?.querySelectorAll("[data-cta-reveal]");

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { yPercent: -4, scale: 1.06 },
          {
            yPercent: 4,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      if (content?.length) {
        gsap.from(content, {
          autoAlpha: 0,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.11,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 78%",
            once: true,
          },
        });
      }

      if (ruleRef.current) {
        gsap.from(ruleRef.current, {
          scaleX: 0,
          duration: 1.1,
          ease: "power2.out",
          transformOrigin: "center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="book"
      className="relative overflow-hidden py-32 sm:py-40"
    >
      {/* Golden-hour photo background */}
      <div
        ref={imageRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[10%] -z-20 h-[120%] will-change-transform"
      >
        <Image
          src="/images/egyptian-wall-with-hieroglyphs.jpg"
          alt=""
          fill
          quality={78}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Warm dark overlay for text contrast (always dark regardless of theme,
          since the photo needs consistent darkening either way) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-fixed-dark) 78%, transparent) 0%, color-mix(in srgb, var(--color-fixed-dark) 62%, transparent) 50%, color-mix(in srgb, var(--color-fixed-dark) 80%, transparent) 100%)",
        }}
      />

      <div
        ref={ruleRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent"
      />

      <div
        ref={contentRef}
        className="relative mx-auto max-w-3xl px-6 text-center lg:px-8"
      >
        <h2
          data-cta-reveal
          className="mb-6 font-serif text-4xl leading-tight text-on-gold sm:text-6xl"
        >
          {t("headline")}
        </h2>
        <p
          data-cta-reveal
          className="mx-auto mb-10 max-w-xl text-lg text-on-gold/85"
        >
          {t("sub")}
        </p>

        <div data-cta-reveal>
          <button
            type="button"
            onClick={requestBooking}
            className="hero-cta-glow rounded-full bg-gold-500 px-10 py-4 text-lg font-semibold text-gold-ink transition-transform hover:scale-[1.03] hover:bg-gold-400"
          >
            {t("cta")}
          </button>
        </div>

        <p data-cta-reveal className="mt-5 text-sm text-on-gold/70">
          {t("reassurance")}
        </p>
      </div>
    </section>
  );
}
