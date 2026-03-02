"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import CursorGlow from "../components/CursorGlow";

const points = [
  {
    title: "Clear overview",
    body: "The dashboard shows today's completion, active habits, and your longest streaks so you always know how you're doing at a glance.",
  },
  {
    title: "Smart suggestions",
    body: "Insights help you decide when to schedule deep work, which habits to double down on, and which ones might be draining you.",
  },
  {
    title: "History & trends",
    body: "Review weekly and monthly performance so you can see how your habits change over time instead of only day by day.",
  },
  {
    title: "Built to feel good",
    body: "The interface is clean, glowy, and focused on the few numbers that actually matter – so you want to come back every day.",
  },
];

export default function LearnMorePage() {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 text-slate-50">
      <CursorGlow />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_LEFT,_rgba(56,189,248,0.25),transparent_60%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.35),transparent_55%)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <section>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-balance text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl"
          >
            What is the{" "}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              AI Habit Tracker?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 max-w-3xl text-sm text-slate-300/85 sm:text-base"
          >
            This app helps you build consistent habits using a simple dashboard,
            clean charts, and AI-style suggestions. Track your daily actions,
            understand your patterns, and get nudges on how to improve – without
            feeling overwhelmed.
          </motion.p>
        </section>

        {}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {points.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.07 }}
              className="rounded-3xl border border-slate-800/80 bg-slate-950/70 px-6 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.9)]"
            >
              <h3 className="text-sm font-semibold text-sky-200">
                {point.title}
              </h3>
              <p className="mt-2 text-sm text-slate-300/85">{point.body}</p>
            </motion.div>
          ))}
        </section>

        {}
        <section className="mt-10 flex flex-wrap gap-4">
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 px-7 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.8)]"
            >
              Start tracking habits →
            </motion.button>
          </Link>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-slate-600/80 bg-slate-900/60 px-7 py-2.5 text-sm font-semibold text-slate-100"
            >
              Back to home
            </motion.button>
          </Link>
        </section>
      </div>
    </main>
  );
}
