"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { extractErrorMessage } from "@/lib/format-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/admin/file-upload";
import { slugify } from "@/lib/slugify";
import type { ClientOutput } from "@/lib/entities";

export function ClientForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: ClientOutput;
}) {
  const router = useRouter();
  const [id, setId] = useState(initial?.id ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [name, setName] = useState(initial?.name ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setId(slugify(value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body = {
        ...(mode === "create" ? { id } : {}),
        name,
        image,
        order: Number(order),
      };
      const res = await fetch(
        mode === "create" ? "/api/admin/clients" : `/api/admin/clients/${initial!.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(data));
      router.push("/admin/clients");
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
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
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
        {mode === "create" && !id && name.trim() !== "" && (
          <p className="mt-1 text-xs text-amber-600">
            Couldn&apos;t generate a slug from that name (it may not contain any
            a–z/0–9 characters). Type one in manually before saving.
          </p>
        )}
      </div>
      <div>
        <Label>Logo</Label>
        <FileUpload value={image} onChange={setImage} accept="image/*" kind="image" />
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
        {submitting ? "Saving…" : mode === "create" ? "Create client" : "Save changes"}
      </Button>
    </form>
  );
}
