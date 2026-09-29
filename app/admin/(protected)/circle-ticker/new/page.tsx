import { CircleTickerForm } from "@/components/admin/circle-ticker-form";

export default function NewCircleTickerPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Add ticker image</h1>
      <CircleTickerForm mode="create" />
    </div>
  );
}
