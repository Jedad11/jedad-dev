# jedad.dev

Bilingual (Thai/English) portfolio site with a hidden admin panel for
managing projects and social links.

- **Frontend:** React + Vite + TypeScript + Tailwind CSS v4 (`frontend/`)
- **Backend:** Hono + TypeScript, Routes → Controllers → Prisma (`backend/`)
- **Database:** PostgreSQL (Supabase)
- **Auth:** JWT in an httpOnly cookie, bcrypt-hashed password, single admin
  user
- **Images:** Cloudinary (signed upload from the backend)

## Project structure

```
.
├── backend/    Hono API — see backend/src for routes/controllers/schemas
├── frontend/   React app — pages, components, TH/EN language context
└── docker-compose.yml
```

## Running locally with npm (recommended for day-to-day development)

Use this when actively working on the code — it gives you hot reload on
both the API and the UI.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, DIRECT_URL, JWT_SECRET, etc. — see below
npm run prisma:migrate # applies the schema to your database
npm run seed            # creates the single Admin user from SEED_ADMIN_USERNAME/PASSWORD
npm run dev              # http://localhost:4000
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:4000/api
npm run dev              # http://localhost:5173
```

Visit `http://localhost:5173`. The admin panel is at `/mgmt-x7k2` — it is
intentionally not linked from the public site.

## Running with Docker (clean, reproducible setup)

Use this to verify the app runs the same way it would in production, or to
hand the project to someone else without them installing Node/Postgres
locally. It's slower to iterate in (no hot reload), so prefer the npm
workflow above while actively developing.

```bash
cp .env.example .env   # fill in the values (see below)
docker compose up --build
```

This brings up three containers:

- `db` — Postgres 16, with a named volume so data survives restarts
- `backend` — runs `prisma migrate deploy` on startup, then serves the API
  on `:4000`
- `frontend` — production Vite build, served by `serve` on `:5173`

Visit `http://localhost:5173` once all three are healthy.

> Note: the Docker Compose stack uses its own local Postgres container
> (`db`), not Supabase — this matches the spec's requirement that
> `docker-compose.yml` provisions a `postgres:16` service. If you'd rather
> point the Docker stack at Supabase too, override `DATABASE_URL`/
> `DIRECT_URL` in `.env` with your Supabase connection strings and remove
> the `db` service's dependency in `docker-compose.yml`.

## Environment variables

See `.env.example` at the root for the variables `docker-compose.yml`
expects, and `backend/.env.example` / `frontend/.env.example` for the npm
workflow. In short:

| Variable | Used by | Notes |
|---|---|---|
| `DATABASE_URL` | backend | Pooled Postgres connection (Supabase: Transaction pooler, port 6543) |
| `DIRECT_URL` | backend | Direct Postgres connection, used only by Prisma Migrate (Supabase: port 5432) |
| `JWT_SECRET` | backend | Long random string used to sign admin session tokens |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | backend | From your Cloudinary dashboard |
| `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` | backend (seed script only) | Credentials for the single admin account |
| `FRONTEND_ORIGIN` | backend | Used for CORS; the URL the frontend is served from |
| `VITE_API_URL` | frontend | Base URL of the backend API |

Never commit `.env` — it's gitignored. Only `.env.example` files are
tracked.

## Deployment

The live site:

- **Frontend:** https://jedad-dev.vercel.app (Vercel)
- **Backend API:** https://jedad-dev.onrender.com/api (Render)
- **Database:** Supabase Postgres — the same project used for local
  development. There is no separate production database; local dev and
  the live site share one Supabase instance.

| Service | Hosts | Deploys from | Notes |
|---|---|---|---|
| Vercel | `frontend/` (static build) | `main` branch, root directory `frontend` | `VITE_API_URL` env var points at the Render backend. `frontend/vercel.json` rewrites all paths to `index.html` so client-side routes (e.g. `/mgmt-x7k2`) don't 404 on direct navigation. |
| Render | `backend/` (Docker) | `main` branch, root directory `backend`, builds `backend/Dockerfile` | The container's `CMD` runs `prisma migrate deploy` before starting the server, so pending migrations apply automatically on every deploy. Env vars (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CLOUDINARY_*`, `COOKIE_SECURE=true`, `FRONTEND_ORIGIN`) are set directly in Render's dashboard, not in any file. |
| Supabase | Postgres database | — | Same project as local dev (see above). |

**To redeploy:** push to `main` — both Vercel and Render auto-deploy from
the GitHub repo, no manual steps needed.

**Render free tier cold starts:** the free instance spins down after a
period of inactivity. The first request after a spin-down takes roughly
30–60 seconds to respond while the container restarts; subsequent
requests are fast until it spins down again. This mainly affects the
first visitor after a quiet stretch — expect a slow initial load
occasionally.

**Production-specific behavior in the backend code:**
- CORS (`backend/src/index.ts`) allows only the origin(s) in
  `FRONTEND_ORIGIN` — set to the Vercel URL in Render, defaults to
  `localhost:5173` if unset.
- The auth cookie (`backend/src/controllers/auth.controller.ts`) is
  `secure` and `sameSite: "None"` when `COOKIE_SECURE=true`, required
  because the frontend and backend are on different domains. Locally
  (`COOKIE_SECURE=false`) it stays `sameSite: "Lax"` over plain HTTP.

### Keep-alive workflow

`.github/workflows/keep-alive.yml` pings `GET /api/health` on the Render
backend every 10 minutes (`schedule` + `workflow_dispatch`). This exists
for two reasons, and is **not** dead weight even if it looks unused:

- **Render's free web service spins down after ~15 minutes idle.** A
  periodic ping keeps it warm so visitors don't eat the 30–60s cold-start
  hit.
- **Supabase's free project pauses after 7 days of zero database
  activity**, and resuming a paused project requires manually clicking
  "Restore" in the Supabase dashboard — it does not resume itself. The
  health route does a real `prisma.project.count()` query (not just a
  static 200), so the ping counts as DB activity too.

The workflow fails (non-zero exit) if the response isn't a 200, which
also means a real outage shows up as a GitHub Actions failure email —
free uptime monitoring as a side effect.

The production URL is read from the `BACKEND_HEALTH_URL` repository
variable (Settings → Secrets and variables → Actions → Variables), not
hardcoded in the workflow, so it's a one-line update if the Render URL
ever changes.

**Note:** GitHub's scheduler doesn't guarantee the exact 10-minute
interval — during quiet periods for the repo, runs can be delayed. That's
fine here; the goal is "at least once every few hours," not precise
timing.
