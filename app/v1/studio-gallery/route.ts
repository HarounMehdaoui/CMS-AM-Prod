import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import {
  mapStudioGallery,
  studioGalleryOutputSchema,
  type StudioGalleryRow,
} from "@/lib/entities";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query<StudioGalleryRow>(
    `select * from studio_gallery_images order by "order" asc`
  );
  const data = z.array(studioGalleryOutputSchema).parse(rows.map(mapStudioGallery));
  return NextResponse.json(data);
}
