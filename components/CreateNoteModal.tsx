"use client";

/**
 * CreateNoteModal component that handles new note creation.
 * Features:
 * - Title input
 * - Color selection with live preview
 * - Loading states
 * - Enhanced animations
 * - Error handling
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { notesService } from "@/lib/db/notes";
import { toast } from "sonner";
import { useNotes } from "@/lib/context/NotesContext";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNote: (data: { title: string; color: string }) => Promise<void>;
}

export function CreateNoteModal({ isOpen, onClose }: CreateNoteModalProps) {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-[#FFD699]");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNote } = useNotes();

  const colorVariants = [
    "bg-[#FFD699]", // Pastel Orange
    "bg-[#FFB399]", // Pastel Coral
    "bg-[#E5B8FF]", // Pastel Purple
    "bg-[#99ECF0]", // Pastel Blue
    "bg-[#D9F099]", // Pastel Green
    "bg-[#FFB5E8]", // Pastel Pink
    "bg-[#AEC6FF]", // Pastel Sky Blue
    "bg-[#FFEFA1]", // Pastel Yellow
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const newNote = await notesService.createNote({
        title,
        color: selectedColor,
        content: "",
      });

      // Add the new note to the context
      addNote(newNote);

      toast.success("Note created successfully");
      handleClose();
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setSelectedColor(colorVariants[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Note Preview */}
          <div className="relative">
            <motion.div
              className={cn(
                "rounded-2xl p-6 transition-colors duration-300",
                selectedColor
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-[300px]">
                <h3 className="text-lg font-medium mb-2 truncate">
                  {title || "Note Title"}
                </h3>
                <p className="text-sm opacity-60 truncate">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <div className="w-full">
              <Input
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
                maxLength={100}
                className="focus-visible:ring-1 w-full h-10 py-2"
              />
            </div>

            {/* Color Selection */}
            <div className="flex justify-center gap-3">
              <AnimatePresence>
                {colorVariants.map((color, index) => (
                  <motion.div
                    key={color}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full cursor-pointer transition-all duration-200",
                        color,
                        selectedColor === color
                          ? "ring-2 ring-black scale-110"
                          : "hover:scale-110",
                        isSubmitting && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => !isSubmitting && setSelectedColor(color)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="w-full sm:w-auto relative overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={{
                  x: isSubmitting ? 20 : 0,
                  opacity: isSubmitting ? 0 : 1,
                }}
              >
                Create Note
              </motion.div>
              {isSubmitting && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                </motion.div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
