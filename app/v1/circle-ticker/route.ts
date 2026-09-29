import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import {
  mapCircleTicker,
  circleTickerOutputSchema,
  type CircleTickerRow,
} from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<CircleTickerRow>(
    `select * from circle_ticker_images order by "order" asc`
  );
  const data = z.array(circleTickerOutputSchema).parse(rows.map(mapCircleTicker));
  return NextResponse.json(data);
}
