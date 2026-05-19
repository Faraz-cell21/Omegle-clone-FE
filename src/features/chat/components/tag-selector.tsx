import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Plus, X } from "lucide-react";

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function TagSelector({
  selectedTags,
  onChange,
  disabled,
}: TagSelectorProps) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const normalized = draft.trim().toLowerCase();
    if (!normalized || selectedTags.includes(normalized)) {
      setDraft("");
      return;
    }
    onChange([...selectedTags, normalized]);
    setDraft("");
  };

  const removeTag = (tag: string) => {
    if (disabled) return;
    onChange(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="tag-input">Your tags</Label>
        <p className="text-muted-foreground text-xs mt-0.5">
          Add one or more topics — you&apos;ll match with people who share at
          least one tag.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          id="tag-input"
          placeholder="e.g. gaming, music, coding..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          disabled={disabled}
          className="h-10"
        />
        <Button
          type="button"
          variant="outline"
          onClick={addTag}
          disabled={disabled || !draft.trim()}
          className="shrink-0"
        >
          <Plus className="size-4" />
          <span className="sr-only">Add tag</span>
        </Button>
      </div>

      {selectedTags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-sm">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                disabled={disabled}
                className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          No tags yet — add at least one to use tag matching.
        </p>
      )}
    </div>
  );
}
