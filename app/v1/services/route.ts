import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { mapService, serviceOutputSchema, type ServiceRow } from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<ServiceRow>(
    `select * from services where published = true order by "order" asc`
  );
  const data = z.array(serviceOutputSchema).parse(rows.map(mapService));
  return NextResponse.json(data);
}
