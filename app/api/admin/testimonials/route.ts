import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import {
  mapTestimonial,
  testimonialCreateSchema,
  type TestimonialRow,
} from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<TestimonialRow>(
    `select * from testimonials order by "order" asc, created_at asc`
  );
  return NextResponse.json(rows.map(mapTestimonial));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = testimonialCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, quote, name, company, avatar, published, order } = parsed.data;

  const existing = await queryOne(`select id from testimonials where id = $1`, [id]);
  if (existing) {
    return NextResponse.json(
      { error: "A testimonial with this id already exists" },
      { status: 409 }
    );
  }

  const row = await queryOne<TestimonialRow>(
    `insert into testimonials (id, quote, name, company, avatar, published, "order")
     values ($1, $2, $3, $4, $5, $6, $7)
     returning *`,
    [id, quote, name, company, avatar, published, order]
  );

  return NextResponse.json(mapTestimonial(row!), { status: 201 });
}
