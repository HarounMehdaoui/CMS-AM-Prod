import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { mapProject, projectCreateSchema, type ProjectRow } from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<ProjectRow>(
    `select * from projects order by "order" asc, created_at asc`
  );
  return NextResponse.json(rows.map(mapProject));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = projectCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, title, description, category, media, videoEmbed, published, order } =
    parsed.data;

  const existing = await queryOne(`select id from projects where id = $1`, [id]);
  if (existing) {
    return NextResponse.json(
      { error: "A project with this id already exists" },
      { status: 409 }
    );
  }

  const row = await queryOne<ProjectRow>(
    `insert into projects (id, title, description, category, media, video_embed, published, "order")
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     returning *`,
    [id, title, description, category, media ?? null, videoEmbed ?? null, published, order]
  );

  return NextResponse.json(mapProject(row!), { status: 201 });
}
