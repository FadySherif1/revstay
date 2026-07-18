"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("langSwitch");
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // Navigate to the same page in the other locale (no full reload feel).
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`relative flex h-8 items-center rounded-full border border-ink/15 bg-cream p-0.5 text-xs font-semibold ${className ?? ""}`}
    >
      {routing.locales.map((loc) => {
        const isActive = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            aria-pressed={isActive}
            className={`relative z-10 rounded-full px-3 py-1 transition-colors ${
              isActive ? "text-gold-ink" : "text-ink/70 hover:text-gold-600"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="lang-indicator"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 400, damping: 32 }
                }
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full bg-gold-500"
              />
            )}
            {t(loc)}
          </button>
        );
      })}
    </div>
  );
}
