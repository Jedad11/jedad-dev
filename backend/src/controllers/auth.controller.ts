import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { signAdminToken, verifyAdminToken } from "../lib/jwt.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { AUTH_COOKIE_NAME } from "../middleware/auth.middleware.js";

const GENERIC_INVALID_CREDENTIALS = "Invalid username or password";

export async function login(c: Context) {
  const body = await c.req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const { username, password } = parsed.data;

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    return c.json({ error: GENERIC_INVALID_CREDENTIALS }, 401);
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) {
    return c.json({ error: GENERIC_INVALID_CREDENTIALS }, 401);
  }

  const token = signAdminToken({ adminId: admin.id, username: admin.username });

  setCookie(c, AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return c.json({ ok: true, username: admin.username });
}

export async function logout(c: Context) {
  deleteCookie(c, AUTH_COOKIE_NAME, { path: "/" });
  return c.json({ ok: true });
}

export async function me(c: Context) {
  const token = getCookie(c, AUTH_COOKIE_NAME);

  if (!token) {
    return c.json({ authenticated: false });
  }

  try {
    const payload = verifyAdminToken(token);
    return c.json({ authenticated: true, username: payload.username });
  } catch {
    return c.json({ authenticated: false });
  }
}
