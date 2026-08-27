import type { Context } from "hono";
import { prisma } from "../lib/prisma.js";
import { createSocialLinkSchema, updateSocialLinkSchema } from "../schemas/social.schema.js";

export async function listSocialLinks(c: Context) {
  const links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  return c.json(links);
}

export async function createSocialLink(c: Context) {
  const body = await c.req.json().catch(() => null);
  const parsed = createSocialLinkSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const link = await prisma.socialLink.create({ data: parsed.data });
  return c.json(link, 201);
}

export async function updateSocialLink(c: Context) {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => null);
  const parsed = updateSocialLinkSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const existing = await prisma.socialLink.findUnique({ where: { id } });
  if (!existing) {
    return c.json({ error: "Social link not found" }, 404);
  }

  const link = await prisma.socialLink.update({ where: { id }, data: parsed.data });
  return c.json(link);
}

export async function deleteSocialLink(c: Context) {
  const id = c.req.param("id");

  const existing = await prisma.socialLink.findUnique({ where: { id } });
  if (!existing) {
    return c.json({ error: "Social link not found" }, 404);
  }

  await prisma.socialLink.delete({ where: { id } });
  return c.json({ ok: true });
}
