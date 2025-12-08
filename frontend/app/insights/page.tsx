"use client";

import { useState } from "react";
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
} from "recharts";

type ChartType = "line" | "bar" | "pie";
type InsightMode = "chart" | "text";

type InsightCard = {
  id: string;
  title: string;
  tag: string;
  description: string;
  impact: string;
  trend: "up" | "down" | "steady";
  mode: InsightMode;
  chartType?: ChartType;
  data?: { label: string; value: number }[];
  bullets?: string[];
};

const PIE_COLORS = ["#22c55e", "#38bdf8", "#6366f1"];

const INSIGHT_CARDS: InsightCard[] = [
  {
    id: "weekend-momentum",
    title: "Weekend Momentum",
    tag: "Consistency",
    description:
      "You tend to complete more habits on weekends. Use this to batch deep work and long tasks.",
    impact: "Use Sunday as your ‘anchor day’ to reset your system.",
    trend: "up",
    mode: "chart",
    chartType: "line",
    data: [
      { label: "Mon", value: 0 },
      { label: "Tue", value: 1 },
      { label: "Wed", value: 1 },
      { label: "Thu", value: 1 },
      { label: "Fri", value: 1 },
      { label: "Sat", value: 2 },
      { label: "Sun", value: 3 },
    ],
  },
  {
    id: "micro-habits",
    title: "Micro Habits Win",
    tag: "Strategy",
    description:
      "Short habits (under 5 minutes) are easiest to repeat and survive the longest.",
    impact: "Convert each habit into a 2-minute version to make it unskippable.",
    trend: "up",
    mode: "chart",
    chartType: "bar",
    data: [
      { label: "Micro", value: 80 },
      { label: "Medium", value: 45 },
      { label: "Heavy", value: 20 },
    ],
  },
  {
    id: "focus-zones",
    title: "Morning Focus Zone",
    tag: "Energy",
    description:
      "Habits done in the first 3 hours of your day have the highest completion rate.",
    impact: "Protect your first 60 minutes from distractions.",
    trend: "up",
    mode: "pie" as InsightMode,
    chartType: "pie",
    data: [
      { label: "Morning", value: 55 },
      { label: "Afternoon", value: 30 },
      { label: "Evening", value: 15 },
    ],
  },
  {
    id: "slump-warning",
    title: "Evening Slump Warning",
    tag: "Fatigue",
    description:
      "Completion drops sharply after 9 PM. Heavy habits here are likely to be skipped.",
    impact: "Move demanding tasks earlier; keep nights for wind-down habits.",
    trend: "down",
    mode: "text",
    bullets: [
      "Shift any hard learning / deep work out of the late evening.",
      "Reserve evenings for soft habits: journaling, reading, stretching.",
      "If you must work late, keep the goal embarrassingly small.",
    ],
  },
  {
    id: "streak-sensitivity",
    title: "Streak Sensitivity",
    tag: "Streaks",
    description:
      "Missing two days in a row is the point where most habits silently die.",
    impact: "Never break the chain twice — use ‘minimum versions’ on busy days.",
    trend: "down",
    mode: "text",
    bullets: [
      "If you miss one day, treat the next day as a ‘must show up’ day.",
      "Track streaks visually; our History page already gives a simple log.",
      "Design a backup plan for travel / exam / crunch weeks.",
    ],
  },
  {
    id: "momentum-score",
    title: "Momentum Score",
    tag: "Overall",
    description:
      "Total habits logged per week is a simple proxy for how active your system is.",
    impact: "Your current volume is enough to build momentum without burnout.",
    trend: "steady",
    mode: "chart",
    chartType: "line",
    data: [
      { label: "Week 1", value: 3 },
      { label: "Week 2", value: 4 },
      { label: "Week 3", value: 5 },
      { label: "Week 4", value: 5 },
    ],
  },
];

function InsightChart({ card }: { card: InsightCard }) {
  if (card.mode !== "chart" || !card.chartType || !card.data) {
    return (
      <div className="flex h-52 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-xs text-slate-500">
        This insight is text-only — use the tips below.
      </div>
    );
  }

  const data = card.data;

  if (card.chartType === "line") {
    return (
      <div className="h-80 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
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
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (card.chartType === "bar") {
    return (
      <div className="h-80 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
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
    <div className="h-80 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie innerRadius={40} outerRadius={85} data={data} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function InsightsPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeCard = INSIGHT_CARDS.find((c) => c.id === activeId) ?? null;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-28 pb-24 px-6">
        <div className="mx-auto max-w-6xl flex flex-col gap-10">
          {/* HEADER */}
          <header className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/70">
              AI Insights
            </p>
            <h1 className="mt-2 text-4xl font-bold text-sky-100">
              Lightweight AI-style coaching on top of your habits.
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              These insights simulate the kind of feedback you’d get from an AI
              coach: what’s working, what’s fragile, and where to push.
            </p>
          </header>

          {/* CARD GRID */}
          <section className="grid gap-6 md:grid-cols-2">
            {INSIGHT_CARDS.map((card) => (
              <button
                key={card.id}
                onClick={() => setActiveId(card.id)}
                className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-left shadow-lg shadow-sky-900/40 transition hover:border-emerald-400 hover:shadow-emerald-400/30"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-sky-400 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-200">
                    {card.tag}
                  </span>
                  <span
                    className={
                      "text-[11px] font-semibold " +
                      (card.trend === "up"
                        ? "text-emerald-300"
                        : card.trend === "down"
                        ? "text-rose-300"
                        : "text-slate-400")
                    }
                  >
                    {card.trend === "up"
                      ? "▲ Positive"
                      : card.trend === "down"
                      ? "▼ Needs work"
                      : "■ Stable"}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-sky-100">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 line-clamp-3">
                  {card.description}
                </p>
                <p className="mt-3 text-xs font-medium text-emerald-300">
                  {card.impact}
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
                    Insight detail
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-sky-100">
                    {activeCard.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {activeCard.description}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-emerald-300">
                    {activeCard.impact}
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
                {(activeCard.mode as InsightMode) === "chart" ? (

                  <InsightChart card={activeCard} />
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
