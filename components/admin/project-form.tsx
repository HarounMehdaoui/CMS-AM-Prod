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
import { slugify } from "@/lib/slugify";
import type { ProjectOutput } from "@/lib/entities";

export function ProjectForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: ProjectOutput;
}) {
  const router = useRouter();
  const [id, setId] = useState(initial?.id ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [media, setMedia] = useState(initial?.media ?? "");
  const [videoEmbed, setVideoEmbed] = useState(initial?.videoEmbed ?? "");
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
        category,
        media: media || null,
        videoEmbed: videoEmbed || null,
        published,
        order: Number(order),
      };
      const res = await fetch(
        mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${initial!.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(data));
      router.push("/admin/projects");
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
        {mode === "edit" && (
          <p className="mt-1 text-xs text-neutral-500">
            The slug becomes this project&apos;s live URL and can&apos;t be changed after
            creation. Delete and recreate the project if it needs a different one.
          </p>
        )}
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
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div>
        <Label>Cover image</Label>
        <FileUpload value={media} onChange={setMedia} accept="image/*" kind="image" />
      </div>
      <div>
        <Label htmlFor="videoEmbed">Video embed</Label>
        <Textarea
          id="videoEmbed"
          rows={5}
          className="font-mono text-xs"
          placeholder="Paste the full embed code from Vimeo's Share → Embed option, e.g. <iframe src=&quot;https://player.vimeo.com/video/...&quot; ...></iframe>"
          value={videoEmbed}
          onChange={(e) => setVideoEmbed(e.target.value)}
        />
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
        {submitting ? "Saving…" : mode === "create" ? "Create project" : "Save changes"}
      </Button>
    </form>
  );
}
