// aiDifficulty.ts -------------------------------------------
// Rates habits based on text + completion patterns

export type DifficultyLevel = "easy" | "medium" | "hard";

export function computeHabitDifficulty(name: string): DifficultyLevel {
  const lower = name.toLowerCase();

  // Keywords → difficulty score
  const HARD = ["workout", "run", "meditation 20", "gym", "study 2 hours"];
  const MED = ["read", "clean", "journal", "walk", "yoga"];
  const EASY = ["drink water", "5 min", "stretch"];

  if (HARD.some((kw) => lower.includes(kw))) return "hard";
  if (MED.some((kw) => lower.includes(kw))) return "medium";
  if (EASY.some((kw) => lower.includes(kw))) return "easy";

  // fallback: based on length/complexity
  if (name.length > 25) return "hard";
  if (name.length > 12) return "medium";
  return "easy";
}
