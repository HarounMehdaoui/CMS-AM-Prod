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
import type { TeamMemberOutput } from "@/lib/entities";

export function TeamMemberForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: TeamMemberOutput;
}) {
  const router = useRouter();
  const [id, setId] = useState(initial?.id ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [photo, setPhoto] = useState(initial?.photo ?? "");
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
        name,
        role,
        bio,
        photo,
        published,
        order: Number(order),
      };
      const res = await fetch(
        mode === "create"
          ? "/api/admin/team-members"
          : `/api/admin/team-members/${initial!.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(data));
      router.push("/admin/team-members");
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
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          required
          placeholder="Creative Director"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          required
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <div>
        <Label>Photo</Label>
        <FileUpload value={photo} onChange={setPhoto} accept="image/*" kind="image" />
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
        {submitting ? "Saving…" : mode === "create" ? "Create team member" : "Save changes"}
      </Button>
    </form>
  );
}
