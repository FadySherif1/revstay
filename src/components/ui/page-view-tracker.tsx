"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

// Fires a lightweight beacon to /api/track on each route change so the
// admin dashboard can count visits. Fire-and-forget; failures are ignored.
export function PageViewTracker() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const body = JSON.stringify({ path: pathname, locale });
    // keepalive lets it complete even if the page is navigating away.
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // ignore — tracking is best-effort
    });
  }, [pathname, locale]);

  return null;
}
