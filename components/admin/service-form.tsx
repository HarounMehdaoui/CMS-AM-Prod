"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { extractErrorMessage } from "@/lib/format-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/admin/file-upload";
import { TagInput } from "@/components/admin/tag-input";
import { slugify } from "@/lib/slugify";
import type { ServiceOutput } from "@/lib/entities";

export function ServiceForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: ServiceOutput;
}) {
  const router = useRouter();
  const [id, setId] = useState(initial?.id ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [image, setImage] = useState(initial?.image ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "");
  const [layout, setLayout] = useState<"wide" | "tall">(initial?.layout ?? "wide");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setId(slugify(value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body = {
        ...(mode === "create" ? { id } : {}),
        title,
        description,
        tags,
        image,
        icon,
        layout,
        published,
        order: Number(order),
      };
      const res = await fetch(
        mode === "create" ? "/api/admin/services" : `/api/admin/services/${initial!.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(data));
      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="slug">Slug (id)</Label>
        <Input
          id="slug"
          required
          disabled={mode === "edit"}
          value={id}
          onChange={(e) => {
            setSlugTouched(true);
            setId(slugify(e.target.value));
          }}
        />
        {mode === "create" && !id && title.trim() !== "" && (
          <p className="mt-1 text-xs text-amber-600">
            Couldn&apos;t generate a slug from that title (it may not contain any
            a–z/0–9 characters). Type one in manually before saving.
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label>Tags</Label>
        <TagInput value={tags} onChange={setTags} />
      </div>
      <div>
        <Label>Image</Label>
        <FileUpload value={image} onChange={setImage} accept="image/*" kind="image" />
      </div>
      <div>
        <Label>Icon</Label>
        <FileUpload value={icon} onChange={setIcon} accept="image/*" kind="image" />
      </div>
      <div>
        <Label htmlFor="layout">Layout</Label>
        <select
          id="layout"
          className="h-9 w-40 rounded-md border border-neutral-300 bg-white px-3 text-sm"
          value={layout}
          onChange={(e) => setLayout(e.target.value as "wide" | "tall")}
        >
          <option value="wide">wide</option>
          <option value="tall">tall</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={published} onCheckedChange={setPublished} />
        <Label className="mb-0">Published</Label>
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
      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : mode === "create" ? "Create service" : "Save changes"}
      </Button>
    </form>
  );
}
