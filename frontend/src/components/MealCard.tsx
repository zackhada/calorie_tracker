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
    <div className="bg-dark-800 border border-dark-600 rounded-lg p-4 group hover:border-dark-500 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-dark-500 text-xs font-mono mb-2">"{meal.description}"</p>

          <div className="space-y-1.5">
            {meal.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-white/80">{item.name}</span>
                <span className="text-dark-500 ml-2 shrink-0 font-mono text-xs">{item.calories}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-700">
            <span className="text-xs text-dark-500 font-mono">{time}</span>
            <span className="text-lg font-bold font-mono text-neon-cyan">{meal.totalCalories} <span className="text-xs text-dark-500">kcal</span></span>
          </div>
        </div>

        <button
          onClick={() => onDelete(meal.id)}
          className="ml-3 p-1.5 text-dark-600 hover:text-neon-red opacity-0 group-hover:opacity-100 transition-all"
          title="Remove meal"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
