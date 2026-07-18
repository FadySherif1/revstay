"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NAVBAR_OFFSET = 88;

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Keep ScrollTrigger in sync with Lenis's smooth-scroll position and
    // drive Lenis from GSAP's ticker so triggers never drift.
    lenis.on("scroll", ScrollTrigger.update);

    function onRaf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    // Recalculate all trigger positions once layout has settled.
    ScrollTrigger.refresh();

    function onAnchorClick(event: MouseEvent) {
      const target = (event.target as HTMLElement).closest("a[href^='#']");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;

      event.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -NAVBAR_OFFSET });
    }

    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
