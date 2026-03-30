import React from "react";

interface CalorieProgressBarProps {
  consumed: number;
  limit?: number;
}

export default function CalorieProgressBar({ consumed, limit = 2200 }: CalorieProgressBarProps) {
  const percentage = Math.min((consumed / limit) * 100, 100);
  const remaining = limit - consumed;

  let barColor: string;
  let glowClass: string;
  let textColor: string;
  if (consumed > limit) {
    barColor = "bg-neon-red";
    glowClass = "shadow-neon-red";
    textColor = "text-neon-red";
  } else if (consumed >= limit * 0.8) {
    barColor = "bg-neon-amber";
    glowClass = "";
    textColor = "text-neon-amber";
  } else {
    barColor = "bg-neon-green";
    glowClass = "shadow-neon-green";
    textColor = "text-neon-green";
  }

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-dark-500 uppercase tracking-wider">Daily Fuel</span>
        <span className={`text-xs font-mono ${remaining > 0 ? 'text-dark-500' : textColor}`}>
          {remaining > 0 ? `${remaining.toLocaleString()} kcal left` : `+${Math.abs(remaining).toLocaleString()} over`}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-dark-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} ${glowClass} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-3 flex items-baseline justify-center gap-1">
        <span className={`text-3xl font-bold font-mono ${textColor}`}>{consumed.toLocaleString()}</span>
        <span className="text-dark-500 text-sm font-mono">/ {limit.toLocaleString()} kcal</span>
      </div>
    </div>
  );
}
