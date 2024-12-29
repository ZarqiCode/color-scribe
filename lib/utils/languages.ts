export const SUPPORTED_LANGUAGES = {
  en: { name: "English", code: "en-US" },
  es: { name: "Spanish", code: "es-ES" },
  fr: { name: "French", code: "fr-FR" },
  de: { name: "German", code: "de-DE" },
  pt: { name: "Portuguese", code: "pt-PT" },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;
