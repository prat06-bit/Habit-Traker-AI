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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

/* =========================
   TYPES
   ========================= */

type ChartType = "line" | "bar" | "pie";
type Mode = "chart" | "text";

type BreakdownCard = {
  id: string;
  title: string;
  tag: string;
  highlight: string;
  description: string;
  mode: Mode;
  chartType?: ChartType;
  data?: { label: string; value: number }[];
  bullets?: string[];
};

interface HabitEntry {
  text: string;
  date: string;
  status: string;
}

type SummaryState = {
  total: number;
  bestDay: string;
  topCategory: string;
  chartData: { label: string; value: number }[];
  radarData: { category: string; score: number }[];
  heatmap: number[][];
  goalRate: number;
  coaching: string;
};

const PIE_COLORS = ["#22c55e", "#38bdf8", "#6366f1"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* =========================
   STATIC BREAKDOWN CARDS
   ========================= */

const BREAKDOWN_CARDS: BreakdownCard[] = [
  {
    id: "summary-overview",
    title: "Weekly Summary Overview",
    tag: "Summary",
    highlight: "AI-style snapshot of your real habit history.",
    description:
      "See total habits, strongest day, top habit type and your weekly pattern.",
    mode: "chart",
    chartType: "line",
    data: [],
  },
  {
    id: "weekly-completion",
    title: "Weekly Completion",
    tag: "Rhythm",
    highlight: "Sunday is your strongest completion day (demo data).",
    description:
      "Compare how many habits you usually complete on each day of the week.",
    mode: "chart",
    chartType: "line",
    data: [
      { label: "Mon", value: 0 },
      { label: "Tue", value: 1 },
      { label: "Wed", value: 1 },
      { label: "Thu", value: 1 },
      { label: "Fri", value: 1 },
      { label: "Sat", value: 1 },
      { label: "Sun", value: 3 },
    ],
  },
  {
    id: "day-density",
    title: "Habit Density by Day",
    tag: "Load",
    highlight: "Mid-week is currently under-used (demo).",
    description:
      "See which days carry the most habits so you can avoid overload.",
    mode: "chart",
    chartType: "bar",
    data: [
      { label: "Mon", value: 1 },
      { label: "Tue", value: 2 },
      { label: "Wed", value: 1 },
      { label: "Thu", value: 1 },
      { label: "Fri", value: 2 },
      { label: "Sat", value: 3 },
      { label: "Sun", value: 3 },
    ],
  },
  {
    id: "time-of-day",
    title: "Time-of-Day Energy",
    tag: "Energy",
    highlight: "Mornings are your best window (demo).",
    description:
      "Rough split of when you typically complete habits: morning, afternoon or evening.",
    mode: "chart",
    chartType: "pie",
    data: [
      { label: "Morning", value: 50 },
      { label: "Afternoon", value: 30 },
      { label: "Evening", value: 20 },
    ],
  },
  {
    id: "streak-health",
    title: "Streak Health Check",
    tag: "Streaks",
    highlight: "Missing 2+ days quickly kills momentum.",
    description:
      "Short streaks are easier to recover. Long gaps make it harder to restart.",
    mode: "text",
    bullets: [
      "Avoid missing more than 2 days in a row for core habits.",
      "If you miss 2+ days, restart with a tiny version (1 minute, 1 page).",
      "Protect 1–2 keystone habits that keep your routine alive.",
    ],
  },
  {
    id: "overload-watch",
    title: "Overload Watch",
    tag: "Risk",
    highlight: "Too many habits on one day increases drop-off.",
    description:
      "Use this to balance your weekly plan so you don’t burn out on peak days.",
    mode: "text",
    bullets: [
      "Try not to schedule more than 3 demanding habits on the same day.",
      "Stack easy habits on heavy days (e.g. drink water, quick stretch).",
      "Shift big tasks to your historically strong days.",
    ],
  },
  {
    id: "micro-vs-macro",
    title: "Micro vs Macro Habits",
    tag: "Strategy",
    highlight: "Micro-habits keep the system running when life gets messy.",
    description:
      "A mix of tiny and heavier habits keeps you consistent without feeling crushed.",
    mode: "text",
    bullets: [
      "Convert each habit into a 2-minute ‘minimum’ version.",
      "Use micro habits on low-energy days to keep streaks alive.",
      "Use weekends for the longer ‘macro’ versions when you have time.",
    ],
  },
];

/* =========================
   HELPERS
   ========================= */

function detectCategory(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("walk") || t.includes("run") || t.includes("steps"))
    return "Health";
  if (t.includes("read") || t.includes("study") || t.includes("learn"))
    return "Learning";
  if (t.includes("clean") || t.includes("desk") || t.includes("room"))
    return "Home";
  if (t.includes("meditate") || t.includes("mind") || t.includes("breathe"))
    return "Mindfulness";
  return "Other";
}

