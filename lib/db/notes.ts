/**
 * Database service for notes operations.
 * Handles all interactions with Supabase notes table.
 */

import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import { Note } from "@/types/note";

export type CreateNoteData = {
  title: string;
  content?: string;
  color: string;
};

export type UpdateNoteData = {
  title?: string;
  content?: string;
  color?: string;
  starred?: boolean;
};

export const notesService = {
  /**
   * Fetch all notes for the current user
   */
  async getNotes() {
    const { data: notes, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching notes: ${error.message}`);
    }

    return notes;
  },

  /**
   * Create a new note
   */
  async createNote(noteData: CreateNoteData) {
    const { data: note, error } = await supabase
      .from("notes")
      .insert([
        {
          ...noteData,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating note: ${error.message}`);
    }

    return note;
  },

  /**
   * Update an existing note
   */
  async updateNote(id: number, noteData: UpdateNoteData) {
    const { data: note, error } = await supabase
      .from("notes")
      .update(noteData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating note: ${error.message}`);
    }

    return note;
  },

  /**
   * Toggle star status of a note
   */
  async toggleNoteStarred(id: number, starred: boolean) {
    return this.updateNote(id, { starred });
  },

  /**
   * Subscribe to real-time note changes
   */
  subscribeToNotes(callback: (notes: Note[]) => void) {
    const subscription = supabase
      .channel("notes_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
        },
        async () => {
          // Fetch updated notes when any change occurs
          const notes = await this.getNotes();
          callback(notes);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },

  /**
   * Delete a note
   */
  async deleteNote(id: number) {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      throw new Error(`Error deleting note: ${error.message}`);
    }
  },
};
