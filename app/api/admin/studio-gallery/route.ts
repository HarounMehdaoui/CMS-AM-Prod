import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import {
  mapStudioGallery,
  studioGalleryCreateSchema,
  type StudioGalleryRow,
} from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<StudioGalleryRow>(
    `select * from studio_gallery_images order by "order" asc, created_at asc`
  );
  return NextResponse.json(rows.map(mapStudioGallery));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = studioGalleryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, imageUrl, caption, order } = parsed.data;

  const existing = await queryOne(
    `select id from studio_gallery_images where id = $1`,
    [id]
  );
  if (existing) {
    return NextResponse.json(
      { error: "A gallery image with this id already exists" },
      { status: 409 }
    );
  }

  const row = await queryOne<StudioGalleryRow>(
    `insert into studio_gallery_images (id, image_url, caption, "order")
     values ($1, $2, $3, $4)
     returning *`,
    [id, imageUrl, caption ?? null, order]
  );

  return NextResponse.json(mapStudioGallery(row!), { status: 201 });
}
