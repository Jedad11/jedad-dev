import { Hono } from "hono";
import { uploadFile } from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const uploadRoute = new Hono();

uploadRoute.post("/", requireAuth, uploadFile);
