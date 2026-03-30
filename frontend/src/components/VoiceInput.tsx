import React, { useState, useEffect } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { logFood } from "../api";

interface VoiceInputProps {
  onMealLogged: () => void;
}

export default function VoiceInput({ onMealLogged }: VoiceInputProps) {
  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript, error } =
    useSpeechRecognition();
  const [editableText, setEditableText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    if (transcript) {
      setEditableText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (!isListening && transcript) {
      setShowEditor(true);
    }
  }, [isListening, transcript]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setShowEditor(false);
      setSubmitError(null);
      resetTranscript();
      setEditableText("");
      startListening();
    }
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
      setShowEditor(false);
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col items-center">
        {/* Microphone Button */}
        {isSupported && (
          <button
            onClick={handleMicClick}
            disabled={isSubmitting}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? "bg-red-500 shadow-lg shadow-red-200 scale-110"
                : "bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-200 hover:scale-105"
            }`}
          >
            {isListening && (
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
            )}
            <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
        )}

        <p className="mt-3 text-sm text-gray-500">
          {isListening ? "Listening... tap to stop" : isSupported ? "Tap to speak what you ate" : "Type what you ate below"}
        </p>

        {/* Live transcript while listening */}
        {isListening && transcript && (
          <p className="mt-3 text-gray-700 text-center italic animate-pulse">"{transcript}"</p>
        )}

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>

      {/* Editable text area after speech or as fallback */}
      {(showEditor || !isSupported) && (
        <form onSubmit={handleTextSubmit} className="mt-5">
          <textarea
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            placeholder='e.g., "Two eggs, toast with butter, and a glass of orange juice"'
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-end mt-3 gap-3">
            {showEditor && (
              <button
                type="button"
                onClick={() => {
                  setShowEditor(false);
                  setEditableText("");
                  resetTranscript();
                }}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !editableText.trim()}
              className="px-6 py-2 bg-indigo-500 text-white text-sm font-medium rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Log It"
              )}
            </button>
          </div>
          {submitError && <p className="mt-2 text-sm text-red-500">{submitError}</p>}
        </form>
      )}
    </div>
  );
}
