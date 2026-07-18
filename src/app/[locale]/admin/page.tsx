import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/require-admin";
import { getAdminDashboardData } from "@/lib/admin-data";
import { TrendChart } from "@/components/admin/trend-chart";
import { BookingsTable } from "@/components/admin/bookings-table";
import { UsersPanel } from "@/components/admin/users-panel";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  const t = await getTranslations("admin");
  const data = await getAdminDashboardData();
  const { kpis, conversion, series, bookingStatus, recentBookings, users } = data;

  const kpiCards = [
    { label: t("kpis.totalVisits"), value: kpis.totalVisits },
    { label: t("kpis.uniqueVisitors"), value: kpis.uniqueVisitors },
    { label: t("kpis.visitsToday"), value: kpis.visitsToday },
    { label: t("kpis.visits7d"), value: kpis.visits7d },
    { label: t("kpis.totalUsers"), value: kpis.totalUsers },
    { label: t("kpis.users7d"), value: kpis.users7d },
    { label: t("kpis.totalBookings"), value: kpis.totalBookings },
    { label: t("kpis.pendingBookings"), value: kpis.pendingBookings },
  ];

  const statusRows = [
    { key: "PENDING", value: bookingStatus.pending },
    { key: "CONFIRMED", value: bookingStatus.confirmed },
    { key: "CANCELLED", value: bookingStatus.cancelled },
  ];
  const statusTotal = Math.max(1, bookingStatus.pending + bookingStatus.confirmed + bookingStatus.cancelled);

  return (
    <main className="min-h-screen bg-cream px-6 pb-20 pt-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">{t("title")}</h1>
          <p className="mt-1 text-sm text-ink-soft">{t("subtitle")}</p>
        </header>

        {/* KPI cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpiCards.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-ink/10 bg-white-soft p-5 shadow-[var(--shadow-warm-sm)]"
            >
              <div className="font-serif text-3xl text-gold-600">{c.value}</div>
              <div className="mt-1 text-xs font-medium text-ink-mute">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Chart + side column */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TrendChart series={series} />
          </div>
          <div className="flex flex-col gap-4">
            {/* Conversion */}
            <div className="rounded-2xl border border-ink/10 bg-white-soft p-5 shadow-[var(--shadow-warm-sm)]">
              <h3 className="mb-3 text-sm font-semibold text-ink">{t("conversion.title")}</h3>
              <div className="space-y-3">
                <ConversionRow label={t("conversion.visitorToAccount")} pct={conversion.visitorToAccount} />
                <ConversionRow label={t("conversion.visitorToBooking")} pct={conversion.visitorToBooking} />
              </div>
            </div>
            {/* Status breakdown */}
            <div className="rounded-2xl border border-ink/10 bg-white-soft p-5 shadow-[var(--shadow-warm-sm)]">
              <h3 className="mb-3 text-sm font-semibold text-ink">{t("statusBreakdown")}</h3>
              <div className="space-y-2">
                {statusRows.map((s) => (
                  <div key={s.key} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-xs text-ink-soft">{t(`status.${s.key}`)}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
                      <div
                        className="h-full rounded-full bg-gold-500"
                        style={{ width: `${(s.value / statusTotal) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-end text-xs font-semibold text-ink">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="mb-6">
          <BookingsTable bookings={recentBookings} />
        </div>
        <UsersPanel users={users} />
      </div>
    </main>
  );
}

function ConversionRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-ink-soft">{label}</span>
        <span className="font-semibold text-ink" dir="ltr">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink/10">
        <div className="h-full rounded-full bg-teal-500" style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}
