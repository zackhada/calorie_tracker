import React from "react";
import VoiceInput from "./VoiceInput";
import CalorieProgressBar from "./CalorieProgressBar";
import MealList from "./MealList";
import { useMeals } from "../hooks/useMeals";
import { useDailySummary } from "../hooks/useDailySummary";

export default function Dashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const { meals, loading: mealsLoading, removeMeal, refetch: refetchMeals } = useMeals(today);
  const { summary, refetch: refetchSummary } = useDailySummary(today);

  const handleMealLogged = () => {
    refetchMeals();
    refetchSummary();
  };

  const handleDelete = async (id: string) => {
    await removeMeal(id);
    refetchSummary();
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Today</h1>
        <p className="text-dark-500 text-sm font-mono mt-1">{formattedDate}</p>
      </div>

      <VoiceInput onMealLogged={handleMealLogged} />

      <div className="mt-6">
        <CalorieProgressBar consumed={summary?.totalCalories ?? 0} />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono text-dark-500 uppercase tracking-wider">
            Meals{meals.length > 0 ? ` [${meals.length}]` : ""}
          </h2>
        </div>
        {mealsLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <MealList meals={meals} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
