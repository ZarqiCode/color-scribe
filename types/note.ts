/**
 * Type definition for Note objects.
 * Defines the structure of note data including id, title, date, color, and starred status.
 */

export interface Note {
  id: number;
  title: string;
  content: string;
  color: string;
  starred: boolean;
  created_at: string;
} 