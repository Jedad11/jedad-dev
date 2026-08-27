import type { Context } from "hono";
import { prisma } from "../lib/prisma.js";
import { destroyImage } from "../lib/cloudinary.js";
import { createProjectSchema, updateProjectSchema } from "../schemas/project.schema.js";

export async function listProjects(c: Context) {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return c.json(projects);
}

export async function getProject(c: Context) {
  const id = c.req.param("id");
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!project) {
    return c.json({ error: "Project not found" }, 404);
  }

  return c.json(project);
}

export async function createProject(c: Context) {
  const body = await c.req.json().catch(() => null);
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const { liveUrl, githubUrl, images, ...rest } = parsed.data;
  const project = await prisma.project.create({
    data: {
      ...rest,
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
      images: { create: images },
    },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return c.json(project, 201);
}

export async function updateProject(c: Context) {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => null);
  const parsed = updateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const existing = await prisma.project.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    return c.json({ error: "Project not found" }, 404);
  }

  const { liveUrl, githubUrl, images, ...rest } = parsed.data;

  if (images !== undefined) {
    const keptPublicIds = new Set(images.map((img) => img.publicId));
    const removedImages = existing.images.filter((img) => !keptPublicIds.has(img.publicId));
    for (const image of removedImages) {
      try {
        await destroyImage(image.publicId);
      } catch (err) {
        console.error(`Failed to delete Cloudinary image ${image.publicId}:`, err);
      }
    }
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...rest,
      ...(liveUrl !== undefined ? { liveUrl: liveUrl || null } : {}),
      ...(githubUrl !== undefined ? { githubUrl: githubUrl || null } : {}),
      ...(images !== undefined
        ? { images: { deleteMany: {}, create: images } }
        : {}),
    },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return c.json(project);
}

export async function deleteProject(c: Context) {
  const id = c.req.param("id");

  const existing = await prisma.project.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    return c.json({ error: "Project not found" }, 404);
  }

  for (const image of existing.images) {
    try {
      await destroyImage(image.publicId);
    } catch (err) {
      console.error(`Failed to delete Cloudinary image ${image.publicId}:`, err);
    }
  }

  await prisma.project.delete({ where: { id } });

  return c.json({ ok: true });
}
