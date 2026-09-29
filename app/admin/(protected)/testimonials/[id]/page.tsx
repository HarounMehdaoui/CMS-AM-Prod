import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { mapTestimonial, type TestimonialRow } from "@/lib/entities";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await queryOne<TestimonialRow>(
    `select * from testimonials where id = $1`,
    [id]
  );
  if (!row) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit testimonial</h1>
      <TestimonialForm mode="edit" initial={mapTestimonial(row)} />
    </div>
  );
}
