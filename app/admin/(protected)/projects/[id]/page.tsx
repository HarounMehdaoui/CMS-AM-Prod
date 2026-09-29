import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { mapProject, type ProjectRow } from "@/lib/entities";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await queryOne<ProjectRow>(`select * from projects where id = $1`, [id]);
  if (!row) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit project</h1>
      <ProjectForm mode="edit" initial={mapProject(row)} />
    </div>
  );
}
