import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { ChatotLogo } from "~/components/brand/chatot-logo";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen min-h-[100dvh] flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center shadow-sm">
        <CardHeader className="space-y-4">
          <ChatotLogo variant="wordmark" size="sm" className="mx-auto" />
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FileQuestion className="size-7" aria-hidden />
          </div>
          <CardTitle className="text-2xl">Page not found</CardTitle>
          <CardDescription>
            The page you are looking for does not exist or may have been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/">Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
