import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useSocketContext } from "~/features/chat/context/socket-context";
import { useChatStore } from "~/features/chat/store/chat-store";
import { Globe } from "lucide-react";

export default function WaitingPage() {
  const { selectedTags, matchMode, connectionNotice } = useChatStore();
  const { endChat } = useSocketContext();

  const isGlobal = matchMode === "global";

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Finding someone...</CardTitle>
          <CardDescription>
            {connectionNotice
              ? connectionNotice
              : isGlobal
              ? "Looking for someone in global chat"
              : "Matching based on your tags"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <span className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>

          {isGlobal ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Globe className="size-4" aria-hidden />
              <span>Global chat — anyone online</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Button variant="outline" onClick={endChat}>
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
