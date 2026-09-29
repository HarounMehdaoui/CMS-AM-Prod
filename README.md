# Alpha Motion CMS

A standalone admin/CMS for the Alpha Motion marketing site. Manages six content
types (hero video, circle ticker images, projects, services, testimonials,
clients) and exposes them as a public, read-only JSON API under `/v1/*` that
the public site (a separate repo) fetches server-side.

Stack: Next.js (App Router, TypeScript) for both the admin UI and the API
routes, plain Postgres (via `pg`, no ORM) for storage, a custom
credentials + signed-cookie session for the single admin login, and local
disk storage (`/public/uploads`) for uploaded media. No Supabase — this is a
deliberate deviation from a more "batteries-included" setup, made to keep the
infrastructure surface to one Postgres database and no third-party auth/storage
service.

## Contents

- [Environment variables](#environment-variables)
- [Running locally](#running-locally)
- [Seeding the admin account](#seeding-the-admin-account)
- [Database schema / migration](#database-schema--migration)
- [API contract](#api-contract)
- [Media storage caveat](#media-storage-caveat-read-this-before-deploying)
- [Deployment](#deployment)

## Environment variables

See `.env.example`. Copy it to `.env.local` for local dev:

| Variable | Used by | Notes |
|---|---|---|
| `DATABASE_URL` | app + scripts | Postgres connection string |
| `DATABASE_SSL` | app + scripts | `"true"` to connect with `rejectUnauthorized: false` (e.g. managed Postgres requiring TLS) |
| `SESSION_SECRET` | app | Random 32+ byte secret signing the admin session JWT. Generate with `openssl rand -base64 48` |
| `APP_BASE_URL` | app | Absolute base URL this app is deployed at (e.g. `https://cms.alphamotion.com`, or `http://localhost:3000` locally). Used to build absolute URLs for uploaded media, since the public site consumes this API from a different domain |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | `npm run seed:admin` only | One-time seed values, not read at runtime |

## Running locally

Requires Node 20+ and a Postgres database (a `docker-compose.yml` is included
for local dev).

```bash
npm install

# start local Postgres (postgresql://cms:cms@localhost:5432/cms)
docker compose up -d

cp .env.example .env.local
# edit .env.local: fill in SESSION_SECRET, leave DATABASE_URL as-is for the
# docker-compose db, set ADMIN_EMAIL/ADMIN_PASSWORD

npm run db:migrate     # applies db/schema.sql
npm run seed:admin     # creates the admin_users row

npm run dev             # http://localhost:3000
```

Sign in at `/admin/login` with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you seeded.

## Seeding the admin account

There is a single admin account, stored in the `admin_users` table (email +
bcrypt password hash). No signup flow. Create or reset it with:

```bash
ADMIN_EMAIL=you@studio.com ADMIN_PASSWORD='a-strong-password' DATABASE_URL=... \
  npx tsx scripts/seed-admin.ts
```

Or, with `.env.local` populated, just `npm run seed:admin`. Re-running it
with the same email updates that account's password (upsert on `email`).

Login uses a custom flow, not a library: `/api/admin/login` checks the
submitted password against the stored bcrypt hash and, on success, sets an
httpOnly, signed JWT (`jose`, HS256) as the `am_cms_session` cookie. `proxy.ts`
(Next's middleware/proxy convention) verifies that cookie on every request
under `/admin/*` and `/api/admin/*` (except the login route itself) and
redirects (pages) or 401s (API) if it's missing or invalid.

## Database schema / migration

Plain SQL, no migration framework — `db/schema.sql`, applied with:

```bash
npm run db:migrate
```

(safe to re-run; every statement is `create table if not exists`). If you'd
rather apply it directly: `psql "$DATABASE_URL" -f db/schema.sql`.

Tables: `projects`, `services`, `testimonials`, `clients`,
`circle_ticker_images`, `hero_media` (singleton, `id` always `1`), plus
`admin_users` for the single admin login. Columns are snake_case; the `/v1/*`
route handlers translate to camelCase explicitly (see `lib/entities.ts`) —
nothing returns a raw DB row.

## API contract

### Public, read-only — `/v1/*`

No auth. Called server-side by the public site. Always returns published rows
only (hero media has no draft state — it's always returned), sorted by
`order` ascending, as a bare JSON array (or a bare object for the hero-media
singleton). Every response is validated against a zod schema matching the
exact field-for-field shape the site's own zod schemas expect (camelCase,
nothing extra, nothing missing) before it leaves the route handler.

| Endpoint | Shape |
|---|---|
| `GET /v1/projects` | `Project[]` |
| `GET /v1/services` | `Service[]` |
| `GET /v1/testimonials` | `Testimonial[]` |
| `GET /v1/clients` | `Client[]` |
| `GET /v1/circle-ticker` | `CircleTickerImage[]` |
| `GET /v1/hero-media` | `HeroMedia` (singleton object; `404` if never configured) |

Field shapes are defined once in `lib/entities.ts` and mirror the spec this
project was built against exactly — see that file for the authoritative
types.

### Authenticated admin API — `/api/admin/*`

Every route requires the `am_cms_session` cookie (see above); unauthenticated
requests get `401`. Chosen as the "own prefix" for admin JSON endpoints so it
doesn't collide with the `/admin/*` page routes in the App Router.

- `POST /api/admin/login`, `POST /api/admin/logout`
- `POST /api/admin/media` — multipart upload (`file` field), admin-auth-only, returns `{ "url": "..." }`. Shared by every upload field in the admin UI.
- For each of `projects`, `services`, `testimonials`, `clients`, `circle-ticker`:
  - `GET /api/admin/<entity>` — list **all** rows (draft + published), sorted by order
  - `POST /api/admin/<entity>` — create (validates with the entity's zod create schema; `409` if `id` already exists)
  - `GET|PATCH|DELETE /api/admin/<entity>/[id]`
- `GET|PUT /api/admin/hero-media` — singleton get/upsert, no delete

### Slugs (`id`)

`id` is the primary key and, for projects, becomes the literal `/projects/<id>`
URL on the public site. The admin UI auto-slugifies it from the title/name as
you type (`lib/slugify.ts`), lets you override it before first save, and
disables the field entirely once a record exists — the API doesn't accept
`id` in update payloads at all (it's omitted from every `*UpdateSchema`), so
an existing row's `id` can only change via delete + recreate.

## Media storage caveat — read this before deploying

Uploaded media (cover images, avatars, logos, ticker photos, hero video) is
written straight to `/public/uploads` on local disk (`lib/media.ts`) and
served back by Next's static file handling, with the returned URL made
absolute using `APP_BASE_URL` since the public site fetches this API from a
different domain.

**This only works on a host with a persistent, writable filesystem.** It will
not survive redeploys (or even different invocations of the same request) on
Vercel or any other serverless/ephemeral-filesystem host — uploads would
silently disappear. This tradeoff was chosen deliberately over adding an S3
bucket as a dependency; if you deploy here, use a Node host with a persistent
disk (a small VPS, Railway, Fly.io with a volume, etc.), or mount a persistent
volume at `public/uploads` in your container. If a serverless host is a hard
requirement, swap `lib/media.ts` for an S3-compatible upload instead — it's
the one file that would need to change.

## Deployment

1. Provision Postgres somewhere reachable from your host; run `npm run db:migrate` against it.
2. Run `npm run seed:admin` once, against the same `DATABASE_URL`, to create the admin login.
3. Deploy the Next.js app to a host with a **persistent filesystem** (see caveat above) — set `DATABASE_URL`, `SESSION_SECRET`, and `APP_BASE_URL` (your deployed URL) as env vars.
4. Point the public site's `CMS_API_URL` at this app's deployed URL. Its 60s ISR cache means a save here shows up live within about a minute — no webhook or rebuild needed.
