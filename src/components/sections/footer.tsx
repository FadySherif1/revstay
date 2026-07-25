"use client";

import Link from "next/link";
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
    label: "+20 110 578 9455",  60-=3`  0`
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
    href: "https://www.instagram.com/revstay",
  },
  {
    icon: FacebookIcon,
    key: "facebook",
    href: "https://www.facebook.com/revstay",
  },
];

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="relative border-t border-gold-500/25 bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          <div>
            <p className="mb-2 text-xl font-semibold text-ink">
              Revstay
            </p>

            <p className="max-w-xs text-sm leading-snug text-ink-soft">
              {t("tagline")}
            </p>
          </div>

          <div>
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

          <div>
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

        <div className="mt-8 border-t border-ink/10 pt-4 text-center text-xs text-ink-soft">
          {t("rights")}
        </div>
      </div>
    </footer>
  );
}
