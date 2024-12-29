"use client";

/**
 * NotesGrid component that manages the display of all notes.
 * Includes the header with title and filter toggle for starred notes.
 * Renders a responsive grid of NoteCard components and handles the filtering logic.
 */

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Note } from "@/types/note";
import { NoteCard } from "@/components/NoteCard";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface NotesGridProps {
  notes: Note[];
  showOnlyStarred: boolean;
  onToggleFilter: () => void;
  onToggleStar: (id: number) => void;
  onDeleteNote: (id: number) => void;
  isLoading: boolean;
}

export function NotesGrid({
  notes,
  showOnlyStarred,
  onToggleFilter,
  onToggleStar,
  onDeleteNote,
  isLoading,
}: NotesGridProps) {
  return (
    <div className="flex-1 h-screen overflow-y-auto hide-scrollbar">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">ColorScribe</h1>
          <div className="flex items-center gap-4">
            <Button
              variant={showOnlyStarred ? "default" : "outline"}
              onClick={onToggleFilter}
              className="gap-2"
            >
              <Star
                className={`h-4 w-4 ${showOnlyStarred ? "fill-current" : ""}`}
              />
              {showOnlyStarred ? "Showing Starred" : "Show Starred"}
            </Button>
          </div>
        </div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-zinc-100 rounded-3xl h-[200px]"
                  />
                ))}
              </div>
            ) : notes.length > 0 ? (
              <motion.div
                key={showOnlyStarred ? "starred" : "all"}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 col-span-full"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.15,
                  delay: 0.08,
                  ease: "easeOut",
                }}
              >
                {notes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <NoteCard
                      note={note}
                      onToggleStar={onToggleStar}
                      onDeleteNote={onDeleteNote}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="col-span-full flex flex-col items-center justify-center gap-6 mt-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={
                    showOnlyStarred
                      ? "/undraw_stars_e9bi.png"
                      : "/undraw_notebook_jy1h.png"
                  }
                  alt={showOnlyStarred ? "No starred notes" : "No notes"}
                  width={300}
                  height={300}
                  className="opacity-80 dark:invert-[.85]"
                  priority
                />
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-zinc-700 mb-2">
                    {showOnlyStarred
                      ? "No starred notes yet"
                      : "This feels empty"}
                  </h2>
                  <p className="text-zinc-500 mb-6">
                    {showOnlyStarred
                      ? "Star your favorite notes to see them here"
                      : "press Alt + N or use the plus button in the sidebar to create a note"}
                  </p>
                  {showOnlyStarred && (
                    <Button
                      variant="outline"
                      onClick={onToggleFilter}
                      className="gap-2"
                    >
                      <Star className="h-4 w-4" />
                      Show all notes
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
