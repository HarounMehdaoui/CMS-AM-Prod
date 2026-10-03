import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-[8px] border border-[var(--color-omega-10)] bg-[var(--color-alpha)] px-3 text-sm text-white placeholder:text-[var(--color-omega-40)] outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
