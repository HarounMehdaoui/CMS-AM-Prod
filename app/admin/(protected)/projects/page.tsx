import Link from "next/link";
import { query } from "@/lib/db";
import { mapProject, type ProjectRow } from "@/lib/entities";
import { EntityTable } from "@/components/admin/entity-table";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const rows = await query<ProjectRow>(
    `select * from projects order by "order" asc, created_at asc`
  );
  const projects = rows.map(mapProject);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Projects</h1>
        <Link href="/admin/projects/new" className={buttonVariants()}>
          New project
        </Link>
      </div>
      <EntityTable
        rows={projects}
        apiBase="/api/admin/projects"
        editBase="/admin/projects"
        columns={[
          { header: "Title", key: "title" },
          { header: "Category", key: "category" },
        ]}
      />
    </div>
  );
}
