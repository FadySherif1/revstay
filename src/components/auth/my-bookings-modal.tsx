"use client";

import { useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { CalendarCheck, X, Building2 } from "lucide-react";
import { useAuthModal } from "@/components/auth/auth-provider";
import type { MyBooking } from "@/actions/booking";
import { CAIRO_TZ } from "@/lib/booking-time";

const STATUS_STYLES: Record<MyBooking["status"], string> = {
  PENDING: "bg-gold-500/15 text-gold-600",
  CONFIRMED: "bg-teal-500/15 text-teal-600",
  CANCELLED: "bg-ink/10 text-ink-soft",
  COMPLETED: "bg-ink/10 text-ink-soft",
};

export function MyBookingsModal() {
  const t = useTranslations("myBookings");
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const { myBookingsOpen, closeMyBookings, myBookings, startNewBooking } =
    useAuthModal();

  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
        timeZone: CAIRO_TZ,
      }),
    [locale]
  );

  // If there's an upcoming reservation, frame this as "you already have one".
  const hasUpcoming = myBookings.some((b) => b.isUpcoming);

  return (
    <AnimatePresence>
      {myBookingsOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeMyBookings}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="scrollbar-slim relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-ink/10 bg-white-soft px-7 pb-7 pt-14 shadow-[var(--shadow-warm)]"
          >
            <motion.button
              type="button"
              aria-label={t("close")}
              onClick={closeMyBookings}
              whileHover={prefersReducedMotion ? undefined : { rotate: 90 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="group absolute top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-ink-mute hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 ltr:right-4 rtl:left-4"
            >
              <span
                aria-hidden
                className="absolute inset-0 scale-75 rounded-full bg-ink/5 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
              />
              <X className="relative h-5 w-5" strokeWidth={2} />
            </motion.button>

            <h2 className="mb-1 font-serif text-2xl text-ink">
              {hasUpcoming ? t("existingTitle") : t("title")}
            </h2>
            <p className="mb-6 text-sm text-ink-soft">
              {hasUpcoming ? t("existingSubtitle") : t("subtitle")}
            </p>

            {myBookings.length === 0 ? (
              <p className="rounded-2xl border border-ink/10 bg-ivory px-4 py-8 text-center text-sm text-ink-soft">
                {t("empty")}
              </p>
            ) : (
              <ul className="space-y-3">
                {myBookings.map((b) => (
                  <li
                    key={b.id}
                    className="rounded-2xl border border-ink/10 bg-ivory p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          b.isUpcoming ? "bg-gold-500/15 text-gold-600" : "bg-ink/10 text-ink-soft"
                        }`}
                      >
                        {b.isUpcoming ? t("upcomingBadge") : t("pastBadge")}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[b.status]}`}
                      >
                        {t(`status.${b.status}`)}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-ink">
                      <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" strokeWidth={1.75} />
                      <span className="text-sm font-semibold">
                        {dateFmt.format(new Date(b.scheduledAt))}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-ink-soft">
                      <Building2 className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                      <span className="text-sm">
                        {t("hotelLabel")}: {b.hotelName}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={startNewBooking}
              className="mt-6 w-full rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-gold-ink transition-transform hover:scale-[1.01] hover:bg-gold-400"
            >
              {myBookings.length === 0 ? t("bookNow") : t("bookAnother")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
