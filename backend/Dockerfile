# ---- deps: install dependencies once, reused by the build stage ----
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- build: generate the Prisma client and compile TypeScript ----
FROM node:22-slim AS build
WORKDIR /app

# Prisma's query engine needs OpenSSL on Debian-based images
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- runtime: image with the compiled server plus the Prisma/tsx CLIs
# (needed for `prisma migrate deploy` on startup and the `seed` script) ----
FROM node:22-slim AS runtime
WORKDIR /app

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --include=dev
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
