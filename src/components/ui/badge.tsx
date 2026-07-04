import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "eyebrow" | "lime" | "outline";
}

export function Badge({ className, variant = "outline", ...props }: BadgeProps) {
  const styles = {
    eyebrow: "border border-border bg-white/60 text-ink",
    lime: "bg-lime text-ink",
    outline: "border border-border bg-white text-gray-body",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-medium uppercase tracking-wide",
        styles,
        className
      )}
      {...props}
    />
  );
}
