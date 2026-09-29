import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { mapClient, clientCreateSchema, type ClientRow } from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<ClientRow>(
    `select * from clients order by "order" asc, created_at asc`
  );
  return NextResponse.json(rows.map(mapClient));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = clientCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, name, image, order } = parsed.data;

  const existing = await queryOne(`select id from clients where id = $1`, [id]);
  if (existing) {
    return NextResponse.json(
      { error: "A client with this id already exists" },
      { status: 409 }
    );
  }

  const row = await queryOne<ClientRow>(
    `insert into clients (id, name, image, "order")
     values ($1, $2, $3, $4)
     returning *`,
    [id, name, image, order]
  );

  return NextResponse.json(mapClient(row!), { status: 201 });
}
