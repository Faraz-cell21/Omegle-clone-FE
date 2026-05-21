import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BrandWatermarkBackground } from "~/components/brand/brand-watermark-background";
import { ChatotLogo } from "~/components/brand/chatot-logo";
import { SiteFooter } from "./site-footer";

interface SiteLayoutProps {
  children: ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="relative flex min-h-screen min-h-[100dvh] flex-col bg-background text-foreground">
      <BrandWatermarkBackground />
      <header className="relative z-10 border-b bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-center px-4">
          <Link to="/" className="inline-flex shrink-0">
            <ChatotLogo variant="wordmark" size="sm" />
          </Link>
        </div>
      </header>
      <main className="relative z-10 flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
