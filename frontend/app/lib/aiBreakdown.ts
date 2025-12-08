export type HabitEntry = {
  id: string;
  date: string;
  tag: string;
};

export type BreakdownCategory = {
  id: string;
  label: string;
  value: number;
};

export function loadHabitHistory(): HabitEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("habit-history");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function generateBreakdown(): BreakdownCategory[] {
  const history = loadHabitHistory();

  const tagCount: Record<string, number> = {};

  history.forEach((h) => {
    const tag = h.tag || "other";
    tagCount[tag] = (tagCount[tag] || 0) + 1;
  });

  return Object.keys(tagCount).map((tag) => ({
    id: tag,
    label: tag.toUpperCase(),
    value: tagCount[tag],
  }));
}
