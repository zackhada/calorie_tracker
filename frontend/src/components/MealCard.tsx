import React from "react";
import type { Meal } from "../types";

interface MealCardProps {
  meal: Meal;
  onDelete: (id: string) => void;
}

export default function MealCard({ meal, onDelete }: MealCardProps) {
  const time = new Date(meal.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 text-sm italic mb-2">"{meal.description}"</p>

          <div className="space-y-1">
            {meal.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{item.name}</span>
                <span className="text-gray-400 ml-2 shrink-0">{item.calories} kcal</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">{time}</span>
            <span className="text-lg font-bold text-indigo-600">{meal.totalCalories} kcal</span>
          </div>
        </div>

        <button
          onClick={() => onDelete(meal.id)}
          className="ml-4 p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          title="Remove meal"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
