import { Hono } from "hono";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "../controllers/project.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const projectRoute = new Hono();

projectRoute.get("/", listProjects);
projectRoute.get("/:id", getProject);
projectRoute.post("/", requireAuth, createProject);
projectRoute.patch("/:id", requireAuth, updateProject);
projectRoute.delete("/:id", requireAuth, deleteProject);
