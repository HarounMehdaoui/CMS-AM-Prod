"use client";

import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  className,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-[var(--color-accent)]" : "bg-[var(--color-omega-10)]",
        className
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
