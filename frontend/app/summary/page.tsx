"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import { computeAchievements } from "../lib/achievements";
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

// --- helpers ----------------------------------------------------

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
    t.includes("learn") ||
    t.includes("assignment")
  ) {
    return "Learning";
  }
  if (
    t.includes("clean") ||
    t.includes("desk") ||
    t.includes("room") ||
    t.includes("organize")
  ) {
    return "Home";
  }
  if (
    t.includes("meditate") ||
    t.includes("mind") ||
    t.includes("journal") ||
    t.includes("gratitude")
  ) {
    return "Mindfulness";
  }
  return "Other";
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// last N days including today
function getLastNDates(n: number): string[] {
  const today = new Date();
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export default function WeeklySummaryPage() {
  const [history, setHistory] = useState<HabitEntry[]>([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("ai-habit-history") || "[]"
    );
    setHistory(stored);
  }, []);

  // ------------------------
  // BASIC WEEKLY DATA
  // ------------------------

  const byDay = Array(7).fill(0);
  history.forEach((h) => {
    const day = new Date(h.date).getDay();
    byDay[day] += 1;
  });

  const weeklyLineData = [
    { label: "Sun", value: byDay[0] },
    { label: "Mon", value: byDay[1] },
    { label: "Tue", value: byDay[2] },
    { label: "Wed", value: byDay[3] },
    { label: "Thu", value: byDay[4] },
    { label: "Fri", value: byDay[5] },
    { label: "Sat", value: byDay[6] },
  ];

  const achievements = computeAchievements(history);

  const bestDayIndex = weeklyLineData.reduce(
    (maxIdx, item, idx, arr) =>
      item.value > arr[maxIdx].value ? idx : maxIdx,
    0
  );

  // ------------------------
  // HEATMAP (last 28 days)
  // ------------------------

  const last28 = getLastNDates(28);
  const historyCountByDate: Record<string, number> = {};
  history.forEach((h) => {
    if (!historyCountByDate[h.date]) historyCountByDate[h.date] = 0;
    historyCountByDate[h.date] += 1;
  });

  const heatmapData = last28.map((d) => ({
    date: d,
    value: historyCountByDate[d] || 0,
  }));

  // group heatmap into weeks of 7
  const heatmapWeeks: typeof heatmapData[] = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    heatmapWeeks.push(heatmapData.slice(i, i + 7));
  }

  const intensityClass = (value: number) => {
    if (value === 0) return "bg-slate-800/80";
    if (value === 1) return "bg-emerald-900";
    if (value === 2) return "bg-emerald-700";
    if (value === 3) return "bg-emerald-500";
    return "bg-emerald-400";
  };

  // ------------------------
  // RADAR CHART (inferred categories)
  // ------------------------

  const categoryCounts: Record<string, number> = {};
  history.forEach((h) => {
    const cat = inferCategory(h.text || "");
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const radarData = Object.entries(categoryCounts).map(([category, value]) => ({
    category,
    value,
  }));

  const topCategory =
    radarData.length > 0
      ? radarData.reduce((a, b) => (b.value > a.value ? b : a)).category
      : null;

  // ------------------------
  // AI-like WEEKLY GOAL
  // ------------------------

  let weeklyGoal = "Log at least one habit every day this week to unlock your first momentum badge.";

  if (history.length > 0 && topCategory) {
    const bestDayLabel = weeklyLineData[bestDayIndex].label;
    const target = Math.max(3, Math.min(10, Math.round(history.length / 2)));

    weeklyGoal = `Anchor your week around ${bestDayLabel}. Aim to complete at least ${target} "${topCategory}" habits this week, and keep ${bestDayLabel} as your high-energy day for harder tasks.`;
  }

  const recommendations = [
    "Your energy spikes mid-week — try batching heavier tasks on Wed/Thu.",
    "Low activity on weekends — consider light micro-habits instead of full sessions.",
    "Momentum is improving — keep habits short and friction-free.",
    "Your streak trend is stabilizing — introduce one new micro-habit this week.",
  ];

  const randomAdvice =
    recommendations[Math.floor(Math.random() * recommendations.length)];

  // ------------------------
  // UI
  // ------------------------

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] pt-24 px-6 pb-32 text-white">
        <div className="max-w-5xl mx-auto space-y-14">
          {/* HEADER */}
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
              Weekly AI Summary
            </p>
            <h1 className="text-4xl font-bold mt-2 text-sky-100">
              Your Weekly Performance Report
            </h1>
            <p className="text-slate-400 mt-2">
              Auto-generated insights based on your Habit Tracker AI history.
            </p>
          </motion.header>

          {/* EMPTY STATE */}
          {history.length === 0 && (
            <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-slate-300 text-sm">
                No tracked habits yet. Start logging habits on the dashboard to
                view weekly insights, heatmaps, and AI recommendations here.
              </p>
            </div>
          )}

          {history.length > 0 && (
            <>
              {/* METRIC CARDS */}
              <section className="grid md:grid-cols-3 gap-6">
                <MetricCard
                  label="Total Habits Logged"
                  value={history.length}
                />
                <MetricCard
                  label="Strongest Day"
                  value={weeklyLineData[bestDayIndex].label}
                />
                <MetricCard
                  label="Top Habit Type"
                  value={topCategory || "Balanced"}
                />
              </section>

              {/* WEEKLY LINE CHART */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-xl shadow-emerald-600/10"
              >
                <h2 className="text-xl font-semibold text-sky-100 mb-4">
                  Weekly Activity Chart
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={weeklyLineData}>
                    <XAxis dataKey="label" stroke="#64748b" />
                    <YAxis stroke="#64748b" allowDecimals={false} />
                    <Tooltip />
                    <defs>
                      <linearGradient
                        id="weeklyStroke"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                      </linearGradient>
                    </defs>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="url(#weeklyStroke)"
                      strokeWidth={3}
                      dot={{ r: 5, stroke: "#22c55e", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.section>

              {/* HEATMAP */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80"
              >
                <h2 className="text-xl font-semibold text-sky-100 mb-3">
                  Activity Heatmap (Last 4 Weeks)
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  Darker squares = more habits completed on that day.
                </p>

                <div className="flex gap-2 overflow-x-auto">
                  {heatmapWeeks.map((week, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      {week.map((cell) => (
                        <div
                          key={cell.date}
                          className={`h-4 w-4 rounded-[4px] ${intensityClass(
                            cell.value
                          )} transition`}
                          title={`${formatShortDate(cell.date)} • ${
                            cell.value
                          } habit${cell.value === 1 ? "" : "s"}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* RADAR + WEEKLY GOAL */}
              <section className="grid md:grid-cols-2 gap-6">
                {/* RADAR CHART */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80"
                >
                  <h2 className="text-xl font-semibold text-sky-100 mb-4">
                    Habit Type Balance
                  </h2>
                  {radarData.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      Not enough data yet to build a balance chart.
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#1f2937" />
                        <PolarAngleAxis
                          dataKey="category"
                          stroke="#94a3b8"
                          tick={{ fontSize: 11 }}
                        />
                        <Radar
                          dataKey="value"
                          stroke="#22c55e"
                          fill="#22c55e"
                          fillOpacity={0.4}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  )}
                </motion.div>

                {/* WEEKLY GOAL CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/40 shadow-md shadow-emerald-500/20"
                >
                  <h2 className="text-xl font-semibold text-emerald-300">
                    Weekly Goal
                  </h2>
                  <p className="text-slate-300 mt-3 text-sm leading-relaxed">
                    {weeklyGoal}
                  </p>
                </motion.div>
              </section>

              {/* ACHIEVEMENTS */}
              <section>
                <h2 className="text-xl font-semibold text-sky-100 mb-4">
                  Achievements Unlocked
                </h2>
                <div className="grid md:grid-cols-4 gap-4">
                  {achievements.map((a: any) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className={`p-4 rounded-xl border ${
                        a.unlocked
                          ? "border-emerald-400/40 bg-emerald-500/10 shadow-md shadow-emerald-500/20"
                          : "border-slate-700/60 bg-slate-900/40"
                      }`}
                    >
                      <div className="text-3xl">{a.icon}</div>
                      <p className="font-semibold text-sky-100 mt-2">
                        {a.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {a.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* AI ADVICE */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-emerald-500/20 shadow-md"
              >
                <h2 className="text-xl font-semibold text-sky-100">
                  AI Recommendation
                </h2>
                <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                  {randomAdvice}
                </p>
              </motion.section>
            </>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}

// ----------------------------
// METRIC CARD COMPONENT
// ----------------------------

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-lg shadow-black/20"
    >
      <p className="text-emerald-300 text-xs uppercase">{label}</p>
      <h2 className="text-2xl font-semibold mt-1 text-sky-100">{value}</h2>
    </motion.div>
  );
}
