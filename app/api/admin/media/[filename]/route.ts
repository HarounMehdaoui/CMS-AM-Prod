import { NextRequest, NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { BASELINE_URLS } from "@/lib/media-cleanup";
import { isUrlReferenced } from "@/lib/media-usage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Reject path traversal / anything that isn't a bare filename.
  if (filename.includes("/") || filename.includes("..") || filename === ".gitkeep") {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const base = (process.env.APP_BASE_URL ?? "").replace(/\/$/, "");
  const url = `${base}/uploads/${filename}`;

  if (BASELINE_URLS.has(url)) {
    return NextResponse.json(
      { error: "This image is part of the reset-to-defaults baseline and can't be deleted here." },
      { status: 400 }
    );
  }

  if (await isUrlReferenced(url)) {
    return NextResponse.json(
      { error: "This file is still in use by at least one record." },
      { status: 409 }
    );
  }

  try {
    await unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
