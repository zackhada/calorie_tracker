import React from "react";

interface CalorieProgressBarProps {
  consumed: number;
  limit?: number;
}

export default function CalorieProgressBar({ consumed, limit = 2200 }: CalorieProgressBarProps) {
  const percentage = Math.min((consumed / limit) * 100, 100);
  const remaining = limit - consumed;

  let barColor: string;
  let bgColor: string;
  if (consumed > limit) {
    barColor = "bg-red-500";
    bgColor = "bg-red-100";
  } else if (consumed >= limit * 0.8) {
    barColor = "bg-yellow-500";
    bgColor = "bg-yellow-100";
  } else {
    barColor = "bg-green-500";
    bgColor = "bg-green-100";
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">Daily Calories</span>
        <span className="text-sm text-gray-500">
          {remaining > 0 ? `${remaining.toLocaleString()} kcal remaining` : `${Math.abs(remaining).toLocaleString()} kcal over`}
        </span>
      </div>
      <div className={`w-full h-4 rounded-full ${bgColor} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-3 text-center">
        <span className="text-2xl font-bold text-gray-900">{consumed.toLocaleString()}</span>
        <span className="text-gray-400 text-lg"> / {limit.toLocaleString()} kcal</span>
      </p>
    </div>
  );
}
