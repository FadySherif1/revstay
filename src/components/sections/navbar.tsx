"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MobileMenu } from "@/components/sections/mobile-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuthModal } from "@/components/auth/auth-provider";

export const NAV_LINKS = [
  { key: "services", href: "#services" },
  { key: "results", href: "#results" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
] as const;

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

export function Navbar() {
  const t = useTranslations("nav");
  const { requestBooking } = useAuthModal();
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-ivory/80 backdrop-blur-md border-b border-gold-500/15 shadow-[var(--shadow-warm-sm)]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="font-serif text-2xl tracking-wide text-ink"
          >
            Revstay
          </Link>

          <ul className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`relative pb-1 text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-gold-600"
                        : "text-ink/80 hover:text-gold-600"
                    }`}
                  >
                    {t(link.key)}
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 -bottom-0.5 h-px bg-gold-600 transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
            <button
              type="button"
              onClick={requestBooking}
              className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-gold-ink transition-colors hover:bg-gold-400"
            >
              {t("book")}
            </button>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="text-ink md:hidden"
          >
            {menuOpen ? (
              <X className="h-6 w-6" strokeWidth={1.75} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.75} />
            )}
          </button>
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        activeId={activeId}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
