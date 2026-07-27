"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { FacebookIcon, InstagramIcon } from "@/components/ui/social-icons";

const QUICK_LINKS = [
  { key: "services", href: "#services" },
  { key: "results", href: "#results" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#book" },
];

const PHONE_NUMBERS = [
  {
    label: "+20 110 578 9455",
    href: "tel:+201105789455",
  },
  {
    label: "+20 127 544 6186",
    href: "tel:+201275446186",
  },
];

const SOCIALS = [
  {
    icon: InstagramIcon,
    key: "instagram",
    href: "https://www.instagram.com/revstay0?igsh=MWFzejlrODV6bWF5&utm_source=qr",
  },
  {
    icon: FacebookIcon,
    key: "facebook",
    href: "https://www.facebook.com/share/19BtmBG469/?mibextid=wwXIfr",
  },
];

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const footerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !footerRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const columns = gridRef.current?.querySelectorAll("[data-footer-column]");

      if (columns?.length) {
        gsap.from(columns, {
          autoAlpha: 0,
          y: 22,
          duration: 0.65,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 92%",
            once: true,
          },
        });
      }

      if (dividerRef.current) {
        gsap.from(dividerRef.current, {
          scaleX: 0,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: dividerRef.current,
            start: "top 96%",
            once: true,
          },
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-gold-500/25 bg-cream"
    >
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <div ref={gridRef} className="grid grid-cols-1 gap-7 md:grid-cols-3">
          <div data-footer-column>
            <p className="mb-2 text-xl font-semibold text-ink">
              Revstay
            </p>

            <p className="max-w-xs text-sm leading-snug text-ink-soft">
              {t("tagline")}
            </p>
          </div>

          <div data-footer-column>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft">
              {t("quickLinks")}
            </p>

            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-soft transition-colors hover:text-gold-600"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-footer-column>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft">
              {t("contact")}
            </p>

            <div className="space-y-2">
              <a
                href="mailto:revstay0@gmail.com"
                dir="ltr"
                className="block text-sm text-ink-soft transition-colors hover:text-gold-600 rtl:text-end"
              >
                revstay0@gmail.com
              </a>

              {PHONE_NUMBERS.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  dir="ltr"
                  className="block text-sm text-ink-soft transition-colors hover:text-gold-600 rtl:text-end"
                >
                  {phone.label}
                </a>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(`social.${social.key}`)}
                  className="text-ink-soft transition-colors hover:text-gold-600"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={dividerRef}
          className="mt-8 origin-center border-t border-ink/10 pt-4 text-center text-xs text-ink-soft"
        >
          {t("rights")}
        </div>
      </div>
    </footer>
  );
}
