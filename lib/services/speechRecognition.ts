import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/lib/utils/languages";

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private onTranscriptCallback: ((text: string) => void) | null = null;
  private onStateChangeCallback: ((isListening: boolean) => void) | null = null;
  private isListening: boolean = false;
  private shouldRestart: boolean = true;
  private currentLanguage: LanguageCode = "en";

  initialize() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return false;

    this.recognition = new SpeechRecognition();
    this.configureForBrowser();
    this.setupEventListeners();
    return true;
  }

  private configureForBrowser() {
    if (!this.recognition) return;

    const browser = this.detectBrowser();
    const config = {
      continuous: true,
      interimResults: browser === "chrome",
      maxAlternatives: 1,
    };

    Object.assign(this.recognition, config);
    this.recognition.lang = SUPPORTED_LANGUAGES[this.currentLanguage].code;
  }

  private detectBrowser(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("edg")) return "edge";
    if (userAgent.includes("chrome")) return "chrome";
    if (userAgent.includes("firefox")) return "firefox";
    if (userAgent.includes("safari")) return "safari";
    return "other";
  }

  private processPunctuation(text: string): string {
    const browser = this.detectBrowser();
    if (browser === "edge") return text;

    // Common words that often start questions
    const questionWords = /^(what|who|where|when|why|how|which|whose|whom)/i;

    return (
      text
        // Clean up extra spaces
        .trim()
        .replace(/\s+/g, " ")
        // Add question marks after question words
        .replace(
          new RegExp(`(${questionWords.source}[^.!?]+)([.])`, "gi"),
          "$1?"
        )
        // Add commas after transitional phrases
        .replace(
          /(however|moreover|furthermore|additionally|for example|therefore|consequently|as a result|in addition|nevertheless|on the other hand),?\s+/gi,
          "$1, "
        )
        // Add periods at natural breaks (capital letter followed by words then space)
        .replace(/([.!?])\s+([A-Z])/g, "$1 $2")
        // Add commas in lists
        .replace(/(\w+),?\s+(and|or)\s+(\w+)(?!\w*[.!?])/g, "$1, $2 $3")
        // Add period at the end if missing
        .replace(/([a-z])$/i, "$1.")
        // Capitalize first letter of sentences
        .replace(/(^\w|\.\s+\w|\?\s+\w|\!\s+\w)/g, (letter) =>
          letter.toUpperCase()
        )
        // Fix spacing around punctuation
        .replace(/\s+([.,!?])/g, "$1")
        .replace(/([.,!?])(\w)/g, "$1 $2")
        // Handle common abbreviations
        .replace(/\b(mr|mrs|ms|dr|prof|sr|jr|vs)\./gi, (match) =>
          match.toLowerCase()
        )
        // Fix multiple punctuation
        .replace(/([.!?])+/g, "$1")
    );
  }

  private setupEventListeners() {
    if (!this.recognition) return;

    let finalTranscript = "";

    this.recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;

      if (event.results[current].isFinal) {
        finalTranscript += (finalTranscript ? " " : "") + transcript;
        const processedTranscript = this.processPunctuation(finalTranscript);
        this.onTranscriptCallback?.(processedTranscript);
      }
    };

    this.recognition.onerror = this.handleError.bind(this);

    this.recognition.onend = () => {
      if (this.shouldRestart && this.isListening) {
        this.recognition?.start();
      } else {
        this.isListening = false;
        finalTranscript = "";
        this.onStateChangeCallback?.(false);
      }
    };
  }

  private handleError(event: SpeechRecognitionErrorEvent) {
    const browser = this.detectBrowser();

    switch (event.error) {
      case "network":
        if (this.isListening) {
          this.restartRecognition();
        }
        break;
      case "no-speech":
        // Safari often triggers this - ignore it
        if (browser !== "safari") {
          this.stop();
        }
        break;
      case "aborted":
        // Handle normal stops
        break;
      default:
        this.stop();
        break;
    }
  }

  private restartRecognition() {
    if (!this.recognition) return;

    setTimeout(() => {
      try {
        this.recognition?.start();
      } catch (e) {
        console.log(e);
        this.stop();
      }
    }, 1000);
  }

  public start() {
    if (!this.recognition) return false;

    try {
      this.shouldRestart = true;
      this.isListening = true;
      this.recognition.start();
      this.onStateChangeCallback?.(true);
      return true;
    } catch (e) {
      console.error("Start error:", e);
      this.isListening = false;
      this.shouldRestart = false;
      this.onStateChangeCallback?.(false);
      return false;
    }
  }

  public stop() {
    if (!this.recognition) return;

    try {
      this.shouldRestart = false;
      this.isListening = false;
      this.recognition.stop();
      this.onStateChangeCallback?.(false);
    } catch (e) {
      console.error("Stop error:", e);
    }
  }

  public onTranscript(callback: (text: string) => void) {
    this.onTranscriptCallback = callback;
  }

  public onStateChange(callback: (isListening: boolean) => void) {
    this.onStateChangeCallback = callback;
  }

  public isRecording(): boolean {
    return this.isListening;
  }

  public setLanguage(language: LanguageCode) {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = SUPPORTED_LANGUAGES[language].code;
    }
  }
}

export const speechRecognition = new SpeechRecognitionService();
