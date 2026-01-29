// achievements.ts

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirementLabel: string;
  currentProgress: number;
  required: number;
};

// ✅ Minimal, correct type for history items
export type HabitHistoryEntry = {
  date: string;
};

export function computeAchievements(
  history: HabitHistoryEntry[]
): Achievement[] {
  const total = history.length;

  // unique days logged
  const activeDays = new Set(
    history.map((item) => new Date(item.date).toDateString())
  ).size;

  // streak calculation
  let streak = 1;
  let maxStreak = 1;

  const sorted = [...history].sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);

    const diff =
      (curr.getTime() - prev.getTime()) / (1000 * 3600 * 24);

    if (diff === 1) streak++;
    else streak = 1;

    maxStreak = Math.max(maxStreak, streak);
  }

  // Logs after 10pm
  const nightLogs = history.filter((h) => {
    const hour = new Date(h.date).getHours();
    return hour >= 22 || hour <= 5;
  }).length;

  // Logs on Sundays
  const sundayLogs = history.filter(
    (h) => new Date(h.date).getDay() === 0
  ).length;

  return [
    {
      id: "starter3",
      title: "3-Day Starter",
      description: "You are beginning to form a habit routine!",
      icon: "🏆",
      unlocked: activeDays >= 3,
      requirementLabel: "Active Days",
      currentProgress: activeDays,
      required: 3,
    },
    {
      id: "heatwave7",
      title: "7-Day Heatwave",
      description: "Maintain a streak for 7 days straight.",
      icon: "🔥",
      unlocked: maxStreak >= 7,
      requirementLabel: "Longest Streak",
      currentProgress: maxStreak,
      required: 7,
    },
    {
      id: "nightowl",
      title: "Night Owl",
      description: "Log habits consistently after 10 PM.",
      icon: "🌙",
      unlocked: nightLogs >= 5,
      requirementLabel: "Late-night habits",
      currentProgress: nightLogs,
      required: 5,
    },
    {
      id: "sunseeker",
      title: "Sun Seeker",
      description: "You frequently log habits on Sundays.",
      icon: "☀️",
      unlocked: sundayLogs >= Math.ceil(total * 0.4),
      requirementLabel: "Sunday logs",
      currentProgress: sundayLogs,
      required: Math.ceil(total * 0.4),
    },
  ];
}
