import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import {
  mapHeroMedia,
  heroMediaUpsertSchema,
  type HeroMediaRow,
} from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const row = await queryOne<HeroMediaRow>(`select * from hero_media where id = 1`);
  if (!row) return NextResponse.json({ videoUrl: null });
  return NextResponse.json(mapHeroMedia(row));
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = heroMediaUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const row = await queryOne<HeroMediaRow>(
    `insert into hero_media (id, video_url)
     values (1, $1)
     on conflict (id) do update set video_url = excluded.video_url, updated_at = now()
     returning *`,
    [parsed.data.videoUrl]
  );

  return NextResponse.json(mapHeroMedia(row!));
}
