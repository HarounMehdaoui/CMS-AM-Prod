import { unlink } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_IMAGES } from "@/lib/default-images";
import { isUrlReferenced } from "@/lib/media-usage";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * URLs that `POST /api/admin/reset-images` restores fields to. These files
 * must never be deleted, even if no record currently points at them —
 * otherwise "reset to defaults" would restore a broken link.
 */
export const BASELINE_URLS = new Set<string>([
  ...Object.values(DEFAULT_IMAGES.projects).map((p) => p.media),
  ...Object.values(DEFAULT_IMAGES.services).flatMap((s) => [s.image, s.icon]),
  ...Object.values(DEFAULT_IMAGES.testimonials).map((t) => t.avatar),
  ...Object.values(DEFAULT_IMAGES.clients).map((c) => c.image),
  ...Object.values(DEFAULT_IMAGES.circleTicker).map((t) => t.imageUrl),
  DEFAULT_IMAGES.heroMedia.videoUrl,
]);

function isLocalUpload(url: string): boolean {
  return url.includes("/uploads/");
}

export function urlToFilename(url: string): string | null {
  const filename = url.split("/uploads/").pop();
  return filename || null;
}

/**
 * Deletes a previously-uploaded file from disk if it's no longer referenced
 * by any record and isn't part of the reset-images baseline. Call this AFTER
 * the DB write that stopped pointing at it (an update or a delete), passing
 * the OLD url that was just replaced or removed. Safe no-op for external
 * URLs, missing files, baseline images, or files still in use elsewhere —
 * never throws, since a failed cleanup shouldn't fail the write that
 * triggered it.
 */
export async function cleanupOrphanedFile(url: string | null | undefined): Promise<void> {
  try {
    if (!url || !isLocalUpload(url)) return;
    if (BASELINE_URLS.has(url)) return;
    if (await isUrlReferenced(url)) return;

    const filename = urlToFilename(url);
    if (!filename) return;

    await unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // Best-effort — a missing file or a transient fs error here shouldn't
    // surface as an error on the request that triggered the cleanup.
  }
}
