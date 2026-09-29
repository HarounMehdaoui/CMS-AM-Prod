import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { mapProject, projectOutputSchema, type ProjectRow } from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<ProjectRow>(
    `select * from projects where published = true order by "order" asc`
  );
  const data = z.array(projectOutputSchema).parse(rows.map(mapProject));
  return NextResponse.json(data);
}
