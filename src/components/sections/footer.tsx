"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { LinkedinIcon, InstagramIcon } from "@/components/ui/social-icons";

const QUICK_LINKS = [
  { key: "services", href: "#services" },
  { key: "results", href: "#results" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
];

const SOCIALS = [
  { icon: LinkedinIcon, key: "linkedin", href: "#" },
  { icon: InstagramIcon, key: "instagram", href: "#" },
  { icon: X, key: "x", href: "#" },
];

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  return (
    <footer className="relative border-t border-gold-500/25 bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <p className="mb-3 font-serif text-2xl text-ink">Revstay</p>
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
              {t("tagline")}
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft">
              {t("quickLinks")}
            </p>
            <ul className="space-y-3">
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

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft">
              {t("contact")}
            </p>
            <a
              href="mailto:hello@revstay.com"
              className="mb-5 block text-sm text-ink-soft transition-colors hover:text-gold-600"
            >
              hello@revstay.com
            </a>
            <div className="flex items-center gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  aria-label={t(`social.${social.key}`)}
                  className="text-ink-soft transition-colors hover:text-gold-600"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-ink/10 pt-6 text-center text-xs text-ink-soft">
          {t("rights")}
        </div>
      </div>
    </footer>
  );
}
