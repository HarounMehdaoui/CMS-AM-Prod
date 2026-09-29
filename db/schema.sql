-- Alpha Motion CMS schema (plain Postgres, no Supabase).
-- Run with: psql "$DATABASE_URL" -f db/schema.sql
-- (idempotent: safe to re-run)

create table if not exists admin_users (
  id text primary key,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id text primary key,
  title text not null,
  description text not null,
  category text not null,
  media text,
  video_embed text,
  published boolean not null default true,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id text primary key,
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  image text not null,
  icon text not null,
  layout text not null check (layout in ('wide', 'tall')),
  published boolean not null default true,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists testimonials (
  id text primary key,
  quote text not null,
  name text not null,
  company text not null,
  avatar text not null,
  published boolean not null default true,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clients (
  id text primary key,
  name text not null,
  image text not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists circle_ticker_images (
  id text primary key,
  image_url text not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Singleton: exactly one row, id always 1.
create table if not exists hero_media (
  id integer primary key default 1 check (id = 1),
  video_url text not null,
  updated_at timestamptz not null default now()
);
