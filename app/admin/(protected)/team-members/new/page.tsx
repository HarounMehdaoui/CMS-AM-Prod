import { TeamMemberForm } from "@/components/admin/team-member-form";

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New team member</h1>
      <TeamMemberForm mode="create" />
    </div>
  );
}
