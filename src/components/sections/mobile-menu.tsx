"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/components/sections/navbar";

export function MobileMenu({
  open,
  activeId,
  onClose,
}: {
  open: boolean;
  activeId: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 flex flex-col bg-ivory md:hidden"
        >
          <div className="flex justify-end px-6 pt-6">
            <span className="h-16" aria-hidden />
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {NAV_LINKS.map((link, i) => {
              const isActive = activeId === link.href.slice(1);
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`font-serif text-3xl ${
                      isActive ? "text-gold-600" : "text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + NAV_LINKS.length * 0.07, duration: 0.4 }}
              className="mt-4"
            >
              <Link
                href="#book"
                onClick={onClose}
                className="rounded-full bg-gold-500 px-8 py-3 text-base font-semibold text-ink"
              >
                Book a Free Consultation
              </Link>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
