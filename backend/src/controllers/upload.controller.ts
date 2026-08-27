import type { Context } from "hono";
import { uploadImage } from "../lib/cloudinary.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function uploadFile(c: Context) {
  const body = await c.req.parseBody();
  const file = body["file"];

  if (!(file instanceof File)) {
    return c.json({ error: "No file provided" }, 400);
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return c.json({ error: "Unsupported file type" }, 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    return c.json({ error: "File too large (max 5MB)" }, 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { url, publicId } = await uploadImage(buffer);

  return c.json({ url, publicId }, 201);
}
