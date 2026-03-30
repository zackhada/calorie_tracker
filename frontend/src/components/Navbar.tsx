import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-600">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link to="/" className="text-lg font-bold text-white tracking-tight">
            FUEL<span className="text-neon-cyan">_</span>
          </Link>
          <div className="flex items-center gap-0.5">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded text-sm font-medium font-mono transition-all ${
                location.pathname === "/"
                  ? "text-neon-cyan bg-neon-cyan/10"
                  : "text-dark-500 hover:text-white"
              }`}
            >
              today
            </Link>
            <Link
              to="/history"
              className={`px-3 py-1.5 rounded text-sm font-medium font-mono transition-all ${
                location.pathname === "/history"
                  ? "text-neon-cyan bg-neon-cyan/10"
                  : "text-dark-500 hover:text-white"
              }`}
            >
              history
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="w-7 h-7 rounded border border-dark-600"
              referrerPolicy="no-referrer"
            />
          )}
          <span className="text-sm text-dark-500 hidden sm:inline font-mono">
            {user?.displayName?.split(" ")[0]?.toLowerCase()}
          </span>
          <button
            onClick={signOut}
            className="text-xs text-dark-500 hover:text-neon-red transition-colors ml-1 font-mono"
          >
            [exit]
          </button>
        </div>
      </div>
    </nav>
  );
}
