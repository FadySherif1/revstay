import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Content-Security-Policy compromises, documented:
// - script-src 'unsafe-inline': the FOUC-prevention theme script in
//   app/[locale]/layout.tsx is a raw inline <script> with no nonce
//   plumbing set up yet. Tightening this to a nonce/hash is a follow-up;
//   for now this is the one script-src relaxation.
// - style-src 'unsafe-inline': Next/Tailwind and some third-party
//   components (embla-carousel, lucide) set style attributes directly;
//   GSAP/Framer Motion animate via element.style.* JS assignment, which
//   CSP does not gate, so this is only needed for literal style="" attrs.
// - connect-src includes api.openai.com (chat streaming is proxied through
//   our own /api/chat route server-side, but keep this in case any
//   client-side telemetry from the openai SDK ever runs) and the Google
//   OAuth/accounts endpoints for the (currently dormant) Google sign-in.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.openai.com https://accounts.google.com",
  "frame-src 'self' https://accounts.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [72, 75, 78, 82],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
