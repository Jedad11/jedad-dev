import { Hono } from "hono";
import { login, logout, me } from "../controllers/auth.controller.js";
import { loginRateLimit } from "../middleware/rateLimit.middleware.js";

export const authRoute = new Hono();

authRoute.post("/login", loginRateLimit, login);
authRoute.post("/logout", logout);
authRoute.get("/me", me);
