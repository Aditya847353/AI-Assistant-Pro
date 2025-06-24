import * as React from "react";
import { cn } from "@/lib/utils";

export const ScrollArea = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("overflow-y-auto max-h-96 rounded-md border", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";