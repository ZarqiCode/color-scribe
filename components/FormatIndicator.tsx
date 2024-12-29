"use client";

import { Bold, Italic, Type } from "lucide-react";
import { motion } from "framer-motion";

interface FormatIndicatorProps {
  activeFormats: string[];
}

export function FormatIndicator({ activeFormats }: FormatIndicatorProps) {
  const getFormatIcon = (format: string) => {
    switch (format) {
      case "bold":
        return <Bold className="h-4 w-4" />;
      case "italic":
        return <Italic className="h-4 w-4" />;
      case "h1":
        return <Type className="h-4 w-4" />;
      case "h2":
        return <Type className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full">
      {activeFormats.map((format, index) => (
        <motion.div
          key={format}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            delay: index * 0.15,
          }}
          className="text-zinc-600 flex items-center"
          title={format.toUpperCase()}
        >
          {getFormatIcon(format)}
        </motion.div>
      ))}
    </div>
  );
} 