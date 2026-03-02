"use client";

import { useEffect, useState, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import AuthGuard from "../components/AuthGuard";
import HabitChart from "../components/HabitChart";
import { computeHabitDifficulty } from "../lib/aiDifficulty";
import {
  computeAchievements,
  type Achievement as RawAchievement,
} from "../lib/achievements";
import {
  fetchHabits,
  addHabitApi,
  type HabitEntry,
} from "../lib/api";

type Tier = "Bronze" | "Silver" | "Gold" | "Diamond";

type AchievementWithMeta = RawAchievement & {
  tier: Tier;
  progressRatio: number;
};

const HABIT_SUGGESTIONS = [
  "Read 10 pages",
  "Meditate for 5 minutes",
  "Walk 5,000 steps",
  "Drink 2,000 ml of water",
  "Write a journal entry",
  "Study for 20 minutes",
  "Clean your desk",
  "Practice gratitude",
];

function computeHabitScore(history: HabitEntry[]) {
  if (history.length === 0) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const lastToday = history.filter((h) => h.date === today).length;

  const streakBonus = Math.min(history.length * 2, 40);
  const volumeBonus = Math.min(history.length, 30);
  const recencyBoost = lastToday * 6;

  return Math.min(streakBonus + volumeBonus + recencyBoost, 100);
}

function ProgressRing({ percentage }: { percentage: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="60" height="60" className="-rotate-90">
      <circle
        cx="30"
        cy="30"
        r={radius}
        stroke="#1e293b"
        strokeWidth="6"
        fill="none"
      />
      <circle
        cx="30"
        cy="30"
        r={radius}
        stroke="#22c55e"
        strokeWidth="6"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700"
      />
    </svg>
  );
}

function StreakFlame({ streak }: { streak: number }) {
  const intensity = Math.min(0.4 + streak * 0.05, 1);

  return (
    <motion.div
      animate={{
        scale: 1 + streak * 0.03,
        boxShadow: `0 0 ${10 + streak * 3}px rgba(251,146,60,${intensity})`,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-400"
    >
      <span className="text-2xl">🔥</span>
    </motion.div>
  );
}

const TIER_INFO: Record<
  Tier,
  { label: string; badgeClass: string; ringGradient: string; chipBg: string }
> = {
  Bronze: {
    label: "Bronze Tier",
    badgeClass: "text-amber-300",
    ringGradient:
      "from-amber-500/60 via-amber-300/50 to-emerald-300/40",
    chipBg: "bg-amber-900/50",
  },
  Silver: {
    label: "Silver Tier",
    badgeClass: "text-slate-100",
    ringGradient:
      "from-slate-300/70 via-slate-100/60 to-cyan-300/50",
    chipBg: "bg-slate-700/60",
  },
  Gold: {
    label: "Gold Tier",
    badgeClass: "text-yellow-300",
    ringGradient:
      "from-yellow-400/80 via-amber-300/70 to-emerald-300/60",
    chipBg: "bg-yellow-900/40",
  },
  Diamond: {
    label: "Diamond Tier",
    badgeClass: "text-cyan-200",
    ringGradient:
      "from-cyan-400/80 via-emerald-300/80 to-sky-400/70",
    chipBg: "bg-cyan-900/40",
  },
};

function autoTierForAchievement(a: RawAchievement): Tier {
  if (a.id === "heatwave7") return "Gold";
  if (a.id === "nightowl" || a.id === "sunseeker") return "Silver";
  if (a.id === "starter3") return "Bronze";
  return "Diamond";
}

function AchievementCard({
  achievement,
  onClick,
}: {
  achievement: AchievementWithMeta;
  onClick: () => void;
}) {
  const { tier } = achievement;
  const tierInfo = TIER_INFO[tier];

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-40, 40], [12, -12]);
  const rotateY = useTransform(x, [-40, 40], [-12, 12]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(offsetX);
    y.set(offsetY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY }}
      whileHover={{ scale: 1.06, y: -4 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`cursor-pointer relative p-[1px] rounded-2xl ${
        achievement.unlocked
          ? "bg-gradient-to-br from-emerald-400/70 via-cyan-400/50 to-sky-400/50 shadow-emerald-400/40 shadow-lg"
          : "bg-slate-800/80 border border-slate-700/70"
      }`}
    >
      <div
        className={`rounded-2xl h-full w-full bg-slate-950/90 ${
          achievement.unlocked
            ? "border border-emerald-300/40"
            : "border border-slate-700/70"
        } px-4 py-4 flex flex-col gap-2`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`h-10 w-10 rounded-full bg-gradient-to-br ${tierInfo.ringGradient} flex items-center justify-center shadow-md`}
          >
            <span className="text-2xl">{achievement.icon}</span>
          </div>

          <span
            className={`text-[10px] px-2 py-1 rounded-full border ${
              achievement.unlocked
                ? "border-emerald-300/60"
                : "border-slate-600/80"
            } ${tierInfo.chipBg} ${tierInfo.badgeClass} font-semibold tracking-wide uppercase`}
          >
            {tierInfo.label}
          </span>
        </div>

        <p
          className={`font-semibold text-sm mt-1 ${
            achievement.unlocked ? "text-emerald-200" : "text-slate-300"
          }`}
        >
          {achievement.title}
        </p>

        <p className="text-[11px] text-slate-400 leading-snug">
          {achievement.description}
        </p>

        {!achievement.unlocked && (
          <p className="text-[10px] text-slate-500 mt-1">
            Unlock hint: check the achievement card for more details →
          </p>
        )}

        {achievement.unlocked && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] text-emerald-300 font-semibold mt-1 flex items-center gap-1"
          >
            <span>✓</span> Unlocked
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [input, setInput] = useState("");
  const [todayHabits, setTodayHabits] = useState<HabitEntry[]>([]);
  const [allHistory, setAllHistory] = useState<HabitEntry[]>([]);
  const [selectedAchievement, setSelectedAchievement] =
    useState<AchievementWithMeta | null>(null);

  useEffect(() => {
    (async () => {
      const stored = await fetchHabits();
      setAllHistory(stored);

      const today = new Date().toISOString().slice(0, 10);
      setTodayHabits(stored.filter((h) => h.date === today));
    })();
  }, []);

  const aiScore = useMemo(
    () => computeHabitScore(allHistory),
    [allHistory]
  );

  const achievements: AchievementWithMeta[] = useMemo(() => {
    const base = computeAchievements(allHistory);
    return base.map((a) => ({
      ...a,
      tier: autoTierForAchievement(a),
      progressRatio: a.unlocked ? 1 : 0,
    }));
  }, [allHistory]);

  function addHabit() {
    if (!input.trim()) return;

    const newHabit: HabitEntry = {
  text: input.trim(),
  date: new Date().toISOString().slice(0, 10),
  status: "pending", // ✅ VALID
};

    const updated = [...allHistory, newHabit];
    setAllHistory(updated);
    setTodayHabits((prev) => [...prev, newHabit]);
    setInput("");

    void addHabitApi(newHabit);
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 pt-28 pb-28">
        <div className="max-w-6xl mx-auto flex flex-col gap-14">
          {/* HEADER + AI SCORE */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
                Dashboard
              </p>
              <h1 className="text-4xl font-bold text-sky-100">
                Your Daily Discipline Hub
              </h1>
              <p className="text-slate-400 text-sm max-w-xl mt-1">
                Build streaks, log habits, and track your weekly
                progress.
              </p>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center bg-slate-900/60 border border-slate-700 px-5 py-4 rounded-2xl shadow-xl"
            >
              <StreakFlame streak={todayHabits.length} />
              <p className="text-xs uppercase tracking-wide text-slate-400 mt-2">
                AI Habit Score
              </p>
              <p className="text-3xl font-bold text-emerald-400">
                {aiScore}
              </p>
            </motion.div>
          </div>

          {/* ADD HABIT */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-sky-900/40">
            <h2 className="text-xl font-semibold text-sky-100 mb-2">
              Add a Habit
            </h2>

            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addHabit()}
                placeholder="e.g. Read 10 pages..."
                className="flex-1 rounded-xl bg-slate-900/70 border border-slate-700 px-4 py-2 text-slate-200"
              />
              <button
                onClick={addHabit}
                className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-400 px-6 py-2 text-slate-900 font-semibold shadow-lg"
              >
                Add
              </button>
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              {HABIT_SUGGESTIONS.map((s, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setInput(s)}
                  className="px-3 py-1.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:border-emerald-400 hover:text-emerald-300 transition"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </section>

          {/* TODAY HABITS */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
            <div className="flex justify-between mb-3">
              <h2 className="text-xl font-semibold text-sky-100">
                Today’s Habits
              </h2>
              <span className="text-emerald-300 text-sm">
                {todayHabits.length} logged
              </span>
            </div>

            {todayHabits.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No habits yet. Add one above to start your streak.
              </p>
            ) : (
              <ul className="space-y-3">
                {todayHabits.map((habit, i) => (
                  <li
                    key={`${habit.date}-${habit.text}-${i}`}
                    className="flex justify-between items-center rounded-xl bg-slate-900/70 border border-slate-800 px-4 py-2"
                  >
                    <span className="text-slate-200">{habit.text}</span>

                    <span className="text-xs px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                      {computeHabitDifficulty(habit.text)}
                    </span>

                    <ProgressRing percentage={aiScore} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* WEEKLY CHART */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-emerald-500/20">
            <h2 className="text-xl font-semibold text-sky-100 mb-2">
              Weekly Habit Completion
            </h2>
            <HabitChart />
          </section>

          {/* ACHIEVEMENTS */}
          <section>
            <h2 className="text-xl font-semibold text-sky-100 mb-3">
              Achievements
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {achievements.map((a) => (
                <AchievementCard
                  key={a.id}
                  achievement={a}
                  onClick={() => setSelectedAchievement(a)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* MODAL CELEBRATION */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 10 }}
                transition={{
                  type: "spring",
                  stiffness: 160,
                  damping: 18,
                }}
                className="relative w-[92%] max-w-md rounded-3xl bg-slate-950/95 border border-emerald-400/50 shadow-emerald-500/40 shadow-2xl p-6 overflow-hidden"
              >
                <div className="pointer-events-none absolute -top-24 -left-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-10 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />

                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-100 text-sm"
                >
                  ✕
                </button>

                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.8, rotate: -6 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-400 shadow-lg shadow-emerald-400/50"
                  >
                    <span className="text-3xl">
                      {selectedAchievement.icon}
                    </span>
                  </motion.div>

                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                    {TIER_INFO[selectedAchievement.tier].label}
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-sky-50">
                    {selectedAchievement.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-300">
                    {selectedAchievement.description}
                  </p>

                  {selectedAchievement.unlocked ? (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-emerald-300 text-sm font-semibold flex items-center gap-2"
                    >
                      <span>🎉</span> You’ve unlocked this achievement!
                    </motion.p>
                  ) : (
                    <p className="mt-3 text-slate-400 text-xs">
                      You haven’t unlocked this yet. Keep logging habits
                      and stay consistent to unlock it.
                    </p>
                  )}

                  <div className="mt-4">
                    <div className="w-full bg-slate-800/80 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: selectedAchievement.unlocked
                            ? "100%"
                            : `${
                                selectedAchievement.progressRatio *
                                100
                              }%`,
                        }}
                        className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(45,212,191,0.7)]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </AuthGuard>
  );
}
