"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Note } from "@/types/note";
import { notesService } from "@/lib/db/notes";
import debounce from "lodash/debounce";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import { NoteHeader } from "@/components/NoteHeader";
import { FormatIndicator } from "@/components/FormatIndicator";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EditNoteDialogProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
}

export function EditNoteDialog({ note, isOpen, onClose }: EditNoteDialogProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const debouncedSave = useCallback(
    debounce(async (noteId: number, newContent: string) => {
      try {
        await notesService.updateNote(noteId, { content: newContent });
      } catch (error) {
        console.error("Error saving note:", error);
        toast.error("Failed to save changes");
      }
    }, 1000),
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      TextStyle,
      Placeholder.configure({
        placeholder: "Start writing your note here...",
      }),
      Extension.create({
        addKeyboardShortcuts() {
          return {
            "Alt-l": () =>
              this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
            "Alt-m": () =>
              this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
            "Mod-b": () => this.editor.chain().focus().toggleBold().run(),
            "Mod-i": () => this.editor.chain().focus().toggleItalic().run(),
            "Mod-s": () => {
              window.addEventListener(
                "keydown",
                (e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                    e.preventDefault();
                  }
                },
                { once: true }
              );
              return true;
            },
          };
        },
      }),
    ],
    content: note.content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      debouncedSave(note.id, newContent);
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg focus:outline-none max-w-none h-full px-6 py-4",
      },
    },
    onSelectionUpdate: ({ editor }) => {
      const formats = [];
      if (editor.isActive("bold")) formats.push("bold");
      if (editor.isActive("italic")) formats.push("italic");
      if (editor.isActive("heading", { level: 1 })) formats.push("h1");
      if (editor.isActive("heading", { level: 2 })) formats.push("h2");
      setActiveFormats(formats);
    },
    autofocus: true,
  });

  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content || "");
    }
  }, [note.id, note.content, editor]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor]);

  useEffect(() => {
    if (isOpen && editor) {
      setTimeout(() => {
        editor.commands.focus("end");
      }, 0);
    }
  }, [isOpen, editor]);

  const handleClose = async () => {
    if (editor) {
      try {
        await notesService.updateNote(note.id, { content: editor.getHTML() });
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }
    onClose();
  };

  const handleTranscript = (transcript: string) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertContent(transcript + " ")
        .run();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "max-w-[90vw] h-[90vh] flex flex-col",
          note.color,
          isRecording && "ring-2 ring-red-500 ring-opacity-50"
        )}
      >
        <div className="flex-shrink-0">
          <NoteHeader
            title={note.title}
            createdAt={note.created_at}
            onTranscript={handleTranscript}
          />
        </div>
        <motion.div
          className="flex-1 overflow-auto relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: "easeInOut",
          }}
        >
          <EditorContent
            editor={editor}
            className="min-h-full w-full h-full editor-container"
          />
          <AnimatePresence>
            {activeFormats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="absolute bottom-4 left-6"
              >
                <FormatIndicator activeFormats={activeFormats} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
