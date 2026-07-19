// Revstay serves the Egyptian market, so every booking slot is interpreted
// and displayed in Africa/Cairo time regardless of the guest's or server's
// own local timezone (the server may run in UTC on serverless). We store
// scheduledAt as a normal UTC instant in Postgres (Prisma's DateTime is
// always UTC under the hood) — the only special handling is (a) building
// that UTC instant correctly from a Cairo-local "date + slot" pick, and (b)
// always formatting it back out with `timeZone: "CAIRO_TZ"` so every
// surface (admin table, emails, My Bookings) agrees on the same wall-clock
// hour the guest actually picked.
export const CAIRO_TZ = "Africa/Cairo";

// Egypt reinstated DST in 2023 (UTC+3 roughly May-Oct, UTC+2 the rest of the
// year) after having abolished it in 2015 — so the offset is NOT a fixed
// constant and must be resolved from the IANA tz database for the specific
// date in question, not hardcoded.
function cairoUtcOffsetMinutes(atUtc: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CAIRO_TZ,
    timeZoneName: "longOffset",
  }).formatToParts(atUtc);
  const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+02:00";
  const m = /GMT([+-])(\d{2}):(\d{2})/.exec(raw);
  if (!m) return 120;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3]));
}

/**
 * Builds the UTC Date instant for a Cairo-local "YYYY-MM-DD" + "HH:mm" pick.
 * Throws if the inputs don't parse to a valid calendar date/time.
 */
export function cairoSlotToUtcDate(date: string, slot: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const t = /^(\d{2}):(\d{2})$/.exec(slot);
  if (!m || !t) return new Date(NaN);

  const [, y, mo, d] = m;
  const [, h, mi] = t;

  // First pass: construct as if the wall-clock time were UTC, to get a
  // rough instant we can ask "what was Cairo's offset around here?". Then
  // shift back by that offset to get the true UTC instant. A date exactly
  // at a DST transition boundary could in theory be off by the transition
  // amount, but Revstay only offers slots at 10:00/12:00/14:00/16:00 —
  // Egypt's DST transitions happen well outside business hours (around
  // midnight), so this is safe in practice.
  const asIfUtc = Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi));
  const offsetMinutes = cairoUtcOffsetMinutes(new Date(asIfUtc));
  return new Date(asIfUtc - offsetMinutes * 60 * 1000);
}

/** Formats a UTC Date instant as a Cairo wall-clock date+time for display. */
export function formatCairo(
  date: Date,
  locale: "en" | "ar",
  options: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    ...options,
    timeZone: CAIRO_TZ,
  }).format(date);
}

/** True once the booking's scheduledAt (a Cairo-local moment) has passed. */
export function isPastCairo(scheduledAt: Date, now: Date = new Date()): boolean {
  return scheduledAt.getTime() < now.getTime();
}
