import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { mapStudioGallery, type StudioGalleryRow } from "@/lib/entities";
import { StudioGalleryForm } from "@/components/admin/studio-gallery-form";

export const dynamic = "force-dynamic";

export default async function EditStudioGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await queryOne<StudioGalleryRow>(
    `select * from studio_gallery_images where id = $1`,
    [id]
  );
  if (!row) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit gallery image</h1>
      <StudioGalleryForm mode="edit" initial={mapStudioGallery(row)} />
    </div>
  );
}
