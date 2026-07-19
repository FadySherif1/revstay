import { headers } from "next/headers";
import type { NextRequest } from "next/server";

// On Vercel, x-forwarded-for is set/overwritten by the platform's edge
// network before the request reaches app code, so it can be trusted there.
// x-real-ip is Vercel's own single-IP header and is preferred when present
// since it can't contain a client-supplied list. Outside Vercel (e.g. behind
// another reverse proxy), only trust these if you control the proxy chain.
function pickClientIp(forwardedFor: string | null, realIp: string | null): string {
  if (realIp) return realIp.trim();
  const first = forwardedFor?.split(",")[0]?.trim();
  return first || "unknown";
}

/** For use inside Server Actions ("use server" files). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  return pickClientIp(h.get("x-forwarded-for"), h.get("x-real-ip"));
}

/** For use inside Route Handlers (NextRequest available directly). */
export function getClientIpFromRequest(req: NextRequest): string {
  return pickClientIp(
    req.headers.get("x-forwarded-for"),
    req.headers.get("x-real-ip")
  );
}
