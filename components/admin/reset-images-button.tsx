"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ResetImagesButton() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleReset() {
    if (
      !confirm(
        "Reset all cover images, avatars, logos, ticker images, and the hero video back to their original defaults? This can't be undone."
      )
    ) {
      return;
    }
    setStatus("working");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/reset-images", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Reset failed");
      setStatus("done");
      setMessage(`Restored ${data.restored} image field${data.restored === 1 ? "" : "s"}.`);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Reset failed");
    }
  }

  return (
    <div className="space-y-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={status === "working"}
        onClick={handleReset}
      >
        {status === "working" ? "Resetting…" : "Reset images to defaults"}
      </Button>
      {message && (
        <p className={status === "error" ? "text-xs text-red-600" : "text-xs text-neutral-500"}>
          {message}
        </p>
      )}
    </div>
  );
}
