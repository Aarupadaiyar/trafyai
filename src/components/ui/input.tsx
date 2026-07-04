import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-pill border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-gray-body focus:border-ink outline-none",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
