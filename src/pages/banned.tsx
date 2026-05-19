import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default function BannedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-sm text-center border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Access restricted</CardTitle>
          <CardDescription>
            Your IP has been temporarily banned due to moderation policy violations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please try again later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
