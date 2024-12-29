import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/lib/utils/languages";
import { Globe } from "lucide-react";

interface LanguageSelectProps {
  value: LanguageCode;
  onValueChange: (value: LanguageCode) => void;
}

export function LanguageSelect({ value, onValueChange }: LanguageSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-100 rounded-lg border-0 w-[140px] focus:ring-0 shadow-none">
        <Globe className="h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="shadow-none">
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, { name }]) => (
          <SelectItem key={code} value={code} className="text-sm">
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
