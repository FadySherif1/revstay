"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LayoutDashboard } from "lucide-react";
import { Link } from "@/i18n/navigation";

// Direct dashboard shortcut in the navbar — shown only to admins so they
// don't have to type /admin into the URL. The full link also lives in the
// avatar dropdown (user-menu).
export function AdminNavLink() {
  const t = useTranslations("auth");
  const { data: session, status } = useSession();

  if (status !== "authenticated" || session?.user?.role !== "ADMIN") return null;

  return (
    <Link
      href="/admin"
      aria-label={t("menu.dashboard")}
      title={t("menu.dashboard")}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/30 text-gold-600 transition-colors hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
    >
      <LayoutDashboard className="h-[18px] w-[18px]" strokeWidth={1.75} />
    </Link>
  );
}