/* =========================
   CHART COMPONENTS
   ========================= */

function MetricChart({ card }: { card: BreakdownCard }) {
  if (card.mode !== "chart" || !card.chartType || !card.data?.length) {
    return (
      <div className="flex h-52 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-xs text-slate-500">
        No chart data for this card.
      </div>
    );
  }

  const data = card.data;

  if (card.chartType === "line") {
    return (
      <div className="h-80 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="label" stroke="#64748b" />
            <YAxis stroke="#64748b" allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (card.chartType === "bar") {
    return (
      <div className="h-80 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="label" stroke="#64748b" />
            <YAxis stroke="#64748b" allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-80 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie
            innerRadius={40}
            outerRadius={85}
            data={data}
            dataKey="value"
            nameKey="label"
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function SummaryPanel({ summary }: { summary: SummaryState | null }) {
  if (!summary) return null;

  return (
    <div className="space-y-10">
      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/70">
          <p className="text-xs text-emerald-300 uppercase">Total Habits</p>
          <h2 className="text-3xl font-bold text-sky-100">{summary.total}</h2>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/70">
          <p className="text-xs text-emerald-300 uppercase">Strongest Day</p>
          <h2 className="text-3xl font-bold text-sky-100">{summary.bestDay}</h2>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/70">
          <p className="text-xs text-emerald-300 uppercase">Top Habit Type</p>
          <h2 className="text-3xl font-bold text-sky-100">
            {summary.topCategory}
          </h2>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/70">
          <p className="text-xs text-emerald-300 uppercase">Weekly Goal</p>
          <h2 className="text-3xl font-bold text-sky-100">
            {summary.goalRate}%
          </h2>
        </div>
      </div>

      {/* LINE CHART */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-lg font-semibold text-sky-100 mb-3">
          Weekly Activity
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={summary.chartData}>
            <XAxis dataKey="label" stroke="#64748b" />
            <YAxis stroke="#64748b" allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RADAR CHART */}
      {summary.radarData.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-lg font-semibold text-sky-100 mb-3">
            Habit Type Balance
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={summary.radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" stroke="#64748b" />
              <PolarRadiusAxis stroke="#64748b" />
              <Radar
                dataKey="score"
                stroke="#38bdf8"
                fill="#22c55e"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* HEATMAP */}
      {summary.heatmap.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-lg font-semibold text-sky-100 mb-3">
            4-Week Heatmap
          </h3>
          <div className="grid grid-cols-7 gap-1">
            {summary.heatmap.map((week, wIndex) =>
              week.map((val, dIndex) => {
                const intensity = val / 4; // 0–1
                return (
                  <div
                    key={`${wIndex}-${dIndex}`}
                    className="h-7 rounded-md"
                    style={{
                      backgroundColor:
                        intensity <= 0
                          ? "rgba(15,23,42,0.7)"
                          : `rgba(34,197,94,${0.25 + intensity * 0.5})`,
                    }}
                  />
                );
              })
            )}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Columns = days (Sun–Sat), rows = recent weeks.
          </p>
        </div>
      )}

      {/* COACHING */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/40">
        <p className="text-xs text-emerald-300 uppercase mb-1">AI Coaching</p>
        <p className="text-sm text-slate-100">{summary.coaching}</p>
      </div>
    </div>
  );
}

/* =========================
   MAIN PAGE
   ========================= */

export default function BreakdownPage() {
  const [activeId, setActiveId] = useState<string | null>(null);


  const activeCard: BreakdownCard | null =
    BREAKDOWN_CARDS.find((c) => c.id === activeId) ?? null;

  // Load history and compute summary
  

  const summary: SummaryState | null = useMemo(() => {
  let stored: HabitEntry[] = [];

  try {
    const raw = localStorage.getItem("ai-habit-history") || "[]";
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) stored = parsed;
  } catch {
    stored = [];
  }

  if (!stored.length) {
    return {
      total: 0,
      bestDay: "—",
      topCategory: "—",
      chartData: [],
      radarData: [],
      heatmap: [],
      goalRate: 0,
      coaching:
        "Start logging a few tiny habits this week to unlock personalised breakdowns here.",
    };
  }

  const byDay = Array(7).fill(0);
  stored.forEach((h) => {
    const d = new Date(h.date).getDay();
    if (!Number.isNaN(d)) byDay[d]++;
  });

  const chartData = DAY_NAMES.map((label, idx) => ({
    label,
    value: byDay[idx],
  }));

  const bestDay =
    DAY_NAMES[byDay.indexOf(Math.max(...byDay))] ?? "—";

  const categoryCounts: Record<string, number> = {};
  stored.forEach((h) => {
    const cat = detectCategory(h.text || "");
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const radarData = Object.entries(categoryCounts).map(
    ([category, score]) => ({ category, score })
  );

  const topCategory =
    radarData.sort((a, b) => b.score - a.score)[0]?.category || "Other";

  const heatmap: number[][] = [];
  for (let w = 0; w < 4; w++) {
    const row: number[] = [];
    for (let d = 0; d < 7; d++) {
      row.push(
        Math.min(4, Math.round(byDay[d] / Math.max(1, stored.length / 10)))
      );
    }
    heatmap.push(row);
  }

  const goalRate = Math.min(
    100,
    Math.round((stored.length / 7) * 100)
  );

  const coaching =
    goalRate >= 90
      ? "Your consistency is excellent. Use your strongest day to schedule one harder habit this week."
      : goalRate >= 60
      ? "You’re building momentum. Try locking one small habit to the same time every day."
      : "Keep it tiny and easy. One micro-habit per day is enough to restart your streak.";

  return {
    total: stored.length,
    bestDay,
    topCategory,
    chartData,
    radarData,
    heatmap,
    goalRate,
    coaching,
  };
}, []);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-28 pb-24 px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          {/* HEADER */}
          <header className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/70">
              Smart Breakdown
            </p>
            <h1 className="mt-2 text-4xl font-bold text-sky-100">
              Where does your time actually go?
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              Each card runs a small “AI-style” breakdown on your routine: some
              show charts, others give strategy tips.
            </p>
          </header>

          {/* CARDS GRID */}
          <section className="grid gap-6 md:grid-cols-2">
            {BREAKDOWN_CARDS.map((card) => (
              <button
                key={card.id}
                onClick={() => setActiveId(card.id)}
                className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-left shadow-lg shadow-sky-900/40 transition hover:border-emerald-400 hover:shadow-emerald-400/30"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-sky-400 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-200">
                    {card.tag}
                  </span>
                  <span className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                    {card.mode === "chart" ? "View chart" : "View tips"}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-sky-100">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-emerald-300">
                  {card.highlight}
                </p>
                <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                  {card.description}
                </p>
              </button>
            ))}
          </section>

          {/* ACTIVE PANEL */}
          {activeCard && (
            <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl shadow-emerald-500/25 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
                    Breakdown detail
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-sky-100">
                    {activeCard.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {activeCard.description}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-emerald-300">
                    {activeCard.highlight}
                  </p>
                </div>
                <button
                  onClick={() => setActiveId(null)}
                  className="rounded-full border border-slate-700 bg-slate-800 px-4 py-1 text-xs text-slate-300 hover:text-white hover:border-slate-500"
                >
                  Close
                </button>
              </div>

              <div className="mt-6">
                {activeCard.id === "summary-overview" ? (
                  <SummaryPanel summary={summary} />
                ) : activeCard.mode === "chart" ? (
                  <MetricChart card={activeCard} />
                ) : (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
                    <ul className="list-disc space-y-2 pl-5">
                      {activeCard.bullets?.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
