import { queryOne } from "@/lib/db";
import type { HeroMediaRow } from "@/lib/entities";
import { HeroMediaForm } from "@/components/admin/hero-media-form";

export const dynamic = "force-dynamic";

export default async function HeroMediaPage() {
  const row = await queryOne<HeroMediaRow>(`select * from hero_media where id = 1`);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Hero media</h1>
        <p className="text-sm text-neutral-500">
          The autoplaying background video on the homepage banner. There&apos;s only one.
        </p>
      </div>
      <HeroMediaForm initialVideoUrl={row?.video_url ?? null} />
    </div>
  );
}
