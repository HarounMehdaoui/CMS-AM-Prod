import { getMediaLibrary } from "@/lib/media-library";
import { MediaLibraryGrid } from "@/components/admin/media-library-grid";

export const dynamic = "force-dynamic";

export default async function MediaLibraryPage() {
  const items = await getMediaLibrary();
  const orphanedCount = items.filter((i) => i.orphaned).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Media library</h1>
        <p className="text-sm text-[var(--color-omega-60)]">
          Every file ever uploaded through this CMS. Blue = part of the reset-to-defaults
          baseline (never deletable here). Amber = not used by any record — safe to remove.
          {orphanedCount > 0 && ` ${orphanedCount} file${orphanedCount === 1 ? "" : "s"} unused.`}
        </p>
      </div>
      <MediaLibraryGrid items={items} />
    </div>
  );
}
