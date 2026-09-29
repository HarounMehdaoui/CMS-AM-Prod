import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { mapCircleTicker, type CircleTickerRow } from "@/lib/entities";
import { CircleTickerForm } from "@/components/admin/circle-ticker-form";

export const dynamic = "force-dynamic";

export default async function EditCircleTickerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await queryOne<CircleTickerRow>(
    `select * from circle_ticker_images where id = $1`,
    [id]
  );
  if (!row) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit ticker image</h1>
      <CircleTickerForm mode="edit" initial={mapCircleTicker(row)} />
    </div>
  );
}
