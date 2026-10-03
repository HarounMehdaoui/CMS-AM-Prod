import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { buildUpdateSet } from "@/lib/crud";
import { cleanupOrphanedFile } from "@/lib/media-cleanup";
import {
  mapTeamMember,
  teamMemberUpdateSchema,
  type TeamMemberRow,
} from "@/lib/entities";

export const dynamic = "force-dynamic";

const COLUMN_MAP: Record<string, string> = {
  name: "name",
  role: "role",
  bio: "bio",
  photo: "photo",
  published: "published",
  order: '"order"',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await queryOne<TeamMemberRow>(
    `select * from team_members where id = $1`,
    [id]
  );
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mapTeamMember(row));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = teamMemberUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { setClauses, values, nextIndex } = buildUpdateSet(COLUMN_MAP, parsed.data);
  if (setClauses.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const previous =
    "photo" in parsed.data
      ? await queryOne<{ photo: string }>(`select photo from team_members where id = $1`, [id])
      : null;

  setClauses.push(`updated_at = now()`);
  values.push(id);

  const row = await queryOne<TeamMemberRow>(
    `update team_members set ${setClauses.join(", ")} where id = $${nextIndex} returning *`,
    values
  );
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (previous && previous.photo !== row.photo) {
    await cleanupOrphanedFile(previous.photo);
  }

  return NextResponse.json(mapTeamMember(row));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await queryOne<{ photo: string }>(`select photo from team_members where id = $1`, [id]);
  await query(`delete from team_members where id = $1`, [id]);
  if (row) await cleanupOrphanedFile(row.photo);
  return NextResponse.json({ ok: true });
}
