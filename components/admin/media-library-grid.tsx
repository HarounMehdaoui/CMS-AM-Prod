"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type MediaItem = {
  filename: string;
  url: string;
  sizeBytes: number;
  isBaseline: boolean;
  usages: { entity: string; id: string; field: string }[];
  orphaned: boolean;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isVideo(filename: string) {
  return /\.(mp4|webm|mov)$/i.test(filename);
}

export function MediaLibraryGrid({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Delete ${item.filename}? This can't be undone.`)) return;
    setBusy(item.filename);
    try {
      const res = await fetch(`/api/admin/media/${item.filename}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(null);
    }
  }

  if (items.length === 0) {
    return <p className="text-sm text-[var(--color-omega-60)]">No uploaded files yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.filename}
          className="space-y-2 rounded-[14px] border border-[var(--color-omega-10)] bg-[var(--color-alpha)] p-3"
        >
          {isVideo(item.filename) ? (
            <video src={item.url} className="h-24 w-full rounded object-cover" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.url} alt="" className="h-24 w-full rounded object-cover" />
          )}
          <p className="truncate text-xs text-[var(--color-omega-60)]" title={item.filename}>
            {item.filename}
          </p>
          <p className="text-xs text-[var(--color-omega-40)]">{formatSize(item.sizeBytes)}</p>
          {item.isBaseline && (
            <p className="text-xs font-medium text-blue-500">Default image — protected</p>
          )}
          {!item.isBaseline && item.usages.length > 0 && (
            <p className="text-xs text-[var(--color-omega-60)]">
              In use by {item.usages.length} record{item.usages.length === 1 ? "" : "s"}
            </p>
          )}
          {item.orphaned && (
            <>
              <p className="text-xs font-medium text-amber-600">Not used anywhere</p>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={busy === item.filename}
                onClick={() => handleDelete(item)}
                className="w-full"
              >
                {busy === item.filename ? "Deleting…" : "Delete"}
              </Button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
