const WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 10;

// TODO: move to Redis (or similar shared store) in production —
// an in-memory Map only rate-limits per server instance.
const requestLog = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter(
    (t) => now - t < WINDOW_MS
  );

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
