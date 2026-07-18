import type { ReactNode } from "react";

// The locale layout (app/[locale]/layout.tsx) renders <html>/<body>.
// This root layout only needs to pass children through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
