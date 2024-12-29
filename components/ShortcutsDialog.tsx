"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Shortcut {
  key: string;
  description: string;
}

const shortcuts: Shortcut[] = [
  { key: "Ctrl/⌘ + B", description: "Bold text" },
  { key: "Ctrl/⌘ + I", description: "Italic text" },
  { key: "Alt + L", description: "Large text (H1)" },
  { key: "Alt + M", description: "Medium text (H2)" },
  { key: "Ctrl/⌘ + S", description: "Save note" },
  { key: "Esc", description: "Close editor" },
];

export function ShortcutsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-zinc-100"
        >
          <HelpCircle className="h-5 w-5 text-zinc-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-zinc-600">
                {shortcut.description}
              </span>
              <kbd className="px-2 py-1 text-xs font-semibold text-zinc-800 bg-zinc-100 rounded">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 