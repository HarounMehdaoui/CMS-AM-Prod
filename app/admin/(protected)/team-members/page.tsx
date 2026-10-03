import Link from "next/link";
import { query } from "@/lib/db";
import { mapTeamMember, type TeamMemberRow } from "@/lib/entities";
import { EntityTable } from "@/components/admin/entity-table";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function TeamMembersPage() {
  const rows = await query<TeamMemberRow>(
    `select * from team_members order by "order" asc, created_at asc`
  );
  const teamMembers = rows.map(mapTeamMember);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Team members</h1>
        <Link href="/admin/team-members/new" className={buttonVariants()}>
          New team member
        </Link>
      </div>
      <EntityTable
        rows={teamMembers}
        apiBase="/api/admin/team-members"
        editBase="/admin/team-members"
        columns={[
          { header: "Photo", key: "photo", type: "image" },
          { header: "Name", key: "name" },
          { header: "Role", key: "role" },
        ]}
      />
    </div>
  );
}
