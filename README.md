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
