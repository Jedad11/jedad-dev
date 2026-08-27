import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoute } from "./routes/auth.route.js";
import { projectRoute } from "./routes/project.route.js";
import { socialRoute } from "./routes/social.route.js";
import { uploadRoute } from "./routes/upload.route.js";

const app = new Hono();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use(
  "/api/*",
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get("/api/health", (c) => c.json({ ok: true }));

app.route("/api/auth", authRoute);
app.route("/api/projects", projectRoute);
app.route("/api/social-links", socialRoute);
app.route("/api/upload", uploadRoute);

const port = Number(process.env.PORT ?? 4000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Backend running at http://localhost:${info.port}`);
});
