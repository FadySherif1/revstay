"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarCheck, X } from "lucide-react";
import { useAuthModal } from "@/components/auth/auth-provider";

// Placeholder shown after a successful booking gate — the real calendar
// booking flow (TODO) will replace this.
export function BookingModal() {
  const t = useTranslations("booking");
  const prefersReducedMotion = useReducedMotion();
  const { bookingOpen, closeBooking } = useAuthModal();

  return (
    <AnimatePresence>
      {bookingOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("soonTitle")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeBooking}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-3xl border border-ink/10 bg-white-soft p-8 text-center shadow-[var(--shadow-warm)]"
          >
            <button
              type="button"
              aria-label={t("soonClose")}
              onClick={closeBooking}
              className="absolute top-5 flex h-8 w-8 items-center justify-center rounded-full text-ink-mute hover:bg-ink/5 hover:text-ink ltr:right-5 rtl:left-5"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
              <CalendarCheck className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <h2 className="mb-3 font-serif text-2xl text-ink">{t("soonTitle")}</h2>
            <p className="mb-7 text-sm leading-relaxed text-ink-soft">{t("soonBody")}</p>
            {/* TODO: replace with the real calendar booking flow. */}
            <button
              type="button"
              onClick={closeBooking}
              className="rounded-full bg-gold-500 px-8 py-3 text-sm font-semibold text-gold-ink transition-transform hover:scale-[1.02] hover:bg-gold-400"
            >
              {t("soonClose")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
