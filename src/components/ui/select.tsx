import type * as React from "react";
import { cn } from "~/lib/utils";

function Select({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SelectTrigger({ className, children, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function SelectValue({ placeholder, children }: { placeholder?: string; children?: React.ReactNode }) {
  if (children) return <span className="flex-1 text-left">{children}</span>;
  return <span className="flex-1 text-left text-muted-foreground">{placeholder}</span>;
}

function SelectContent({ className, children }: React.ComponentProps<"div">) {
  return <div className={cn("mt-1 rounded-md border bg-popover p-1 shadow-md", className)}>{children}</div>;
}

function SelectItem({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground", className)} {...props}>
      {children}
    </div>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
