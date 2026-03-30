import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-dark-800 border border-dark-600 rounded-lg p-10 max-w-md w-full mx-4 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 border border-neon-cyan/30 rounded-lg flex items-center justify-center mx-auto mb-5 bg-dark-700">
            <svg className="w-8 h-8 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            FUEL<span className="text-neon-cyan">_</span>
          </h1>
          <p className="text-dark-500 text-sm font-mono mt-2 tracking-wide">
            // voice-powered calorie tracking
          </p>
        </div>

        <button
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 bg-dark-700 border border-dark-500 rounded-lg px-6 py-3.5 text-white font-medium hover:border-neon-cyan/40 hover:shadow-neon-cyan transition-all duration-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>

        <p className="mt-6 text-xs text-dark-500 font-mono">
          &gt; speak what you ate. we handle the rest.
        </p>
      </div>
    </div>
  );
}
