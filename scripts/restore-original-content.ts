/**
 * One-time migration: restores the original site's real content into the CMS,
 * replacing the demo/placeholder seed data with it. Safe to re-run (every
 * write is either an upsert keyed by id, or an `on conflict do nothing`).
 *
 * Reads source images/video from the sibling site repo at
 * ../am-production/public/assets/.
 *
 * Usage: npx tsx scripts/restore-original-content.ts
 */
import { config } from "dotenv";
config({ path: [".env.local", ".env"] });

import { readFileSync } from "node:fs";
import path from "node:path";
import { query, queryOne } from "@/lib/db";
import { saveUploadedFile } from "@/lib/media";

const ASSETS_DIR = path.join(process.cwd(), "..", "am-production", "public", "assets");

async function uploadAsset(relPath: string): Promise<string> {
  const filePath = path.join(ASSETS_DIR, relPath);
  const buffer = readFileSync(filePath);
  const filename = path.basename(relPath);
  const file = new File([buffer], filename);
  const { url } = await saveUploadedFile(file);
  console.log(`  uploaded ${relPath} -> ${url}`);
  return url;
}

const MISSING_PROJECTS = [
  {
    id: "nova-skincare-brand-film",
    title: "Nova Skincare — Brand Film",
    description:
      "A moody, product-led brand film built around natural light and slow-motion macro texture shots.",
    category: "Brand Film",
    order: 1,
  },
  {
    id: "orbit-sneakers-campaign",
    title: "Orbit Sneakers — Launch Campaign",
    description:
      "Editorial stills and a 30-second teaser for a sneaker drop, shot across two studio days.",
    category: "Photography",
    order: 2,
  },
  {
    id: "meridian-hotels-portrait-series",
    title: "Meridian Hotels — Portrait Series",
    description:
      "Staff and guest portraiture for a boutique hotel group's rebrand, shot on location.",
    category: "Portrait",
    order: 3,
  },
  {
    id: "cinder-coffee-documentary",
    title: "Cinder Coffee — Origin Documentary",
    description:
      "A short-form documentary following a coffee roastery from bean sourcing to storefront.",
    category: "Documentary",
    order: 4,
  },
  {
    id: "atlas-fitness-social-series",
    title: "Atlas Fitness — Social Series",
    description:
      "A recurring monthly shoot producing vertical social content for a fitness studio chain.",
    category: "Social",
    order: 5,
  },
  {
    id: "verdant-architecture-lookbook",
    title: "Verdant Architecture — Lookbook",
    description:
      "An architectural photography lookbook shot at golden hour across three finished residential builds.",
    category: "Photography",
    order: 6,
  },
  {
    id: "lumen-jewelry-campaign",
    title: "Lumen Jewelry — Product Campaign",
    description:
      "Macro product photography and a stop-motion teaser for a fine jewelry seasonal collection.",
    category: "Brand Film",
    order: 7,
  },
  {
    id: "harbor-collective-event-recap",
    title: "Harbor Collective — Event Recap",
    description:
      "Same-week turnaround coverage and highlight reel for a two-day creative industry summit.",
    category: "Film",
    order: 8,
  },
];

const CLIENT_LOGOS = [
  "clients/logo-1.png",
  "clients/logo-2.png",
  "clients/logo-3.png",
  "clients/logo-wave.png",
];

const TICKER_CARDS = Array.from({ length: 12 }, (_, i) => `circle-ticker/card-${i + 1}.png`);

async function restoreProjects() {
  console.log("\n== Projects ==");
  for (const p of MISSING_PROJECTS) {
    const row = await queryOne<{ id: string }>(
      `insert into projects (id, title, description, category, media, video_embed, published, "order")
       values ($1, $2, $3, $4, null, null, true, $5)
       on conflict (id) do nothing
       returning id`,
      [p.id, p.title, p.description, p.category, p.order]
    );
    console.log(row ? `  inserted ${p.id}` : `  skipped ${p.id} (already exists)`);
  }
}

async function restoreClients() {
  console.log("\n== Clients ==");
  const rows = await query<{ id: string }>(`select id from clients order by "order" asc`);
  if (rows.length !== CLIENT_LOGOS.length) {
    throw new Error(
      `Expected ${CLIENT_LOGOS.length} client rows to repoint, found ${rows.length}.`
    );
  }

  const updates: Record<string, string> = {};
  for (let i = 0; i < rows.length; i++) {
    const url = await uploadAsset(CLIENT_LOGOS[i]);
    await query(`update clients set image = $1, updated_at = now() where id = $2`, [
      url,
      rows[i].id,
    ]);
    updates[rows[i].id] = url;
    console.log(`  ${rows[i].id} -> ${url}`);
  }
  return updates;
}

async function restoreCircleTicker() {
  console.log("\n== Circle ticker ==");
  const existing = await query<{ id: string; order: number }>(
    `select id, "order" from circle_ticker_images order by "order" asc`
  );

  const urls: string[] = [];
  for (const rel of TICKER_CARDS) {
    urls.push(await uploadAsset(rel));
  }

  const updates: Record<string, string> = {};

  // Repoint the existing rows (first N uploads, by order).
  for (let i = 0; i < existing.length; i++) {
    const url = urls[i];
    await query(
      `update circle_ticker_images set image_url = $1, updated_at = now() where id = $2`,
      [url, existing[i].id]
    );
    updates[existing[i].id] = url;
    console.log(`  repointed ${existing[i].id} -> ${url}`);
  }

  // Insert the rest as new rows, continuing the order sequence.
  const existingIds = new Set(existing.map((r) => r.id));
  let nextOrder = existing.length > 0 ? Math.max(...existing.map((r) => r.order)) + 1 : 1;
  let newIdCounter = existing.length + 1;

  for (let i = existing.length; i < urls.length; i++) {
    let id = `card-${newIdCounter}`;
    while (existingIds.has(id)) {
      newIdCounter++;
      id = `card-${newIdCounter}`;
    }
    existingIds.add(id);
    newIdCounter++;

    await query(
      `insert into circle_ticker_images (id, image_url, "order") values ($1, $2, $3)
       on conflict (id) do nothing`,
      [id, urls[i], nextOrder]
    );
    updates[id] = urls[i];
    console.log(`  inserted ${id} (order ${nextOrder}) -> ${urls[i]}`);
    nextOrder++;
  }

  return updates;
}

async function restoreHeroMedia() {
  console.log("\n== Hero media ==");
  const url = await uploadAsset("banner_video.mp4");
  await query(
    `insert into hero_media (id, video_url) values (1, $1)
     on conflict (id) do update set video_url = excluded.video_url, updated_at = now()`,
    [url]
  );
  console.log(`  hero video -> ${url}`);
  return url;
}

async function main() {
  await restoreProjects();
  const clientUpdates = await restoreClients();
  const tickerUpdates = await restoreCircleTicker();
  const heroVideoUrl = await restoreHeroMedia();

  console.log("\n== Summary for lib/default-images.ts ==");
  console.log("clients:", JSON.stringify(clientUpdates, null, 2));
  console.log("circleTicker:", JSON.stringify(tickerUpdates, null, 2));
  console.log("heroMedia.videoUrl:", heroVideoUrl);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
