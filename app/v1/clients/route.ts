import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { mapClient, clientOutputSchema, type ClientRow } from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<ClientRow>(
    `select * from clients order by "order" asc`
  );
  const data = z.array(clientOutputSchema).parse(rows.map(mapClient));
  return NextResponse.json(data);
}
