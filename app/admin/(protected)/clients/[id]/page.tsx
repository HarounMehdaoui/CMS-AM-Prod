import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { mapClient, type ClientRow } from "@/lib/entities";
import { ClientForm } from "@/components/admin/client-form";

export const dynamic = "force-dynamic";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await queryOne<ClientRow>(`select * from clients where id = $1`, [id]);
  if (!row) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit client</h1>
      <ClientForm mode="edit" initial={mapClient(row)} />
    </div>
  );
}
