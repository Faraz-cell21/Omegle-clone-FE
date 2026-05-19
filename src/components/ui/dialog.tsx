import type * as React from "react";
import { cn } from "~/lib/utils";
import { Button } from "./button";

function Dialog({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  return <>{children}</>;
}

function DialogTrigger({ asChild, children, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  return children;
}

function DialogContent({ className, children, ...props }: React.ComponentProps<"div"> & { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={props.onClose} />
      <div className={cn("relative z-50 w-full max-w-lg rounded-xl border bg-background p-6 shadow-lg", className)} {...props}>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("font-semibold text-lg leading-none", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2", className)} {...props} />;
}

function DialogClose({ className, ...props }: React.ComponentProps<"button">) {
  return <button className={cn("", className)} {...props} />;
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose };
