import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verifyAdminToken } from "../lib/jwt.js";

export const AUTH_COOKIE_NAME = "portfolio_admin_token";

export async function requireAuth(c: Context, next: Next) {
  const token = getCookie(c, AUTH_COOKIE_NAME);
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = verifyAdminToken(token);
    c.set("admin", payload);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
}
