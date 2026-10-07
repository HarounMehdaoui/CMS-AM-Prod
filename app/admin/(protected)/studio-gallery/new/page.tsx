import { StudioGalleryForm } from "@/components/admin/studio-gallery-form";

export default function NewStudioGalleryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Add gallery image</h1>
      <StudioGalleryForm mode="create" />
    </div>
  );
}
