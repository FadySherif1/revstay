"use client";

import { useTranslations } from "next-intl";
import type { TimePoint } from "@/lib/admin-data";

// Lightweight dual-series bar chart (visits + bookings) in pure SVG.
// Direction-neutral; works in both themes via currentColor/tokens.
export function TrendChart({ series }: { series: TimePoint[] }) {
  const t = useTranslations("admin.chart");
  const max = Math.max(1, ...series.map((p) => Math.max(p.visits, p.bookings)));
  const barGroupW = 100 / series.length;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white-soft p-5 shadow-[var(--shadow-warm-sm)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{t("title")}</h3>
        <div className="flex items-center gap-4 text-xs text-ink-soft">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-gold-500" /> {t("visits")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-teal-500" /> {t("bookings")}
          </span>
        </div>
      </div>

      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-40 w-full">
        {series.map((p, i) => {
          const x = i * barGroupW;
          const vH = (p.visits / max) * 36;
          const bH = (p.bookings / max) * 36;
          const bw = barGroupW * 0.32;
          return (
            <g key={p.date}>
              <rect
                x={x + barGroupW * 0.15}
                y={40 - vH}
                width={bw}
                height={vH}
                rx={0.6}
                className="fill-gold-500"
              />
              <rect
                x={x + barGroupW * 0.53}
                y={40 - bH}
                width={bw}
                height={bH}
                rx={0.6}
                className="fill-teal-500"
              />
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex justify-between text-[0.65rem] text-ink-mute">
        <span dir="ltr">{series[0]?.date.slice(5)}</span>
        <span dir="ltr">{series[series.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}
