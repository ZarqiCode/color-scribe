"use client";

/**
 * NoteCard component that renders an individual note.
 * Displays the note's title, date, and interactive buttons for editing and starring.
 * Handles the star toggle functionality for marking notes as favorites.
 */

import { useState, useEffect } from "react";
import { Pencil, Star, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Note } from "@/types/note";
import { EditNoteDialog } from "@/components/EditNoteDialog";
import { formatDate } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NoteCardProps {
  note: Note;
  onToggleStar: (id: number) => void;
  onDeleteNote: (id: number) => void;
}

export function NoteCard({ note, onToggleStar, onDeleteNote }: NoteCardProps) {
  const [isClient, setIsClient] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setIsDeleting(true);
      try {
        await onDeleteNote(note.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <div
        className={`${note.color} rounded-3xl p-6 flex flex-col justify-between min-h-[200px] relative group 
          transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg transform-gpu backface-visibility-hidden`}
      >
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-medium truncate flex-1">{note.title}</h2>
          {isClient && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 flex-shrink-0"
              onClick={() => onToggleStar(note.id)}
            >
              <Star
                className={`h-4 w-4 ${note.starred ? "fill-current" : ""}`}
              />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-600 pb-2">
            Created {formatDate(new Date(note.created_at))}
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={isDeleting}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                    onClick={handleDelete}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete note</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <EditNoteDialog
        note={note}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
}
