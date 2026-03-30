import { useState, useEffect, useCallback } from "react";
import type { DailySummary } from "../types";
import { getDailySummary } from "../api";

export function useDailySummary(date: string) {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDailySummary(date);
      setSummary(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch summary");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
}
