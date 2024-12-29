"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Mic } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShortcutsDialog } from "@/components/ShortcutsDialog";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { SpeechToTextButton } from "@/components/SpeechToTextButton";
import { useState } from "react";

interface NoteHeaderProps {
  title: string;
  createdAt: string;
  onTranscript: (transcript: string) => void;
}

export function NoteHeader({
  title,
  createdAt,
  onTranscript,
}: NoteHeaderProps) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <DialogHeader className="px-6 flex flex-row items-center justify-between">
      <div className="flex flex-col gap-1 min-w-0">
        <DialogTitle className="text-2xl font-bold truncate max-w-[50vw]">
          {title}
        </DialogTitle>
        <div className="flex items-center gap-1 text-sm text-zinc-600">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            Created {formatDate(new Date(createdAt))}
          </span>
        </div>
      </div>
      <motion.div className="flex items-center gap-4 flex-shrink-0">
        <ShortcutsDialog />
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SpeechToTextButton
                  onTranscriptComplete={onTranscript}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-100 rounded-lg"
                  onRecordingStateChange={setIsRecording}
                >
                  <Mic className="h-4 w-4" />
                  <span>{isRecording ? "Recording..." : "Voice Input"}</span>
                </SpeechToTextButton>
              </TooltipTrigger>
              <TooltipContent>
                Press Alt+V to start/stop voice input
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
    </DialogHeader>
  );
}
