"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { speechRecognition } from "@/lib/services/speechRecognition";
import { LanguageSelect } from "@/components/LanguageSelect";
import { LanguageCode } from "@/lib/utils/languages";

interface SpeechToTextButtonProps {
  onTranscriptComplete: (transcript: string) => void;
  className?: string;
  children?: React.ReactNode;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

export function SpeechToTextButton({
  onTranscriptComplete,
  className,
  children,
  onRecordingStateChange,
}: SpeechToTextButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    const initialized = speechRecognition.initialize();
    if (!initialized) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    speechRecognition.setLanguage(currentLanguage);
    setIsListening(speechRecognition.isRecording());

    speechRecognition.onTranscript(onTranscriptComplete);
    speechRecognition.onStateChange((state) => {
      setIsListening(state);
      onRecordingStateChange?.(state);
    });

    return () => {
      if (speechRecognition.isRecording()) {
        speechRecognition.stop();
      }
    };
  }, [onTranscriptComplete, onRecordingStateChange, currentLanguage]);

  const toggleListening = async () => {
    try {
      if (speechRecognition.isRecording()) {
        speechRecognition.stop();
      } else {
        if (!navigator.onLine) {
          toast.error("No internet connection. Please connect and try again.");
          return;
        }
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const started = speechRecognition.start();
        if (started) {
          toast.success("Listening...");
        }
      }
    } catch (error) {
      console.error("Error toggling speech recognition:", error);
      speechRecognition.stop();
      toast.error("Could not access microphone");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <LanguageSelect
        value={currentLanguage}
        onValueChange={(lang) => {
          setCurrentLanguage(lang);
          speechRecognition.setLanguage(lang);
        }}
      />
      <Button
        onClick={toggleListening}
        variant="ghost"
        className={cn(
          "transition-colors",
          isListening ? "text-red-500 hover:text-red-600" : "",
          className
        )}
      >
        {children ||
          (isListening ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5" />
          ))}
        {isListening && (
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </motion.div>
        )}
      </Button>
    </div>
  );
}
