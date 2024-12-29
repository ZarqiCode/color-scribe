"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Note } from "@/types/note";

interface NotesContextType {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (noteId: number, updates: Partial<Note>) => void;
  deleteNote: (noteId: number) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = useCallback((note: Note) => {
    setNotes((prev) => [note, ...prev]);
  }, []);

  const updateNote = useCallback((noteId: number, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === noteId ? { ...note, ...updates } : note))
    );
  }, []);

  const deleteNote = useCallback((noteId: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  }, []);

  return (
    <NotesContext.Provider
      value={{ notes, setNotes, addNote, updateNote, deleteNote }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
