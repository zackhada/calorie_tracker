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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Today</h1>
        <p className="text-gray-500 mt-1">{formattedDate}</p>
      </div>

      <VoiceInput onMealLogged={handleMealLogged} />

      <div className="mt-8">
        <CalorieProgressBar consumed={summary?.totalCalories ?? 0} />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Meals{meals.length > 0 ? ` (${meals.length})` : ""}
        </h2>
        {mealsLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <MealList meals={meals} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
