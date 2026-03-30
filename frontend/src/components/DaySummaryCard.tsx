import React from "react";
import type { DailySummary } from "../types";

interface DaySummaryCardProps {
  summary: DailySummary;
}

export default function DaySummaryCard({ summary }: DaySummaryCardProps) {
  const date = new Date(summary.date + "T00:00:00");
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const isOver = summary.totalCalories > 2200;

  return (
    <div className={`bg-dark-800 rounded-lg p-4 border ${isOver ? "border-neon-red/30" : "border-dark-600"} hover:border-dark-500 transition-colors`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white text-sm">{formattedDate}</h3>
          <p className="text-xs text-dark-500 font-mono mt-0.5">
            {summary.mealCount} {summary.mealCount === 1 ? "meal" : "meals"}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold font-mono ${isOver ? "text-neon-red" : "text-neon-green"}`}>
            {summary.totalCalories.toLocaleString()}
            <span className="text-xs text-dark-500 ml-1">kcal</span>
          </p>
          <div className="flex gap-3 mt-0.5 text-xs text-dark-500 font-mono">
            <span>P:{summary.totalProtein}g</span>
            <span>C:{summary.totalCarbs}g</span>
            <span>F:{summary.totalFat}g</span>
          </div>
        </div>
      </div>
    </div>
  );
}
