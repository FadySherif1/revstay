"use client";

import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogOut, CalendarDays, LayoutDashboard } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuthModal } from "@/components/auth/auth-provider";

function initials(nameOrEmail: string) {
  const base = nameOrEmail.trim();
  if (base.includes("@")) return base[0]?.toUpperCase() ?? "?";
  return base
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

// Desktop navbar auth control: "Sign In" link when signed out, avatar +
// dropdown when signed in.
export function UserMenu() {
  const t = useTranslations("auth");
  const { data: session, status } = useSession();
  const { openAuth, openMyBookings } = useAuthModal();
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (status !== "authenticated" || !session?.user) {
    return (
      <button
        type="button"
        onClick={() => openAuth("signin")}
        className="text-sm font-semibold text-ink/80 transition-colors hover:text-gold-600"
      >
        {t("menu.signInLink")}
      </button>
    );
  }

  const label = session.user.name || session.user.email || "?";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-sm font-semibold text-gold-ink ring-2 ring-transparent transition-all hover:ring-gold-500/30"
      >
        {initials(label)}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 z-50 w-60 overflow-hidden rounded-2xl border border-ink/10 bg-white-soft shadow-[var(--shadow-warm)] ltr:right-0 rtl:left-0"
          >
            <div className="border-b border-ink/10 px-4 py-3">
              {session.user.name && (
                <p className="truncate text-sm font-semibold text-ink">{session.user.name}</p>
              )}
              <p className="truncate text-xs text-ink-mute" dir="ltr">
                {session.user.email}
              </p>
            </div>
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-gold-600 transition-colors hover:bg-gold-500/10"
              >
                <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
                {t("menu.dashboard")}
              </Link>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                openMyBookings();
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
              {t("menu.myBookings")}
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 border-t border-ink/10 px-4 py-3 text-sm text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <LogOut className="h-4 w-4 rtl:-scale-x-100" strokeWidth={1.75} />
              {t("menu.signOut")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
