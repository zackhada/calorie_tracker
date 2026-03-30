import { useState, useRef, useCallback, useEffect } from "react";

interface SpeechRecognitionHook {
  transcript: string;
  interimText: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

const SpeechRecognition =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const isSupported = !!SpeechRecognition;

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;

    setError(null);
    setTranscript("");
    setInterimText("");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    let accumulated = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = accumulated;
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += (finalText ? " " : "") + result[0].transcript;
          accumulated = finalText;
        } else {
          interim += result[0].transcript;
        }
      }

      setTranscript(finalText);
      setInterimText(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted") return;
      const messages: Record<string, string> = {
        "no-speech": "No speech detected. Try again.",
        "audio-capture": "No microphone found.",
        "not-allowed": "Microphone access denied.",
        network: "Network error. Check your connection.",
      };
      setError(messages[event.error] || `Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimText("");
    setError(null);
  }, []);

  return { transcript, interimText, isListening, isSupported, startListening, stopListening, resetTranscript, error };
}
