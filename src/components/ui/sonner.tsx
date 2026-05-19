import { Toaster as Sonner } from "sonner";

function Toaster(props: React.ComponentProps<typeof Sonner>) {
  return <Sonner className="toaster group" {...props} />;
}

export { Toaster };
