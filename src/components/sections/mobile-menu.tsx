"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { NAV_LINKS } from "@/components/sections/navbar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function MobileMenu({
  open,
  activeId,
  onClose,
}: {
  open: boolean;
  activeId: string | null;
  onClose: () => void;
}) {
  const t = useTranslations("nav");
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 flex flex-col bg-ivory md:hidden"
        >
          <div className="flex justify-end px-6 pt-6">
            <span className="h-16" aria-hidden />
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {NAV_LINKS.map((link, i) => {
              const isActive = activeId === link.href.slice(1);
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                >
                  <a
                    href={link.href}
                    onClick={onClose}
                    className={`font-serif text-3xl ${
                      isActive ? "text-gold-600" : "text-ink"
                    }`}
                  >
                    {t(link.key)}
                  </a>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + NAV_LINKS.length * 0.07, duration: 0.4 }}
              className="mt-4 flex flex-col items-center gap-6"
            >
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <a
                href="#book"
                onClick={onClose}
                className="rounded-full bg-gold-500 px-8 py-3 text-base font-semibold text-gold-ink"
              >
                {t("book")}
              </a>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
