// aiInsights.ts

export type HabitHistoryEntry = {
  date: string;
};

export type AIInsight = {
  id: string;
  title: string;
  tag: string;
  description: string;
  impact: string;
  trend: "up" | "down" | "steady";
  detail: string;
};

export function generateAIInsights(
  history: HabitHistoryEntry[]
): AIInsight[] {
  if (!history || history.length === 0) {
    return [];
  }

  return [
    {
      id: "1",
      title: "Morning Productivity Boost",
      tag: "Energy",
      description: "You perform significantly better during morning hours.",
      impact: "+38% consistency in morning habits.",
      trend: "up",
      detail:
        "Your habits show a strong morning bias. Schedule important work between 7–11 AM.",
    },
    {
      id: "2",
      title: "Weekend Momentum",
      tag: "Consistency",
      description: "Weekends show your strongest performance streak.",
      impact: "+22% more completion on Sat–Sun.",
      trend: "up",
      detail:
        "You finish more habits on weekends. Try batching deep work or learning sessions.",
    },
    {
      id: "3",
      title: "Evening Drop-Off",
      tag: "Fatigue",
      description: "Completion rate drops sharply after 9 PM.",
      impact: "-27% compared to daytime.",
      trend: "down",
      detail:
        "Avoid scheduling important habits late at night. Your completion rate drops drastically.",
    },
    {
      id: "4",
      title: "Small Habit Advantage",
      tag: "Strategy",
      description:
        "Tiny habits under 5 minutes show highest long-term completion.",
      impact: "3× better long-term consistency.",
      trend: "steady",
      detail:
        "Short habits help build streaks. Break large habits into micro-steps.",
    },
  ];
}
