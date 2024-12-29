"use client";

/**
 * Sidebar component that displays the create note button and color palette.
 * Handles the creation of new notes through a button click that triggers the create modal.
 */

import { Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

interface SidebarProps {
  onCreateClick: () => void;
}

export function Sidebar({ onCreateClick }: SidebarProps) {
  const { signOut } = useAuth();

  const colorVariants = [
    "bg-[#FFD699]",
    "bg-[#FFB399]",
    "bg-[#E5B8FF]",
    "bg-[#99ECF0]",
    "bg-[#D9F099]",
    "bg-[#FFB5E8]",
    "bg-[#AEC6FF]",
    "bg-[#FFEFA1]",
  ];

  return (
    <motion.div
      className="w-20 border-r p-4 flex flex-col items-center sticky top-0 h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <Button
          size="icon"
          variant="outline"
          className="rounded-full w-12 h-12"
          onClick={onCreateClick}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>

      <div className="space-y-4 mt-6">
        {colorVariants.map((color, index) => (
          <motion.div
            key={color}
            className={`w-4 h-4 rounded-full ${color}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              delay: 0.2 + index * 0.05,
            }}
          />
        ))}
      </div>

      <motion.div
        className="mt-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.5 }}
      >
        <Button
          size="icon"
          variant="ghost"
          className="w-10 h-10 rounded-full hover:bg-zinc-100"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5 text-zinc-600" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
