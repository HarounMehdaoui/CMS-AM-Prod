import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "svg",
  "mp4",
  "webm",
  "mov",
]);

export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024; // 200MB, generous for hero video

function extensionFromFilename(filename: string): string {
  const ext = path.extname(filename).replace(".", "").toLowerCase();
  return ext;
}

export async function saveUploadedFile(file: File): Promise<{ url: string }> {
  const ext = extensionFromFilename(file.name);
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(`Unsupported file type: .${ext || "unknown"}`);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File is too large");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${randomUUID()}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const base = (process.env.APP_BASE_URL ?? "").replace(/\/$/, "");
  const url = `${base}/uploads/${filename}`;
  return { url };
}
