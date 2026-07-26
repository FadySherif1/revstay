"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { THEME_STORAGE_KEY } from "@/lib/theme-script";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: (origin: { x: number; y: number }) => void;
  isTransitioning: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

const TRANSITION_MS = 900;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);

  useLayoutEffect(() => {
    // The locale layout remounts when switching languages. Inline scripts do
    // not reliably run again during that client-side navigation, so the new
    // layout can momentarily lose data-theme. Restore the persisted choice
    // before paint instead of falling back to the provider's light default.
    let resolvedTheme: Theme | null = null;

    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "dark" || stored === "light") {
        resolvedTheme = stored;
      }
    } catch {
      // localStorage unavailable — fall through to the DOM/system preference.
    }

    if (!resolvedTheme) {
      const current = document.documentElement.getAttribute("data-theme");
      if (current === "dark" || current === "light") {
        resolvedTheme = current;
      }
    }

    resolvedTheme ??= window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    document.documentElement.setAttribute("data-theme", resolvedTheme);
    setTheme(resolvedTheme);
  }, []);

  const toggleTheme = useCallback(
    (origin: { x: number; y: number }) => {
      if (isTransitioningRef.current) return;

      const nextTheme: Theme = theme === "light" ? "dark" : "light";
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      function applyTheme() {
        document.documentElement.setAttribute("data-theme", nextTheme);
        setTheme(nextTheme);
        try {
          window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        } catch {
          // localStorage unavailable — theme just won't persist
        }
      }

      if (prefersReducedMotion || !overlayRef.current || !ringRef.current) {
        applyTheme();
        return;
      }

      isTransitioningRef.current = true;
      setIsTransitioning(true);

      const overlay = overlayRef.current;
      const ring = ringRef.current;

      const maxDistance = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y)
      );
      const finalRadius = maxDistance * 1.5;

      overlay.style.background =
        nextTheme === "dark" ? "#0b0f1a" : "#faf6ef";
      overlay.style.clipPath = `circle(0px at ${origin.x}px ${origin.y}px)`;
      overlay.style.opacity = "1";
      ring.style.left = `${origin.x}px`;
      ring.style.top = `${origin.y}px`;
      gsap.set(ring, { width: 0, height: 0, opacity: 1 });

      const state = { radius: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          overlay.style.opacity = "0";
          isTransitioningRef.current = false;
          setIsTransitioning(false);
        },
      });

      tl.to(state, {
        radius: finalRadius,
        duration: TRANSITION_MS / 1000,
        onUpdate: () => {
          overlay.style.clipPath = `circle(${state.radius}px at ${origin.x}px ${origin.y}px)`;
          gsap.set(ring, {
            width: state.radius * 2,
            height: state.radius * 2,
            x: -state.radius,
            y: -state.radius,
          });
        },
      }, 0);

      tl.to(ring, {
        opacity: 0,
        duration: 0.3,
        ease: "power1.out",
      }, TRANSITION_MS / 1000 - 0.3);

      // Switch theme tokens ~40% through the sweep, hidden behind the wave.
      tl.call(applyTheme, [], TRANSITION_MS * 0.4 / 1000);
    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[200] opacity-0"
        style={{ willChange: "clip-path, opacity" }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed z-[201] rounded-full opacity-0"
        style={{
          border: "1.5px solid var(--color-gold-400)",
          boxShadow: "0 0 24px 4px color-mix(in srgb, var(--color-gold-400) 45%, transparent)",
          willChange: "width, height, transform, opacity",
        }}
      />
    </ThemeContext.Provider>
  );
}
