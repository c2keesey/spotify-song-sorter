import {
  defaultKeyBindings,
  KeyBinding,
  keyBindingsState,
} from "@/atoms/keyBindingsAtom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatKeyDisplay = (key: string): string => {
  // Handle compound keys (e.g., "Shift + a")
  if (key.includes("+")) {
    const parts = key.split("+").map((part) => formatKeyDisplay(part.trim()));
    return parts.join(" + ");
  }

  // Special key mappings
  const keyMappings: Record<string, string> = {
    " ": "Space",
    ArrowLeft: "←",
    ArrowRight: "→",
    ArrowUp: "↑",
    ArrowDown: "↓",
    Control: "Ctrl",
    Escape: "Esc",
    Delete: "Del",
    Backspace: "⌫",
    Enter: "↵",
    Tab: "⇥",
  };

  return keyMappings[key] || (key.length === 1 ? key.toUpperCase() : key);
};

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [keyBindings, setKeyBindings] = useRecoilState(keyBindingsState);
  const [editingBinding, setEditingBinding] = useState<KeyBinding | null>(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!editingBinding) return;

      // Escape to cancel
      if (e.code === "Escape") {
        setListening(false);
        setEditingBinding(null);
        return;
      }

      // Don't allow modifier keys by themselves
      if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) {
        return;
      }

      const displayKey = formatKeyDisplay(e.key);
      const newBinding: KeyBinding = {
        ...editingBinding,
        key: e.shiftKey ? `Shift + ${displayKey}` : displayKey,
        code: e.code,
        requiresShift: e.shiftKey,
      };

      // Update the keybinding
      setKeyBindings((prev) =>
        prev.map((kb) =>
          kb.action === editingBinding.action ? newBinding : kb
        )
      );

      setListening(false);
      setEditingBinding(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [listening, editingBinding, setKeyBindings]);

  const startBinding = (binding: KeyBinding) => {
    setEditingBinding(binding);
    setListening(true);
  };

  const resetToDefault = (binding: KeyBinding) => {
    const defaultBinding = defaultKeyBindings.find(
      (kb) => kb.action === binding.action
    );
    if (!defaultBinding) return;

    setKeyBindings((prev) =>
      prev.map((kb) => (kb.action === binding.action ? defaultBinding : kb))
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Keyboard Shortcuts</h3>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <QuestionMarkCircledIcon className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <p className="text-sm">
                    Click on a shortcut to change it. Press Escape to cancel.
                    Shortcuts can include the Shift key.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-4">
              {keyBindings.map((binding) => (
                <div
                  key={binding.action}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {binding.description}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetToDefault(binding)}
                      className="h-6 px-2 text-xs"
                    >
                      Reset
                    </Button>
                    <kbd
                      onClick={() => startBinding(binding)}
                      className={`inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium ${
                        editingBinding?.action === binding.action
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      } ${
                        editingBinding?.action === binding.action
                          ? "cursor-default"
                          : "cursor-pointer"
                      }`}
                    >
                      {editingBinding?.action === binding.action
                        ? "Press a key..."
                        : binding.key}
                    </kbd>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
