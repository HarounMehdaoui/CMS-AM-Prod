import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { mapTeamMember, teamMemberOutputSchema, type TeamMemberRow } from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<TeamMemberRow>(
    `select * from team_members where published = true order by "order" asc`
  );
  const data = z.array(teamMemberOutputSchema).parse(rows.map(mapTeamMember));
  return NextResponse.json(data);
}
