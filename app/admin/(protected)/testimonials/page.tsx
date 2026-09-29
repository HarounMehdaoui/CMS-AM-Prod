import Link from "next/link";
import { query } from "@/lib/db";
import { mapTestimonial, type TestimonialRow } from "@/lib/entities";
import { EntityTable } from "@/components/admin/entity-table";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const rows = await query<TestimonialRow>(
    `select * from testimonials order by "order" asc, created_at asc`
  );
  const testimonials = rows.map(mapTestimonial);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Testimonials</h1>
        <Link href="/admin/testimonials/new" className={buttonVariants()}>
          New testimonial
        </Link>
      </div>
      <EntityTable
        rows={testimonials}
        apiBase="/api/admin/testimonials"
        editBase="/admin/testimonials"
        columns={[
          { header: "Name", key: "name" },
          { header: "Company", key: "company" },
        ]}
      />
    </div>
  );
}
