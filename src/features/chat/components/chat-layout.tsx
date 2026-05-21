import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BrandWatermarkBackground } from "~/components/brand/brand-watermark-background";
import { ChatotLogo } from "~/components/brand/chatot-logo";
import { useChatStore } from "../store/chat-store";
import { routeForStatus } from "../lib/status-routes";

export default function ChatLayout() {
  const status = useChatStore((s) => s.status);
  const navigate = useNavigate();
  const location = useLocation();
  const showTopBar =
    location.pathname !== "/" && location.pathname !== "/chat";

  useEffect(() => {
    const target = routeForStatus(status);
    if (location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [status, location.pathname, navigate]);

  return (
    <div className="relative flex min-h-screen min-h-[100dvh] flex-col bg-background text-foreground">
      <BrandWatermarkBackground />

      {showTopBar && (
        <header className="relative z-10 shrink-0 border-b bg-background/90 backdrop-blur-sm">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex shrink-0">
              <ChatotLogo variant="wordmark" size="sm" />
            </Link>
          </div>
        </header>
      )}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}
