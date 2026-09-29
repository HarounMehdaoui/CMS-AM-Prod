import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { mapHeroMedia, heroMediaOutputSchema, type HeroMediaRow } from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const row = await queryOne<HeroMediaRow>(
    `select * from hero_media where id = 1`
  );
  if (!row) {
    return NextResponse.json(
      { error: "Hero media has not been configured yet" },
      { status: 404 }
    );
  }
  const data = heroMediaOutputSchema.parse(mapHeroMedia(row));
  return NextResponse.json(data);
}
