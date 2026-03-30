import React from "react";
import type { Meal } from "../types";
import MealCard from "./MealCard";

interface MealListProps {
  meals: Meal[];
  onDelete: (id: string) => void;
}

export default function MealList({ meals, onDelete }: MealListProps) {
  if (meals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 border border-dark-600 rounded-lg flex items-center justify-center mx-auto mb-4 bg-dark-800">
          <svg className="w-6 h-6 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-dark-500 font-mono text-sm">No meals logged yet</p>
        <p className="text-dark-600 text-xs font-mono mt-1">record or type to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} onDelete={onDelete} />
      ))}
    </div>
  );
}
