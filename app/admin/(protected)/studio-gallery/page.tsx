import Link from "next/link";
import { query } from "@/lib/db";
import { mapStudioGallery, type StudioGalleryRow } from "@/lib/entities";
import { EntityTable } from "@/components/admin/entity-table";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function StudioGalleryPage() {
  const rows = await query<StudioGalleryRow>(
    `select * from studio_gallery_images order by "order" asc, created_at asc`
  );
  const images = rows.map(mapStudioGallery);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Studio gallery</h1>
        <Link href="/admin/studio-gallery/new" className={buttonVariants()}>
          Add image
        </Link>
      </div>
      <EntityTable
        rows={images}
        apiBase="/api/admin/studio-gallery"
        editBase="/admin/studio-gallery"
        hasPublished={false}
        columns={[
          { header: "Image", key: "imageUrl", type: "image" },
          { header: "Caption", key: "caption", type: "text" },
        ]}
      />
    </div>
  );
}
