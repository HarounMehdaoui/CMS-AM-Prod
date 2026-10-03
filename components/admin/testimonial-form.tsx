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
import type { TestimonialOutput } from "@/lib/entities";

export function TestimonialForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: TestimonialOutput;
}) {
  const router = useRouter();
  const [id, setId] = useState(initial?.id ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [avatar, setAvatar] = useState(initial?.avatar ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
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
        quote,
        name,
        company,
        avatar,
        published,
        order: Number(order),
      };
      const res = await fetch(
        mode === "create"
          ? "/api/admin/testimonials"
          : `/api/admin/testimonials/${initial!.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(data));
      router.push("/admin/testimonials");
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
        <Label htmlFor="quote">Quote</Label>
        <Textarea
          id="quote"
          required
          rows={4}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />
      </div>
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
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div>
        <Label>Avatar</Label>
        <FileUpload value={avatar} onChange={setAvatar} accept="image/*" kind="image" />
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
        {submitting ? "Saving…" : mode === "create" ? "Create testimonial" : "Save changes"}
      </Button>
    </form>
  );
}
