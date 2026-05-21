import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background/90 py-6 text-center text-sm text-muted-foreground">
      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4"
        aria-label="Legal"
      >
        <Link to="/privacy" className="hover:text-foreground underline-offset-4 hover:underline">
          Privacy Policy
        </Link>
        <span aria-hidden>·</span>
        <Link to="/terms" className="hover:text-foreground underline-offset-4 hover:underline">
          Terms of Service
        </Link>
      </nav>
      <p className="mt-3 px-4">© {new Date().getFullYear()} Chatot. 18+ only.</p>
    </footer>
  );
}
