import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { cleanupOrphanedFile } from "@/lib/media-cleanup";
import { DEFAULT_IMAGES } from "@/lib/default-images";

export const dynamic = "force-dynamic";

/**
 * Resets one or more columns on a single row to the given baseline values,
 * cleaning up whatever non-baseline file(s) it displaces in the process.
 * Returns whether a row was found (for the restored/skipped tally).
 */
async function resetFields(
  table: string,
  idColumn: string,
  id: string,
  updates: Record<string, string>
): Promise<boolean> {
  const columns = Object.keys(updates);

  const previous = await queryOne<Record<string, string>>(
    `select ${columns.join(", ")} from ${table} where ${idColumn} = $1`,
    [id]
  );
  if (!previous) return false;

  const setClause = columns.map((c, i) => `${c} = $${i + 1}`).join(", ");
  const values: unknown[] = columns.map((c) => updates[c]);
  values.push(id);

  const row = await queryOne<Record<string, string>>(
    `update ${table} set ${setClause}, updated_at = now() where ${idColumn} = $${values.length} returning ${columns.join(", ")}`,
    values
  );
  if (!row) return false;

  for (const c of columns) {
    if (previous[c] !== row[c]) {
      await cleanupOrphanedFile(previous[c]);
    }
  }

  return true;
}

export async function POST() {
  let restored = 0;
  let skipped = 0;
  const tally = (found: boolean) => (found ? restored++ : skipped++);

  for (const [id, fields] of Object.entries(DEFAULT_IMAGES.projects)) {
    tally(await resetFields("projects", "id", id, { media: fields.media }));
  }

  for (const [id, fields] of Object.entries(DEFAULT_IMAGES.services)) {
    tally(
      await resetFields("services", "id", id, { image: fields.image, icon: fields.icon })
    );
  }

  for (const [id, fields] of Object.entries(DEFAULT_IMAGES.testimonials)) {
    tally(await resetFields("testimonials", "id", id, { avatar: fields.avatar }));
  }

  for (const [id, fields] of Object.entries(DEFAULT_IMAGES.clients)) {
    tally(await resetFields("clients", "id", id, { image: fields.image }));
  }

  for (const [id, fields] of Object.entries(DEFAULT_IMAGES.circleTicker)) {
    tally(
      await resetFields("circle_ticker_images", "id", id, { image_url: fields.imageUrl })
    );
  }

  const previousHero = await queryOne<{ video_url: string }>(
    `select video_url from hero_media where id = 1`
  );
  await query(
    `insert into hero_media (id, video_url)
     values (1, $1)
     on conflict (id) do update set video_url = excluded.video_url, updated_at = now()`,
    [DEFAULT_IMAGES.heroMedia.videoUrl]
  );
  if (previousHero && previousHero.video_url !== DEFAULT_IMAGES.heroMedia.videoUrl) {
    await cleanupOrphanedFile(previousHero.video_url);
  }
  restored++;

  return NextResponse.json({ ok: true, restored, skipped });
}
