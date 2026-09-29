import Link from "next/link";
import { query } from "@/lib/db";
import { mapCircleTicker, type CircleTickerRow } from "@/lib/entities";
import { EntityTable } from "@/components/admin/entity-table";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CircleTickerPage() {
  const rows = await query<CircleTickerRow>(
    `select * from circle_ticker_images order by "order" asc, created_at asc`
  );
  const images = rows.map(mapCircleTicker);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Circle ticker images</h1>
        <Link href="/admin/circle-ticker/new" className={buttonVariants()}>
          Add image
        </Link>
      </div>
      <EntityTable
        rows={images}
        apiBase="/api/admin/circle-ticker"
        editBase="/admin/circle-ticker"
        hasPublished={false}
        columns={[{ header: "Image", key: "imageUrl", type: "image" }]}
      />
    </div>
  );
}
