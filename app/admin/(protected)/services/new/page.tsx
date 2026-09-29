import { ServiceForm } from "@/components/admin/service-form";

export default function NewServicePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New service</h1>
      <ServiceForm mode="create" />
    </div>
  );
}
