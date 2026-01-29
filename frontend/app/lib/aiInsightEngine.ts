// app/lib/aiInsightEngine.ts

import {
  generateAIBreakdown,
  loadHabitHistory,

  type BreakdownPoint,
} from "./aiBreakdownEngine";

export type Insight = {
  id: string;
  title: string;
  tag: string;
  description: string;
  impact: string;
  trend: "up" | "down" | "steady";
  chartType?: "line" | "bar" | "pie";
  chartData?: BreakdownPoint[];
};

export function generateAIInsights(): Insight[] {
  const history = loadHabitHistory();
  const metrics = generateAIBreakdown();

  const totalHabits = history.length;
  const weeklyMetric = metrics.find((m) => m.id === "weekly");
  const volumeMetric = metrics.find((m) => m.id === "volume");
  const streakMetric = metrics.find((m) => m.id === "streak-health");

  const recencyShare =
    volumeMetric?.data && volumeMetric.data[0]
      ? volumeMetric.data[0].value /
        (volumeMetric.data[0].value + volumeMetric.data[1].value || 1)
      : 0;

  const insights: Insight[] = [
    {
      id: "weekend-momentum",
      title: "Weekend Momentum",
      tag: "Consistency",
      description:
        "You tend to cluster more habits on specific days. Use your strongest day to schedule deep work or learning.",
      impact:
        weeklyMetric?.highlight ??
        "Use your high-energy day to batch important tasks.",
      trend: "up",
      chartType: weeklyMetric?.chartType,
      chartData: weeklyMetric?.data,
    },
    {
      id: "recency-health",
      title: "Recency Health",
      tag: "Momentum",
      description:
        "The share of habits in the last 7 days tells you how alive your routine is.",
      impact:
        volumeMetric && volumeMetric.data
          ? `${(recencyShare * 100).toFixed(0)}% of your habits are from the last 7 days.`
          : "Start logging habits to see your recency profile.",
      trend: recencyShare > 0.6 ? "up" : recencyShare < 0.3 ? "down" : "steady",
      chartType: volumeMetric?.chartType,
      chartData: volumeMetric?.data,
    },
    {
      id: "streak-sensitivity",
      title: "Streak Sensitivity",
      tag: "Streaks",
      description:
        "The more unique active days you log, the easier it is to restart after breaks.",
      impact:
        streakMetric?.highlight ??
        "Aim for at least 10 active days in each 2-week window.",
      trend: "steady",
      chartType: streakMetric?.chartType,
      chartData: streakMetric?.data,
    },
    {
      id: "micro-habits",
      title: "Micro Habits Win",
      tag: "Strategy",
      description:
        "Short, low-effort habits are easier to repeat and tend to survive longer.",
      impact:
        totalHabits > 0
          ? `You've logged ${totalHabits} habits. Convert at least one into a 2-minute version to make it unskippable.`
          : "Start by adding one habit you can do in under 2 minutes.",
      trend: "up",
    },
    {
      id: "overload-watch",
      title: "Overload Watch",
      tag: "Energy",
      description:
        "If your log density per active day is too high, it's a sign you may be overloading yourself.",
      impact:
        metrics.find((m) => m.id === "density")?.highlight ??
        "Keep most days under 3 intense habits.",
      trend: "steady",
    },
    {
      id: "momentum-score",
      title: "Momentum Score",
      tag: "Overall",
      description:
        "Total habits logged is a soft proxy for how much you've experimented and practiced.",
      impact:
        totalHabits > 0
          ? `You've experimented with ${totalHabits} logged habits so far.`
          : "Your momentum score will rise as you start logging habits.",
      trend: totalHabits > 10 ? "up" : "steady",
    },
  ];

  return insights;
}
