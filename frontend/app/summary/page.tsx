"use client";

import { useMemo, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { motion } from "framer-motion";

type HabitEntry = {
  date: string;
  text: string;
  status?: string;
};

function inferCategory(text: string): string {
  const t = text.toLowerCase();

  if (
    t.includes("walk") ||
    t.includes("run") ||
    t.includes("steps") ||
    t.includes("workout") ||
    t.includes("gym") ||
    t.includes("yoga")
  ) {
    return "Health";
  }
  if (
    t.includes("read") ||
    t.includes("study") ||
    t.includes("course") ||
    t.includes("learn")
  ) {
    return "Learning";
  }
  if (t.includes("clean") || t.includes("desk") || t.includes("room")) {
    return "Home";
  }
  if (t.includes("meditate") || t.includes("journal")) {
    return "Mindfulness";
  }
  return "Other";
}

function getWeekOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60_000;
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

export default function WeeklySummaryPage() {
  const [history] = useState<HabitEntry[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("ai-habit-history") || "[]"
      ) as HabitEntry[];
    } catch {
      return [];
    }
  });

  const weeklyCounts = useMemo(() => {
    const arr = Array(7).fill(0);
    history.forEach((h) => {
      const d = new Date(h.date).getDay();
      if (!Number.isNaN(d)) arr[d]++;
    });
    return arr;
  }, [history]);

  const weeklyLineData = useMemo(
    () => [
      { label: "Sun", value: weeklyCounts[0] },
      { label: "Mon", value: weeklyCounts[1] },
      { label: "Tue", value: weeklyCounts[2] },
      { label: "Wed", value: weeklyCounts[3] },
      { label: "Thu", value: weeklyCounts[4] },
      { label: "Fri", value: weeklyCounts[5] },
      { label: "Sat", value: weeklyCounts[6] },
    ],
    [weeklyCounts]
  );

  const bestDayIndex = useMemo(
    () =>
      weeklyLineData.reduce(
        (max, item, i, arr) =>
          item.value > arr[max].value ? i : max,
        0
      ),
    [weeklyLineData]
  );

  const radarData = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach((h) => {
      const cat = inferCategory(h.text || "");
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts).map(([category, value]) => ({
      category,
      value,
    }));
  }, [history]);

  const aiAdvice = useMemo(() => {
    const recommendations = [
      "Schedule demanding habits mid-week when energy peaks.",
      "Use micro-habits on weekends to preserve momentum.",
      "Consistency improves faster with smaller daily actions.",
      "Streaks stabilize when habits are friction-free.",
    ];

    const now = new Date();
    const seed = now.getFullYear() * 100 + getWeekOfYear(now);
    return recommendations[seed % recommendations.length];
  }, []);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-950 pt-24 px-6 pb-32 text-white">
        <div className="max-w-5xl mx-auto space-y-14">
          <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xs uppercase tracking-widest text-emerald-300">
              Weekly AI Summary
            </p>
            <h1 className="text-4xl font-bold mt-2">
              Your Weekly Performance
            </h1>
          </motion.header>

          {history.length === 0 && (
            <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 text-center">
              No habits logged yet.
            </div>
          )}

          {history.length > 0 && (
            <>
              <section className="grid md:grid-cols-3 gap-6">
                <MetricCard label="Total Habits" value={history.length} />
                <MetricCard
                  label="Best Day"
                  value={weeklyLineData[bestDayIndex].label}
                />
                <MetricCard
                  label="Top Category"
                  value={
                    radarData.length
                      ? radarData.reduce((a, b) =>
                          b.value > a.value ? b : a
                        ).category
                      : "Balanced"
                  }
                />
              </section>

              <section className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={weeklyLineData}>
                    <XAxis dataKey="label" stroke="#64748b" />
                    <YAxis allowDecimals={false} stroke="#64748b" />
                    <Tooltip />
                    <Line
                      dataKey="value"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </section>

              <section className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <Radar
                        dataKey="value"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-6 rounded-xl bg-slate-900 border border-emerald-500/40">
                  <h2 className="text-xl font-semibold text-emerald-300">
                    AI Recommendation
                  </h2>
                  <p className="text-sm text-slate-300 mt-3">{aiAdvice}</p>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
      <p className="text-xs uppercase text-emerald-300">{label}</p>
      <h2 className="text-2xl font-semibold mt-1">{value}</h2>
    </div>
  );
}
