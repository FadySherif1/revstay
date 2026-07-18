"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
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
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-semibold uppercase tracking-wide text-ink-mute">
                <th className="px-2 py-2 text-start">{t("name")}</th>
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
