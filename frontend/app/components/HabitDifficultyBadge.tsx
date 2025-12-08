import React from "react";
import { DifficultyLevel } from "../lib/aiDifficulty";

export default function HabitDifficultyBadge({ level }: { level: DifficultyLevel }) {
  const color =
    level === "easy"
      ? "text-emerald-300 bg-emerald-500/10 border-emerald-400/40"
      : level === "medium"
      ? "text-yellow-300 bg-yellow-500/10 border-yellow-400/40"
      : "text-rose-300 bg-rose-500/10 border-rose-400/40";

  return (
    <span
      className={`px-3 py-1 border rounded-full text-xs font-semibold ${color}`}
    >
      {level.toUpperCase()}
    </span>
  );
}
