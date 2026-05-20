import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useChatStore } from "~/features/chat/store/chat-store";

export default function ReconnectingPage() {
  const reconnectAttempts = useChatStore((s) => s.reconnectAttempts);
  const notice = useChatStore((s) => s.connectionNotice);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>Reconnecting</CardTitle>
          <CardDescription>
            {notice || "Restoring your connection"}
            {reconnectAttempts > 0 ? ` (attempt ${reconnectAttempts})` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <span className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
