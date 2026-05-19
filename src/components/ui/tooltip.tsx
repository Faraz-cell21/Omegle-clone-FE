import type * as React from "react";
import { cn } from "~/lib/utils";

function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function TooltipTrigger({ children, ...props }: React.ComponentProps<"div">) {
  return <div {...props}>{children}</div>;
}

function TooltipContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("z-50 rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-md", className)} {...props}>
      {children}
    </div>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent };
