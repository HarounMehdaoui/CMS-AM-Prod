import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { mapService, type ServiceRow } from "@/lib/entities";
import { ServiceForm } from "@/components/admin/service-form";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await queryOne<ServiceRow>(`select * from services where id = $1`, [id]);
  if (!row) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit service</h1>
      <ServiceForm mode="edit" initial={mapService(row)} />
    </div>
  );
}
