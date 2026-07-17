"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const MAX_DURATION_MS = 1500;

export function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setVisible(false), MAX_DURATION_MS);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  if (prefersReducedMotion) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="presentation"
          aria-hidden
          onClick={() => setVisible(false)}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-ivory"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.05em" }}
            animate={{ opacity: 1, letterSpacing: "0.02em" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-3xl text-gold-600 sm:text-4xl"
          >
            Revstay
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
