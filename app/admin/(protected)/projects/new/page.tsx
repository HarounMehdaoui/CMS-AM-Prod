import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New project</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
