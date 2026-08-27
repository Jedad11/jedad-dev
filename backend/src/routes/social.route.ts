import { Hono } from "hono";
import {
  createSocialLink,
  deleteSocialLink,
  listSocialLinks,
  updateSocialLink,
} from "../controllers/social.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const socialRoute = new Hono();

socialRoute.get("/", listSocialLinks);
socialRoute.post("/", requireAuth, createSocialLink);
socialRoute.patch("/:id", requireAuth, updateSocialLink);
socialRoute.delete("/:id", requireAuth, deleteSocialLink);
