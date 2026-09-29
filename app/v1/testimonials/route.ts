import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import {
  mapTestimonial,
  testimonialOutputSchema,
  type TestimonialRow,
} from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<TestimonialRow>(
    `select * from testimonials where published = true order by "order" asc`
  );
  const data = z.array(testimonialOutputSchema).parse(rows.map(mapTestimonial));
  return NextResponse.json(data);
}
