import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-[8px] border border-[var(--color-omega-10)] bg-[var(--color-alpha)] px-3 py-2 text-sm text-white placeholder:text-[var(--color-omega-40)] outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
