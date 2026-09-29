import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { mapService, serviceCreateSchema, type ServiceRow } from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<ServiceRow>(
    `select * from services order by "order" asc, created_at asc`
  );
  return NextResponse.json(rows.map(mapService));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = serviceCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, title, description, tags, image, icon, layout, published, order } =
    parsed.data;

  const existing = await queryOne(`select id from services where id = $1`, [id]);
  if (existing) {
    return NextResponse.json(
      { error: "A service with this id already exists" },
      { status: 409 }
    );
  }

  const row = await queryOne<ServiceRow>(
    `insert into services (id, title, description, tags, image, icon, layout, published, "order")
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     returning *`,
    [id, title, description, tags, image, icon, layout, published, order]
  );

  return NextResponse.json(mapService(row!), { status: 201 });
}
