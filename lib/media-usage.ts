import { query } from "@/lib/db";

export type MediaUsage = { entity: string; id: string; field: string };

/** Maps every image/video URL currently referenced by any record to where it's used. */
export async function getMediaUsageMap(): Promise<Map<string, MediaUsage[]>> {
  const map = new Map<string, MediaUsage[]>();
  const add = (url: string | null, entity: string, id: string, field: string) => {
    if (!url) return;
    const list = map.get(url) ?? [];
    list.push({ entity, id, field });
    map.set(url, list);
  };

  const projects = await query<{ id: string; media: string | null }>(
    `select id, media from projects`
  );
  projects.forEach((p) => add(p.media, "projects", p.id, "media"));

  const services = await query<{ id: string; image: string; icon: string }>(
    `select id, image, icon from services`
  );
  services.forEach((s) => {
    add(s.image, "services", s.id, "image");
    add(s.icon, "services", s.id, "icon");
  });

  const testimonials = await query<{ id: string; avatar: string }>(
    `select id, avatar from testimonials`
  );
  testimonials.forEach((t) => add(t.avatar, "testimonials", t.id, "avatar"));

  const clients = await query<{ id: string; image: string }>(
    `select id, image from clients`
  );
  clients.forEach((c) => add(c.image, "clients", c.id, "image"));

  const ticker = await query<{ id: string; image_url: string }>(
    `select id, image_url from circle_ticker_images`
  );
  ticker.forEach((t) => add(t.image_url, "circle-ticker", t.id, "imageUrl"));

  const hero = await query<{ id: number; video_url: string }>(
    `select id, video_url from hero_media`
  );
  hero.forEach((h) => add(h.video_url, "hero-media", "singleton", "videoUrl"));

  return map;
}

/** Lightweight existence check for a single URL, without building the full map. */
export async function isUrlReferenced(url: string): Promise<boolean> {
  const rows = await query<{ used: boolean }>(
    `select exists(select 1 from projects where media = $1) as used
     union all
     select exists(select 1 from services where image = $1 or icon = $1)
     union all
     select exists(select 1 from testimonials where avatar = $1)
     union all
     select exists(select 1 from clients where image = $1)
     union all
     select exists(select 1 from circle_ticker_images where image_url = $1)
     union all
     select exists(select 1 from hero_media where video_url = $1)`,
    [url]
  );
  return rows.some((r) => r.used);
}
