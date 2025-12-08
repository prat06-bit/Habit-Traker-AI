export type HabitEntry = {
  id: string;
  date: string;
  tag: string;
};

export type BreakdownPoint = {
  label: string;
  value: number;
};

export type BreakdownMetric = {
  id: string;
  title: string;
  highlight: string;
  chartType: "line" | "bar" | "pie";
  data: BreakdownPoint[];
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

export function generateAIBreakdown(): BreakdownMetric[] {
  const history = loadHabitHistory();

  const dailyCount: Record<string, number> = {};
  history.forEach((h) => {
    const d = h.date.split("T")[0];
    dailyCount[d] = (dailyCount[d] || 0) + 1;
  });

  const days = Object.keys(dailyCount).sort();
  const counts = days.map((d) => dailyCount[d]);

  const total = counts.reduce((a, b) => a + b, 0);
  const last7 = counts.slice(-7).reduce((a, b) => a + b, 0);
  const older = total - last7;

  return [
    {
      id: "weekly",
      title: "Weekly Activity",
      highlight: "Shows your most active days.",
      chartType: "bar",
      data: days.map((d, i) => ({ label: d, value: counts[i] })),
    },
    {
      id: "volume",
      title: "Recency Volume",
      highlight:
        last7 > older
          ? "Your recent activity is rising!"
          : "Try logging more habits this week.",
      chartType: "pie",
      data: [
        { label: "Last 7 Days", value: last7 },
        { label: "Older", value: older },
      ],
    },
    {
      id: "streak-health",
      title: "Streak Health",
      highlight:
        days.length > 10
          ? "You have many active days — good streak health!"
          : "Build more consecutive activity days.",
      chartType: "line",
      data: days.map((d, i) => ({ label: d, value: counts[i] })),
    },
    {
      id: "density",
      title: "Habit Density",
      highlight:
        counts.some((v) => v > 3)
          ? "Some days look overloaded."
          : "Your workload looks balanced.",
      chartType: "bar",
      data: days.map((d, i) => ({ label: d, value: counts[i] })),
    },
  ];
}
