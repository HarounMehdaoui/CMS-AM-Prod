import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { DEFAULT_IMAGES } from "@/lib/default-images";

export const dynamic = "force-dynamic";

async function resetOne(sql: string, params: unknown[]) {
  const rows = await query<{ id: string }>(sql, params);
  return rows.length > 0;
}

export async function POST() {
  let restored = 0;
  let skipped = 0;

  const tally = (found: boolean) => (found ? restored++ : skipped++);

  for (const [id, fields] of Object.entries(DEFAULT_IMAGES.projects)) {
    tally(
      await resetOne(
        `update projects set media = $1, updated_at = now() where id = $2 returning id`,
        [fields.media, id]
      )
    );
  }

  for (const [id, fields] of Object.entries(DEFAULT_IMAGES.services)) {
    tally(
      await resetOne(
        `update services set image = $1, icon = $2, updated_at = now() where id = $3 returning id`,
        [fields.image, fields.icon, id]
      )
    );
  }

  for (const [id, fields] of Object.entries(DEFAULT_IMAGES.testimonials)) {
    tally(
      await resetOne(
        `update testimonials set avatar = $1, updated_at = now() where id = $2 returning id`,
        [fields.avatar, id]
      )
    );
  }

  for (const [id, fields] of Object.entries(DEFAULT_IMAGES.clients)) {
    tally(
      await resetOne(
        `update clients set image = $1, updated_at = now() where id = $2 returning id`,
        [fields.image, id]
      )
    );
  }

  for (const [id, fields] of Object.entries(DEFAULT_IMAGES.circleTicker)) {
    tally(
      await resetOne(
        `update circle_ticker_images set image_url = $1, updated_at = now() where id = $2 returning id`,
        [fields.imageUrl, id]
      )
    );
  }

  await query(
    `insert into hero_media (id, video_url)
     values (1, $1)
     on conflict (id) do update set video_url = excluded.video_url, updated_at = now()`,
    [DEFAULT_IMAGES.heroMedia.videoUrl]
  );
  restored++;

  return NextResponse.json({ ok: true, restored, skipped });
}
