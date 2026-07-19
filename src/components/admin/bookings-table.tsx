"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { AdminDashboardData } from "@/lib/admin-data";
import { updateBookingStatus } from "@/actions/admin";
import { CAIRO_TZ } from "@/lib/booking-time";

type Booking = AdminDashboardData["recentBookings"][number];

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"] as const;

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  // Always shown in Cairo time (the market this booking calendar serves),
  // regardless of the admin's own browser timezone.
  const dateFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: CAIRO_TZ,
  });

  return (
    <div className="rounded-2xl border border-ink/10 bg-white-soft p-5 shadow-[var(--shadow-warm-sm)]">
      <h3 className="mb-4 text-sm font-semibold text-ink">{t("bookings.title")}</h3>
      {bookings.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-mute">{t("bookings.empty")}</p>
      ) : (
        <div className="scrollbar-hide overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-start text-xs font-semibold uppercase tracking-wide text-ink-mute">
                <th className="px-2 py-2 text-start">{t("bookings.hotel")}</th>
                <th className="px-2 py-2 text-start">{t("bookings.contact")}</th>
                <th className="px-2 py-2 text-start">{t("bookings.rooms")}</th>
                <th className="px-2 py-2 text-start">{t("bookings.listings")}</th>
                <th className="px-2 py-2 text-start">{t("bookings.when")}</th>
                <th className="px-2 py-2 text-start">{t("bookings.status")}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <BookingRow key={b.id} b={b} dateFmt={dateFmt} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BookingRow({ b, dateFmt }: { b: Booking; dateFmt: Intl.DateTimeFormat }) {
  const t = useTranslations("admin");
  const [status, setStatus] = useState(b.status);
  const [pending, startTransition] = useTransition();

  function onChange(next: string) {
    const prev = status;
    setStatus(next);
    startTransition(async () => {
      const res = await updateBookingStatus(b.id, next);
      if (!res.ok) setStatus(prev); // revert on failure
    });
  }

  const listingsLabel = b.hasListings
    ? [...b.platforms, ...(b.otherPlatform ? [b.otherPlatform] : [])].join(", ") ||
      t("bookings.hasListingsYes")
    : t("bookings.hasListingsNo");

  return (
    <tr className="border-b border-ink/5 align-top">
      <td className="px-2 py-3">
        <div className="font-semibold text-ink">{b.hotelName}</div>
        <div className="text-xs text-ink-mute">{b.hotelLocation}</div>
      </td>
      <td className="px-2 py-3">
        <div className="text-ink-soft">{b.name}</div>
        <div className="text-xs text-ink-mute" dir="ltr">{b.email}</div>
        <div className="text-xs text-ink-mute" dir="ltr">{b.phone}</div>
      </td>
      <td className="px-2 py-3 text-ink-soft">{b.roomCount}</td>
      <td className="max-w-[160px] px-2 py-3 text-xs text-ink-soft">{listingsLabel}</td>
      <td className="px-2 py-3 text-ink-soft">{dateFmt.format(b.scheduledAt)}</td>
      <td className="px-2 py-3">
        <select
          value={status}
          disabled={pending}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-ink/15 bg-ivory px-2 py-1 text-xs font-semibold text-ink focus:border-gold-500 focus:outline-none disabled:opacity-60"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`status.${s}`)}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
