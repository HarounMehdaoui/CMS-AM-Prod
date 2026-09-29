import Link from "next/link";
import { query } from "@/lib/db";
import { mapService, type ServiceRow } from "@/lib/entities";
import { EntityTable } from "@/components/admin/entity-table";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const rows = await query<ServiceRow>(
    `select * from services order by "order" asc, created_at asc`
  );
  const services = rows.map(mapService);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Services</h1>
        <Link href="/admin/services/new" className={buttonVariants()}>
          New service
        </Link>
      </div>
      <EntityTable
        rows={services}
        apiBase="/api/admin/services"
        editBase="/admin/services"
        columns={[
          { header: "Title", key: "title" },
          { header: "Layout", key: "layout" },
        ]}
      />
    </div>
  );
}
