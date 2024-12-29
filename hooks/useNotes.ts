"use client";

import { useState, useEffect } from "react";
import { notesService } from "@/lib/db/notes";
import { Note } from "@/types/note";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchNotes = async () => {
      try {
        const initialNotes = await notesService.getNotes();
        setNotes(initialNotes);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch notes")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    // Subscribe to changes
    const unsubscribe = notesService.subscribeToNotes((updatedNotes) => {
      setNotes(updatedNotes);
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);

  return { notes, loading, error };
}
