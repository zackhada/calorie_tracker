import React, { useState, useEffect } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { logFood } from "../api";

interface VoiceInputProps {
  onMealLogged: () => void;
}

export default function VoiceInput({ onMealLogged }: VoiceInputProps) {
  const { transcript, interimText, isListening, isSupported, startListening, stopListening, resetTranscript, error } =
    useSpeechRecognition();
  const [editableText, setEditableText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasRecorded, setHasRecorded] = useState(false);

  useEffect(() => {
    if (transcript || interimText) {
      setEditableText(transcript + (interimText ? (transcript ? " " : "") + interimText : ""));
    }
  }, [transcript, interimText]);

  useEffect(() => {
    if (!isListening && transcript) {
      setHasRecorded(true);
    }
  }, [isListening, transcript]);

  const handleRecord = () => {
    if (isListening) {
      stopListening();
    } else {
      setSubmitError(null);
      setHasRecorded(false);
      resetTranscript();
      setEditableText("");
      startListening();
    }
  };

  const handleReRecord = () => {
    setSubmitError(null);
    setHasRecorded(false);
    resetTranscript();
    setEditableText("");
    startListening();
  };

  const handleClear = () => {
    setHasRecorded(false);
    setEditableText("");
    setSubmitError(null);
    resetTranscript();
  };

  const handleSubmit = async () => {
    const text = editableText.trim();
    if (!text) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await logFood(text, today);
      setEditableText("");
      setHasRecorded(false);
      resetTranscript();
      onMealLogged();
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || err.message || "Failed to log meal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  const displayText = editableText || "";

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
      {/* Top section: mic button + status */}
      <div className="flex items-center gap-5">
        {isSupported && (
          <button
            onClick={handleRecord}
            disabled={isSubmitting}
            className={`relative shrink-0 w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isListening
                ? "bg-neon-red/20 border-2 border-neon-red shadow-neon-red"
                : "bg-dark-700 border border-dark-500 hover:border-neon-cyan/50 hover:shadow-neon-cyan"
            }`}
          >
            {isListening && (
              <span className="absolute inset-0 rounded-lg bg-neon-red/10 animate-pulse-ring" />
            )}
            {isListening ? (
              <svg className="w-6 h-6 text-neon-red relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        )}

        <div className="flex-1 min-w-0">
          {isListening ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-end gap-0.5 h-7">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 bg-neon-red rounded-full waveform-bar" style={{ height: '12px' }} />
                  ))}
                </div>
                <span className="text-neon-red text-xs font-mono uppercase tracking-wider">Recording</span>
              </div>
              {displayText && (
                <p className="text-white/80 text-sm truncate">"{displayText}"</p>
              )}
              {!displayText && (
                <p className="text-dark-500 text-sm font-mono">Listening...</p>
              )}
            </div>
          ) : hasRecorded && displayText ? (
            <div>
              <p className="text-xs text-neon-green font-mono uppercase tracking-wider mb-1">Captured</p>
              <p className="text-white/80 text-sm truncate">"{displayText}"</p>
            </div>
          ) : (
            <div>
              <p className="text-white text-sm font-medium">
                {isSupported ? "Tap to record what you ate" : "Type what you ate"}
              </p>
              <p className="text-dark-500 text-xs mt-0.5 font-mono">
                {isSupported ? 'or type it below' : 'voice not supported in this browser'}
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 px-3 py-2 bg-neon-red/10 border border-neon-red/20 rounded text-neon-red text-xs font-mono">
          {error}
        </div>
      )}

      {/* Text input area - always visible */}
      <form onSubmit={handleTextSubmit} className="mt-4">
        <textarea
          value={isListening ? displayText : editableText}
          onChange={(e) => { if (!isListening) setEditableText(e.target.value); }}
          readOnly={isListening}
          placeholder='"Two eggs, toast with butter, and a coffee"'
          rows={2}
          className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-dark-500 text-sm font-mono focus:outline-none focus:border-neon-cyan/40 focus:shadow-neon-cyan resize-none transition-all"
        />

        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            {hasRecorded && !isListening && isSupported && (
              <button
                type="button"
                onClick={handleReRecord}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-dark-500 hover:text-neon-cyan border border-dark-600 hover:border-neon-cyan/30 rounded transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
                re-record
              </button>
            )}
            {editableText && !isListening && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isSubmitting}
                className="px-3 py-1.5 text-xs font-mono text-dark-500 hover:text-neon-red border border-dark-600 hover:border-neon-red/30 rounded transition-all"
              >
                clear
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !editableText.trim() || isListening}
            className="px-5 py-2 bg-neon-cyan/10 text-neon-cyan text-sm font-mono font-medium border border-neon-cyan/30 rounded hover:bg-neon-cyan/20 hover:shadow-neon-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                analyzing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                log it
              </>
            )}
          </button>
        </div>

        {submitError && (
          <div className="mt-2 px-3 py-2 bg-neon-red/10 border border-neon-red/20 rounded text-neon-red text-xs font-mono">
            {submitError}
          </div>
        )}
      </form>
    </div>
  );
}
