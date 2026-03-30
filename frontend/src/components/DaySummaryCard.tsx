import React from "react";
import type { DailySummary } from "../types";

interface DaySummaryCardProps {
  summary: DailySummary;
}

export default function DaySummaryCard({ summary }: DaySummaryCardProps) {
  const date = new Date(summary.date + "T00:00:00");
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const isOver = summary.totalCalories > 2200;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-5 ${isOver ? "border-red-200" : "border-gray-100"}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{formattedDate}</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {summary.mealCount} {summary.mealCount === 1 ? "meal" : "meals"}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold ${isOver ? "text-red-500" : "text-green-600"}`}>
            {summary.totalCalories.toLocaleString()} kcal
          </p>
          <div className="flex gap-3 mt-1 text-xs text-gray-400">
            <span>P: {summary.totalProtein}g</span>
            <span>C: {summary.totalCarbs}g</span>
            <span>F: {summary.totalFat}g</span>
          </div>
        </div>
      </div>
    </div>
  );
}
