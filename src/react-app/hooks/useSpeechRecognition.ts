import { useState, useRef, useCallback, useEffect } from "react";

// Language code mapping for Web Speech API
const languageCodeMap: Record<string, string> = {
  auto: "en-US", // Default to English for auto-detect, will use detected language
  en: "en-US",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
};

// Language name mapping
const languageNameMap: Record<string, string> = {
  "en-US": "English",
  "en-IN": "English",
  "hi-IN": "Hindi",
  "ta-IN": "Tamil",
  "te-IN": "Telugu",
};

interface UseSpeechRecognitionOptions {
  language: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onLanguageDetected?: (language: string) => void;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  detectedLanguage: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Define types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useSpeechRecognition({
  language,
  onResult,
  onError,
  onLanguageDetected,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("en");
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isStoppingRef = useRef(false);

  // Check if browser supports speech recognition
  const isSupported = typeof window !== "undefined" && 
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = useCallback(() => {
    if (!isSupported) {
      onError?.("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    // Clean up any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = languageCodeMap[language] || "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      isStoppingRef.current = false;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += text;
          
          // Try to detect language from the result if in auto mode
          if (language === "auto") {
            // Simple heuristic based on character sets
            const detectedLang = detectLanguageFromText(text);
            if (detectedLang !== detectedLanguage) {
              setDetectedLanguage(detectedLang);
              onLanguageDetected?.(languageNameMap[languageCodeMap[detectedLang]] || "English");
            }
          }
        } else {
          interim += text;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + " " + finalTranscript);
        onResult?.(finalTranscript, true);
      }
      
      setInterimTranscript(interim);
      if (interim) {
        onResult?.(interim, false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        onError?.("Microphone access denied. Please allow microphone access in your browser settings.");
      } else if (event.error === "no-speech") {
        // Don't show error for no speech, just continue listening
      } else if (event.error !== "aborted") {
        onError?.(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if not intentionally stopped
      if (!isStoppingRef.current && recognitionRef.current === recognition) {
        try {
          recognition.start();
        } catch {
          // Ignore errors on restart
        }
      }
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (error) {
      onError?.("Failed to start speech recognition. Please try again.");
    }
  }, [isSupported, language, onResult, onError, onLanguageDetected, detectedLanguage]);

  const stopListening = useCallback(() => {
    isStoppingRef.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    detectedLanguage,
    startListening,
    stopListening,
    resetTranscript,
  };
}

// Simple language detection based on character sets
function detectLanguageFromText(text: string): string {
  // Hindi (Devanagari)
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";
  // Default to English
  return "en";
}
