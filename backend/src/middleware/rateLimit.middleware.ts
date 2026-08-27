import type { Context, Next } from "hono";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function getClientIp(c: Context): string {
  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return c.req.header("x-real-ip") ?? "unknown";
}

export async function loginRateLimit(c: Context, next: Next) {
  const ip = getClientIp(c);
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    await next();
    return;
  }

  if (bucket.count >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((bucket.resetAt - now) / 1000);
    c.header("Retry-After", String(retryAfterSec));
    return c.json(
      { error: "Too many login attempts. Please try again later." },
      429
    );
  }

  bucket.count += 1;
  await next();
}
