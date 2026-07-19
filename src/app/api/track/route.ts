import { NextRequest } from "next/server";
import { createHash } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIpFromRequest } from "@/lib/client-ip";

const TRACK_MAX_PER_MIN = 60;

export const runtime = "nodejs";

const bodySchema = z.object({
  path: z.string().max(512),
  locale: z.string().max(8).optional(),
});

// Salted hash of IP + UA — lets us estimate unique visitors without
// storing any raw PII. Salt comes from AUTH_SECRET (already secret).
function visitorHash(ip: string, ua: string): string {
  const salt = process.env.AUTH_SECRET ?? "revstay";
  return createHash("sha256").update(`${salt}:${ip}:${ua}`).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  const ip = getClientIpFromRequest(req);

  // Never surface rate-limit failures to the visitor — tracking is
  // best-effort — just stop writing once the per-IP budget is spent.
  const { allowed } = await checkRateLimit(`track:${ip}`, TRACK_MAX_PER_MIN);
  if (!allowed) return new Response(null, { status: 204 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 204 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return new Response(null, { status: 204 });

  const ua = req.headers.get("user-agent") ?? "unknown";

  try {
    await prisma.pageView.create({
      data: {
        path: parsed.data.path.slice(0, 512),
        locale: parsed.data.locale ?? null,
        visitorId: visitorHash(ip, ua),
      },
    });
  } catch (err) {
    console.error("track error:", err);
  }
  // Always 204 — tracking must never surface an error to the visitor.
  return new Response(null, { status: 204 });
}
