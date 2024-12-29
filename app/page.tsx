"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { NotesGrid } from "@/components/NotesGrid";
import { CreateNoteModal } from "@/components/CreateNoteModal";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { notesService } from "@/lib/db/notes";
import { toast } from "sonner";
import { useNotes } from "@/lib/context/NotesContext";
import { OfflineIndicator } from "@/components/OfflineIndicator";

export default function Page() {
  const { notes, setNotes, updateNote, deleteNote } = useNotes();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showOnlyStarred, setShowOnlyStarred] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const fetchedNotes = await notesService.getNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error loading notes:", error);
        toast.error("Failed to load notes");
      } finally {
        setIsLoading(false);
      }
    };
    loadNotes();
  }, [setNotes]);

  // Add useEffect for keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setIsCreateModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle note creation with database
  const handleCreateNote = async ({
    title,
    color,
  }: {
    title: string;
    color: string;
  }) => {
    try {
      await notesService.createNote({
        title,
        color,
        content: "", // Initial empty content
      });
      setIsCreateModalOpen(false);
      toast.success("Note created successfully");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note", {
        description: "Please try again",
      });
    }
  };

  // Handle star toggle with database
  const handleToggleStar = async (noteId: number) => {
    try {
      const noteToUpdate = notes.find((note) => note.id === noteId);
      if (noteToUpdate) {
        const newStarredState = !noteToUpdate.starred;
        await notesService.toggleNoteStarred(noteId, newStarredState);

        // Update the note in context
        updateNote(noteId, { starred: newStarredState });

        toast.success(
          newStarredState
            ? "Note added to favorites"
            : "Note removed from favorites",
          { duration: 2000 }
        );
      }
    } catch (error) {
      console.error("Error toggling star:", error);
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      await notesService.deleteNote(noteId);
      deleteNote(noteId);
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const filteredNotes = showOnlyStarred
    ? notes.filter((note) => note.starred)
    : notes;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar onCreateClick={() => setIsCreateModalOpen(true)} />
        <NotesGrid
          notes={filteredNotes}
          showOnlyStarred={showOnlyStarred}
          onToggleFilter={() => setShowOnlyStarred(!showOnlyStarred)}
          onToggleStar={handleToggleStar}
          onDeleteNote={handleDeleteNote}
          isLoading={isLoading}
        />
        <CreateNoteModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateNote={handleCreateNote}
        />
        <OfflineIndicator />
      </div>
    </ProtectedRoute>
  );
}
