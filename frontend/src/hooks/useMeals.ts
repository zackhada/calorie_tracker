import { useState, useEffect, useCallback } from "react";
import type { Meal } from "../types";
import { getMeals, deleteMeal } from "../api";

export function useMeals(date: string) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMeals(date);
      setMeals(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch meals");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const removeMeal = async (id: string) => {
    try {
      await deleteMeal(id);
      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete meal");
    }
  };

  return { meals, loading, error, refetch: fetchMeals, removeMeal };
}
