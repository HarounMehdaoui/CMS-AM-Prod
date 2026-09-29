import { TestimonialForm } from "@/components/admin/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New testimonial</h1>
      <TestimonialForm mode="create" />
    </div>
  );
}
