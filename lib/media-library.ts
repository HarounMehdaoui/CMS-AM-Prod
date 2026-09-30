import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { BASELINE_URLS } from "@/lib/media-cleanup";
import { getMediaUsageMap, type MediaUsage } from "@/lib/media-usage";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export type MediaLibraryItem = {
  filename: string;
  url: string;
  sizeBytes: number;
  modifiedAt: string;
  isBaseline: boolean;
  usages: MediaUsage[];
  orphaned: boolean;
};

export async function getMediaLibrary(): Promise<MediaLibraryItem[]> {
  const filenames = (await readdir(UPLOAD_DIR)).filter((f) => f !== ".gitkeep");
  const usageMap = await getMediaUsageMap();
  const base = (process.env.APP_BASE_URL ?? "").replace(/\/$/, "");

  const items = await Promise.all(
    filenames.map(async (filename) => {
      const url = `${base}/uploads/${filename}`;
      const info = await stat(path.join(UPLOAD_DIR, filename));
      const usages = usageMap.get(url) ?? [];
      const isBaseline = BASELINE_URLS.has(url);
      return {
        filename,
        url,
        sizeBytes: info.size,
        modifiedAt: info.mtime.toISOString(),
        isBaseline,
        usages,
        orphaned: usages.length === 0 && !isBaseline,
      };
    })
  );

  items.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
  return items;
}
