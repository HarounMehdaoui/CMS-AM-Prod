import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { buildUpdateSet } from "@/lib/crud";
import { cleanupOrphanedFile } from "@/lib/media-cleanup";
import {
  mapTestimonial,
  testimonialUpdateSchema,
  type TestimonialRow,
} from "@/lib/entities";

export const dynamic = "force-dynamic";

const COLUMN_MAP: Record<string, string> = {
  quote: "quote",
  name: "name",
  company: "company",
  avatar: "avatar",
  published: "published",
  order: '"order"',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await queryOne<TestimonialRow>(
    `select * from testimonials where id = $1`,
    [id]
  );
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mapTestimonial(row));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = testimonialUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { setClauses, values, nextIndex } = buildUpdateSet(COLUMN_MAP, parsed.data);
  if (setClauses.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const previous =
    "avatar" in parsed.data
      ? await queryOne<{ avatar: string }>(`select avatar from testimonials where id = $1`, [id])
      : null;

  setClauses.push(`updated_at = now()`);
  values.push(id);

  const row = await queryOne<TestimonialRow>(
    `update testimonials set ${setClauses.join(", ")} where id = $${nextIndex} returning *`,
    values
  );
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (previous && previous.avatar !== row.avatar) {
    await cleanupOrphanedFile(previous.avatar);
  }

  return NextResponse.json(mapTestimonial(row));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await queryOne<{ avatar: string }>(`select avatar from testimonials where id = $1`, [id]);
  await query(`delete from testimonials where id = $1`, [id]);
  if (row) await cleanupOrphanedFile(row.avatar);
  return NextResponse.json({ ok: true });
}
