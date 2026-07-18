"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ShieldCheck, Mail } from "lucide-react";
import type { AdminDashboardData } from "@/lib/admin-data";
import { promoteToAdmin } from "@/actions/admin";

type User = AdminDashboardData["users"][number];

export function UsersPanel({ users }: { users: User[] }) {
  const t = useTranslations("admin.users");
  const locale = useLocale();
  const dateFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function promote() {
    if (!email.trim() || pending) return;
    setMsg(null);
    startTransition(async () => {
      const res = await promoteToAdmin(email.trim());
      if (res.ok) {
        setMsg({ ok: true, text: t("promoted") });
        setEmail("");
      } else if (res.error === "notfound") {
        setMsg({ ok: false, text: t("notFound") });
      } else {
        setMsg({ ok: false, text: t("promoteError") });
      }
    });
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white-soft p-5 shadow-[var(--shadow-warm-sm)]">
      <h3 className="mb-4 text-sm font-semibold text-ink">{t("title")}</h3>

      {/* Promote form */}
      <div className="mb-5 rounded-xl border border-gold-500/25 bg-gold-500/[0.06] p-4">
        <p className="mb-2 text-xs font-semibold text-ink">{t("promoteTitle")}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("promotePlaceholder")}
            dir="ltr"
            className="flex-1 rounded-lg border border-ink/15 bg-ivory px-3 py-2 text-sm text-ink placeholder:text-ink-mute focus:border-gold-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={promote}
            disabled={pending || !email.trim()}
            className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-gold-ink transition-transform hover:scale-[1.02] hover:bg-gold-400 disabled:opacity-50"
          >
            {t("promote")}
          </button>
        </div>
        {msg && (
          <p className={`mt-2 text-xs ${msg.ok ? "text-teal-600" : "text-error-fg"}`}>
            {msg.text}
          </p>
        )}
      </div>

      {users.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-mute">{t("empty")}</p>
      ) : (
        <div className="scrollbar-hide overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-mute">
                <th className="px-2 py-2 text-start">{t("name")}</th>
                <th className="px-2 py-2 text-start">{t("method")}</th>
                <th className="px-2 py-2 text-start">{t("role")}</th>
                <th className="px-2 py-2 text-start">{t("bookings")}</th>
                <th className="px-2 py-2 text-start">{t("joined")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-ink/5">
                  <td className="px-2 py-3">
                    {u.name && <div className="font-semibold text-ink">{u.name}</div>}
                    <div className="text-xs text-ink-mute" dir="ltr">{u.email}</div>
                  </td>
                  <td className="px-2 py-3">
                    {u.signUpMethod === "email" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/12 px-2 py-0.5 text-xs font-semibold text-teal-600">
                        <Mail className="h-3.5 w-3.5" strokeWidth={2} />
                        {t("methodEmail")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-ink/8 px-2 py-0.5 text-xs font-semibold text-ink-soft">
                        <GoogleGlyphSm />
                        {t("methodGoogle")}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-3">
                    {u.role === "ADMIN" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/15 px-2 py-0.5 text-xs font-semibold text-gold-600">
                        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                        {t("admin")}
                      </span>
                    ) : (
                      <span className="text-xs text-ink-soft">{t("user")}</span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-ink-soft">{u.bookingCount}</td>
                  <td className="px-2 py-3 text-ink-soft">{dateFmt.format(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function GoogleGlyphSm() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
