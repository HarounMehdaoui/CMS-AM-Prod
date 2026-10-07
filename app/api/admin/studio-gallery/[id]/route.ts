import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { buildUpdateSet } from "@/lib/crud";
import { cleanupOrphanedFile } from "@/lib/media-cleanup";
import {
  mapStudioGallery,
  studioGalleryUpdateSchema,
  type StudioGalleryRow,
} from "@/lib/entities";

export const dynamic = "force-dynamic";

const COLUMN_MAP: Record<string, string> = {
  imageUrl: "image_url",
  caption: "caption",
  order: '"order"',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await queryOne<StudioGalleryRow>(
    `select * from studio_gallery_images where id = $1`,
    [id]
  );
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mapStudioGallery(row));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = studioGalleryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { setClauses, values, nextIndex } = buildUpdateSet(COLUMN_MAP, parsed.data);
  if (setClauses.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const previous =
    "imageUrl" in parsed.data
      ? await queryOne<{ image_url: string }>(
          `select image_url from studio_gallery_images where id = $1`,
          [id]
        )
      : null;

  setClauses.push(`updated_at = now()`);
  values.push(id);

  const row = await queryOne<StudioGalleryRow>(
    `update studio_gallery_images set ${setClauses.join(", ")} where id = $${nextIndex} returning *`,
    values
  );
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (previous && previous.image_url !== row.image_url) {
    await cleanupOrphanedFile(previous.image_url);
  }

  return NextResponse.json(mapStudioGallery(row));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await queryOne<{ image_url: string }>(
    `select image_url from studio_gallery_images where id = $1`,
    [id]
  );
  await query(`delete from studio_gallery_images where id = $1`, [id]);
  if (row) await cleanupOrphanedFile(row.image_url);
  return NextResponse.json({ ok: true });
}
