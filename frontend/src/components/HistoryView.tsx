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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
          <p className="text-gray-500 mt-1">Last 30 days</p>
        </div>
        <Link
          to="/"
          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          Back to Today
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No history yet. Start logging your meals!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((day) => (
            <DaySummaryCard key={day.date} summary={day} />
          ))}
        </div>
      )}
    </div>
  );
}
