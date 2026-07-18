"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { CalendarCheck, X, ArrowLeft, Loader2 } from "lucide-react";
import { useAuthModal } from "@/components/auth/auth-provider";
import { createBooking } from "@/actions/booking";
import { BOOKING_SLOTS, type BookingSlot } from "@/lib/booking-schema";
import { PLATFORMS } from "@/lib/platforms";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-\s0-9]{6,20}$/;

type Step = "form" | "time" | "success";

type FormState = {
  name: string;
  phone: string;
  email: string;
  hotelName: string;
  hotelLocation: string;
  roomCount: string;
  hasListings: boolean | null;
  platforms: string[];
  otherPlatform: string;
  notes: string;
};

// Build the next N selectable days (skips nothing — simple + reliable).
function upcomingDays(count: number): Date[] {
  const days: Date[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 1; i <= count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function BookingModal() {
  const t = useTranslations("booking");
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const { bookingOpen, closeBooking, refreshBookings } = useAuthModal();
  const { data: session } = useSession();

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    hotelName: "",
    hotelLocation: "",
    roomCount: "",
    hasListings: null,
    platforms: [],
    otherPlatform: "",
    notes: "",
  });
  const [prefilled, setPrefilled] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<BookingSlot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const days = useMemo(() => upcomingDays(14), []);
  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    [locale]
  );

  // Prefill name/email from the session once when the modal opens.
  if (bookingOpen && !prefilled && session?.user) {
    setPrefilled(true);
    setForm((f) => ({
      ...f,
      name: f.name || session.user.name || "",
      email: f.email || session.user.email || "",
    }));
  }

  function reset() {
    setStep("form");
    setDate(null);
    setSlot(null);
    setError(null);
    setBusy(false);
  }

  function handleClose() {
    closeBooking();
    // Reset after the exit animation so it's fresh next time.
    setTimeout(reset, 300);
    setPrefilled(false);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function togglePlatform(name: string) {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(name)
        ? f.platforms.filter((p) => p !== name)
        : [...f.platforms, name],
    }));
  }

  function validateForm(): boolean {
    if (
      form.name.trim().length < 2 ||
      form.hotelName.trim().length < 2 ||
      form.hotelLocation.trim().length < 2 ||
      !(Number(form.roomCount) >= 1) ||
      form.hasListings === null
    ) {
      setError(t("errors.required"));
      return false;
    }
    if (!PHONE_RE.test(form.phone.trim())) {
      setError(t("errors.phone"));
      return false;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError(t("errors.email"));
      return false;
    }
    // If they have listings, require at least one platform or an "other".
    if (
      form.hasListings &&
      form.platforms.length === 0 &&
      !form.otherPlatform.trim()
    ) {
      setError(t("errors.platformsRequired"));
      return false;
    }
    setError(null);
    return true;
  }

  function goToTime() {
    if (validateForm()) setStep("time");
  }

  async function confirm() {
    if (busy) return;
    if (!date || !slot) {
      setError(t("errors.noSlot"));
      return;
    }
    setError(null);
    setBusy(true);
    const res = await createBooking({ ...form, notes: form.notes, date, slot });
    if (res.ok) {
      setStep("success");
      // Keep "My Bookings" / the existing-reservation popup in sync.
      refreshBookings();
    } else {
      setBusy(false);
      const key = `errors.${res.error}`;
      // Fall back to generic if the error key isn't translated.
      setError(
        ["rateLimited", "unauthenticated", "generic", "invalid"].includes(res.error)
          ? t(res.error === "invalid" ? "errors.required" : key)
          : t("errors.generic")
      );
    }
  }

  const whenLabel =
    date && slot ? `${dateFmt.format(new Date(`${date}T00:00`))} · ${t(`slots.${slot}`)}` : "";

  return (
    <AnimatePresence>
      {bookingOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("formTitle")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white-soft shadow-[var(--shadow-warm)]"
          >
            <motion.button
              type="button"
              aria-label={t("close")}
              onClick={handleClose}
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

            <div data-lenis-prevent className="scrollbar-slim overflow-y-auto px-7 pb-7 pt-14">
            {step === "form" && (
              <div>
                <h2 className="mb-1 font-serif text-2xl text-ink">{t("formTitle")}</h2>
                <p className="mb-6 text-sm text-ink-soft">{t("formSubtitle")}</p>
                <div className="space-y-3">
                  <Field label={t("name")} value={form.name} onChange={(v) => set("name", v)} autoComplete="name" />
                  <Field label={t("phone")} value={form.phone} onChange={(v) => set("phone", v)} type="tel" autoComplete="tel" dir="ltr" />
                  <Field label={t("email")} value={form.email} onChange={(v) => set("email", v)} type="email" autoComplete="email" dir="ltr" />
                  <Field label={t("hotelName")} value={form.hotelName} onChange={(v) => set("hotelName", v)} />
                  <Field label={t("hotelLocation")} value={form.hotelLocation} onChange={(v) => set("hotelLocation", v)} />
                  <Field label={t("roomCount")} value={form.roomCount} onChange={(v) => set("roomCount", v.replace(/[^0-9]/g, ""))} type="text" dir="ltr" inputMode="numeric" />

                  {/* Existing listings? yes/no */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink-mute">
                      {t("hasListingsQuestion")}
                    </label>
                    <div className="flex gap-2">
                      {[true, false].map((val) => {
                        const active = form.hasListings === val;
                        return (
                          <button
                            key={String(val)}
                            type="button"
                            onClick={() => set("hasListings", val)}
                            className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition-colors ${
                              active
                                ? "border-gold-500 bg-gold-500 text-gold-ink"
                                : "border-ink/15 bg-ivory text-ink-soft hover:border-gold-500/50"
                            }`}
                          >
                            {val ? t("yes") : t("no")}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Platform picker — only when they have listings */}
                  {form.hasListings === true && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-ink-mute">
                        {t("platformsLabel")}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {PLATFORMS.map((p) => {
                          const active = form.platforms.includes(p);
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => togglePlatform(p)}
                              aria-pressed={active}
                              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                active
                                  ? "border-gold-500 bg-gold-500 text-gold-ink"
                                  : "border-ink/15 bg-ivory text-ink-soft hover:border-gold-500/50"
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                      <input
                        type="text"
                        value={form.otherPlatform}
                        onChange={(e) => set("otherPlatform", e.target.value)}
                        placeholder={t("otherPlatformPlaceholder")}
                        aria-label={t("otherPlatform")}
                        className="mt-2 w-full rounded-xl border border-ink/15 bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-mute focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                      />
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink-mute">{t("notes")}</label>
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) => set("notes", e.target.value)}
                      placeholder={t("notesPlaceholder")}
                      className="w-full resize-none rounded-xl border border-ink/15 bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-mute focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />
                  </div>
                </div>

                {error && <ErrorLine>{error}</ErrorLine>}

                <button
                  type="button"
                  onClick={goToTime}
                  className="mt-5 w-full rounded-xl bg-gold-500 py-3 text-sm font-semibold text-gold-ink transition-transform hover:scale-[1.01] hover:bg-gold-400"
                >
                  {t("next")}
                </button>
              </div>
            )}

            {step === "time" && (
              <div>
                <button
                  type="button"
                  onClick={() => { setStep("form"); setError(null); }}
                  className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-ink-mute hover:text-gold-600"
                >
                  <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
                  {t("back")}
                </button>
                <h2 className="mb-1 font-serif text-2xl text-ink">{t("timeTitle")}</h2>
                <p className="mb-4 text-sm text-ink-soft">{t("timeSubtitle")}</p>

                {/* Date picker: horizontal scroll of upcoming days */}
                <div className="scrollbar-hide -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">
                  {days.map((d) => {
                    const iso = toISODate(d);
                    const active = date === iso;
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setDate(iso)}
                        className={`flex shrink-0 flex-col items-center rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                          active
                            ? "border-gold-500 bg-gold-500 text-gold-ink"
                            : "border-ink/15 bg-ivory text-ink-soft hover:border-gold-500/50"
                        }`}
                      >
                        {dateFmt.format(d)}
                      </button>
                    );
                  })}
                </div>

                {/* Slot picker */}
                <div className="mb-2 grid grid-cols-2 gap-2">
                  {BOOKING_SLOTS.map((s) => {
                    const active = slot === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlot(s)}
                        className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                          active
                            ? "border-gold-500 bg-gold-500 text-gold-ink"
                            : "border-ink/15 bg-ivory text-ink-soft hover:border-gold-500/50"
                        }`}
                      >
                        {t(`slots.${s}`)}
                      </button>
                    );
                  })}
                </div>

                {error && <ErrorLine>{error}</ErrorLine>}

                <button
                  type="button"
                  onClick={confirm}
                  disabled={busy}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 py-3 text-sm font-semibold text-gold-ink transition-transform hover:scale-[1.01] hover:bg-gold-400 disabled:cursor-wait disabled:opacity-70"
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />}
                  {busy ? t("booking") : t("confirm")}
                </button>
              </div>
            )}

            {step === "success" && (
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
                  <CalendarCheck className="h-7 w-7" strokeWidth={1.75} />
                </div>
                <h2 className="mb-3 font-serif text-2xl text-ink">{t("successTitle")}</h2>
                <p className="mb-7 text-sm leading-relaxed text-ink-soft">
                  {t("successBody", { name: form.name.split(" ")[0] || form.name, when: whenLabel })}
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full bg-gold-500 px-8 py-3 text-sm font-semibold text-gold-ink transition-transform hover:scale-[1.02] hover:bg-gold-400"
                >
                  {t("successClose")}
                </button>
              </div>
            )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  dir,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  dir?: "ltr" | "rtl";
  inputMode?: "numeric" | "tel" | "email" | "text";
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-mute">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        dir={dir}
        inputMode={inputMode}
        className="w-full rounded-xl border border-ink/15 bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-mute focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
      />
    </div>
  );
}

function ErrorLine({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-4 rounded-lg bg-error-bg px-3 py-2 text-sm text-error-fg">
      {children}
    </p>
  );
}
