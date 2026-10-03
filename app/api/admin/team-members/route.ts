import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { mapTeamMember, teamMemberCreateSchema, type TeamMemberRow } from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<TeamMemberRow>(
    `select * from team_members order by "order" asc, created_at asc`
  );
  return NextResponse.json(rows.map(mapTeamMember));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = teamMemberCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, name, role, bio, photo, published, order } = parsed.data;

  const existing = await queryOne(`select id from team_members where id = $1`, [id]);
  if (existing) {
    return NextResponse.json(
      { error: "A team member with this id already exists" },
      { status: 409 }
    );
  }

  const row = await queryOne<TeamMemberRow>(
    `insert into team_members (id, name, role, bio, photo, published, "order")
     values ($1, $2, $3, $4, $5, $6, $7)
     returning *`,
    [id, name, role, bio, photo, published, order]
  );

  return NextResponse.json(mapTeamMember(row!), { status: 201 });
}
