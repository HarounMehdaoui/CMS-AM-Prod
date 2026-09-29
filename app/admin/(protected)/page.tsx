import Link from "next/link";
import { queryOne } from "@/lib/db";
import { ResetImagesButton } from "@/components/admin/reset-images-button";

export const dynamic = "force-dynamic";

type Counts = { total: string; published: string };

async function counts(table: string, hasPublished = true) {
  if (!hasPublished) {
    const row = await queryOne<{ total: string }>(
      `select count(*)::text as total from ${table}`
    );
    return { total: Number(row?.total ?? 0), published: Number(row?.total ?? 0) };
  }
  const row = await queryOne<Counts>(
    `select count(*)::text as total, count(*) filter (where published) ::text as published from ${table}`
  );
  return { total: Number(row?.total ?? 0), published: Number(row?.published ?? 0) };
}

export default async function DashboardPage() {
  const [projects, services, testimonials, clients, ticker, hero] = await Promise.all([
    counts("projects"),
    counts("services"),
    counts("testimonials"),
    counts("clients", false),
    counts("circle_ticker_images", false),
    queryOne(`select 1 from hero_media where id = 1`),
  ]);

  const entities: { label: string; href: string; total: number; published: number; togglable: boolean }[] = [
    { label: "Projects", href: "/admin/projects", ...projects, togglable: true },
    { label: "Services", href: "/admin/services", ...services, togglable: true },
    { label: "Testimonials", href: "/admin/testimonials", ...testimonials, togglable: true },
    { label: "Clients", href: "/admin/clients", ...clients, togglable: false },
    { label: "Circle ticker images", href: "/admin/circle-ticker", ...ticker, togglable: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <ResetImagesButton />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity) => (
          <Link
            key={entity.href}
            href={entity.href}
            className="rounded-lg border border-neutral-200 p-4 hover:border-neutral-400"
          >
            <p className="text-sm text-neutral-500">{entity.label}</p>
            <p className="mt-1 text-2xl font-semibold">{entity.total}</p>
            {entity.togglable && (
              <p className="mt-1 text-xs text-neutral-500">
                {entity.published} published, {entity.total - entity.published} draft
              </p>
            )}
          </Link>
        ))}
        <Link
          href="/admin/hero-media"
          className="rounded-lg border border-neutral-200 p-4 hover:border-neutral-400"
        >
          <p className="text-sm text-neutral-500">Hero media</p>
          <p className="mt-1 text-2xl font-semibold">{hero ? "Configured" : "Not set"}</p>
        </Link>
      </div>
    </div>
  );
}
