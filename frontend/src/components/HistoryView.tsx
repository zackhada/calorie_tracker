import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHistory } from "../api";
import type { DailySummary } from "../types";
import DaySummaryCard from "./DaySummaryCard";

export default function HistoryView() {
  const [history, setHistory] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const end = new Date().toISOString().slice(0, 10);
        const start = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const data = await getHistory(start, end);
        setHistory(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">History</h1>
          <p className="text-dark-500 text-sm font-mono mt-1">last 30 days</p>
        </div>
        <Link
          to="/"
          className="px-3 py-1.5 text-xs font-mono text-neon-cyan border border-neon-cyan/20 rounded hover:bg-neon-cyan/10 transition-all"
        >
          &larr; today
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-neon-red font-mono text-sm">{error}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-500 font-mono text-sm">No history yet. Start logging meals.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((day) => (
            <DaySummaryCard key={day.date} summary={day} />
          ))}
        </div>
      )}
    </div>
  );
}
