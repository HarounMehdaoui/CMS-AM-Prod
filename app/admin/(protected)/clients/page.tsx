import Link from "next/link";
import { query } from "@/lib/db";
import { mapClient, type ClientRow } from "@/lib/entities";
import { EntityTable } from "@/components/admin/entity-table";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const rows = await query<ClientRow>(
    `select * from clients order by "order" asc, created_at asc`
  );
  const clients = rows.map(mapClient);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clients</h1>
        <Link href="/admin/clients/new" className={buttonVariants()}>
          New client
        </Link>
      </div>
      <EntityTable
        rows={clients}
        apiBase="/api/admin/clients"
        editBase="/admin/clients"
        hasPublished={false}
        columns={[
          { header: "Name", key: "name" },
          { header: "Logo", key: "image", type: "image" },
        ]}
      />
    </div>
  );
}
