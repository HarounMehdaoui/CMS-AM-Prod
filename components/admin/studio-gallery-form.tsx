"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { extractErrorMessage } from "@/lib/format-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/admin/file-upload";
import type { StudioGalleryOutput } from "@/lib/entities";

export function StudioGalleryForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: StudioGalleryOutput;
}) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body =
        mode === "create"
          ? {
              id: `studio-${crypto.randomUUID().slice(0, 8)}`,
              imageUrl,
              caption: caption || null,
              order: Number(order),
            }
          : { imageUrl, caption: caption || null, order: Number(order) };
      const res = await fetch(
        mode === "create"
          ? "/api/admin/studio-gallery"
          : `/api/admin/studio-gallery/${initial!.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(data));
      router.push("/admin/studio-gallery");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-4 rounded-[14px] border border-[var(--color-omega-10)] bg-[var(--color-alpha)] p-6"
    >
      <div>
        <Label>Image</Label>
        <FileUpload value={imageUrl} onChange={setImageUrl} accept="image/*" kind="image" />
      </div>
      <div>
        <Label htmlFor="caption">Caption (optional)</Label>
        <Input
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="e.g. Our gear"
        />
      </div>
      <div>
        <Label htmlFor="order">Order</Label>
        <Input
          id="order"
          type="number"
          className="w-32"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={submitting || !imageUrl}>
        {submitting ? "Saving…" : mode === "create" ? "Add image" : "Save changes"}
      </Button>
    </form>
  );
}
