import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 10;

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

// Upstash Redis is serverless-native (REST-based, no persistent connection)
// so it works correctly across cold starts and multiple server instances —
// unlike an in-memory Map, which only limits per instance and resets on
// every cold start. Falls back to in-memory only when the env vars are
// absent (local dev without an Upstash project configured).
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis =
  redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

if (!redis && process.env.NODE_ENV === "production") {
  console.warn(
    "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not set — falling back to " +
      "in-memory rate limiting, which does NOT work correctly across " +
      "multiple serverless instances. Set them in production."
  );
}

// One Ratelimit instance per distinct maxRequests value (Upstash's
// sliding-window limiter is configured with a fixed limit per instance).
const limiters = new Map<number, Ratelimit>();

function getLimiter(maxRequests: number): Ratelimit {
  let limiter = limiters.get(maxRequests);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(maxRequests, "60 s"),
      analytics: false,
      prefix: "revstay:ratelimit",
    });
    limiters.set(maxRequests, limiter);
  }
  return limiter;
}

// In-memory fallback (local dev only) — same behavior as before.
const requestLog = new Map<string, number[]>();

function checkRateLimitInMemory(key: string, maxRequests: number): RateLimitResult {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= maxRequests) {
    const oldestInWindow = timestamps[0];
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - oldestInWindow)) / 1000);
    requestLog.set(key, timestamps);
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function checkRateLimit(
  key: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS
): Promise<RateLimitResult> {
  if (!redis) {
    return checkRateLimitInMemory(key, maxRequests);
  }

  const { success, reset } = await getLimiter(maxRequests).limit(key);
  return {
    allowed: success,
    retryAfterSeconds: success ? 0 : Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
  };
}
