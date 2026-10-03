"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { extractErrorMessage } from "@/lib/format-error";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/admin/file-upload";

export function HeroMediaForm({ initialVideoUrl }: { initialVideoUrl: string | null }) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/hero-media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(data));
      setSuccess(true);
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
        <Label>Hero background video</Label>
        <FileUpload
          value={videoUrl}
          onChange={setVideoUrl}
          accept="video/*"
          kind="video"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Saved.</p>}
      <Button type="submit" disabled={submitting || !videoUrl}>
        {submitting ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
