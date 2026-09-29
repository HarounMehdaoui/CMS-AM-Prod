import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import {
  mapCircleTicker,
  circleTickerCreateSchema,
  type CircleTickerRow,
} from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<CircleTickerRow>(
    `select * from circle_ticker_images order by "order" asc, created_at asc`
  );
  return NextResponse.json(rows.map(mapCircleTicker));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = circleTickerCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, imageUrl, order } = parsed.data;

  const existing = await queryOne(
    `select id from circle_ticker_images where id = $1`,
    [id]
  );
  if (existing) {
    return NextResponse.json(
      { error: "A ticker image with this id already exists" },
      { status: 409 }
    );
  }

  const row = await queryOne<CircleTickerRow>(
    `insert into circle_ticker_images (id, image_url, "order")
     values ($1, $2, $3)
     returning *`,
    [id, imageUrl, order]
  );

  return NextResponse.json(mapCircleTicker(row!), { status: 201 });
}
