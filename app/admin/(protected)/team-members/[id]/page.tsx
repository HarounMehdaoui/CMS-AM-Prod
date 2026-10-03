import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { mapTeamMember, type TeamMemberRow } from "@/lib/entities";
import { TeamMemberForm } from "@/components/admin/team-member-form";

export const dynamic = "force-dynamic";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await queryOne<TeamMemberRow>(
    `select * from team_members where id = $1`,
    [id]
  );
  if (!row) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit team member</h1>
      <TeamMemberForm mode="edit" initial={mapTeamMember(row)} />
    </div>
  );
}
