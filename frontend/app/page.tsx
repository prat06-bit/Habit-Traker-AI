"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

type FeatureCardProps = {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
};

export default function HomePage() {
  const [cursorGlow, setCursorGlow] = useState({ x: 0, y: 0 });

  return (
    <main
      onMouseMove={(e) =>
        setCursorGlow({ x: e.clientX, y: e.clientY })
      }
      className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-28 pb-28"
    >
      {}
      <motion.div
        animate={{
          x: cursorGlow.x - 20,
          y: cursorGlow.y - 20,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 18 }}
        className="pointer-events-none fixed h-10 w-10 rounded-full 
                   bg-[radial-gradient(circle_at_center,rgba(0,255,200,1),rgba(0,200,255,0.8),rgba(0,180,255,0))]
                   blur-xl opacity-70 z-40"
      />

      <div className="mx-auto max-w-6xl px-6">
        {}
        <section className="text-center">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] tracking-[0.35em] uppercase text-emerald-300/80"
          >
            AI-powered habit analytics
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-4 text-4xl md:text-6xl font-extrabold text-sky-50"
          >
            Build Consistent Habits With{" "}
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "200% 50%" }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="text-transparent bg-clip-text 
                         bg-[linear-gradient(90deg,#38bdf8,#22c55e,#0ea5e9,#38bdf8)]
                         bg-[length:200%_200%]"
            >
              Intelligent Feedback
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-sm md:text-base text-slate-300 leading-relaxed"
          >
            Track daily habits, visualize behavioral patterns, and receive AI-driven
            insights that help you improve consistency over time — not just log data.
          </motion.p>
        </section>

        {}
        <section className="mt-20">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              href="/breakdown"
              emoji="📊"
              title="Smart Breakdown"
              subtitle="Behavioral Analytics"
              description="Visualize how your habits distribute across days and weeks. Identify overload, gaps, and patterns that affect long-term consistency."
            />

            <FeatureCard
              href="/insights"
              emoji="✨"
              title="AI Suggestions"
              subtitle="Actionable Feedback"
              description="Lightweight AI analyzes your habit history to suggest when to simplify, scale, or restructure your routine."
            />

            <FeatureCard
              href="/history"
              emoji="📅"
              title="History & Trends"
              subtitle="Long-Term Clarity"
              description="Explore streaks and historical trends to understand what actually sustains progress over time."
            />
          </div>

          {}
          <p className="mt-10 text-center text-xs text-slate-400">
            Designed to help users make better decisions from their data — not just record it.
          </p>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  href,
  title,
  subtitle,
  description,
  emoji,
}: FeatureCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  function handleMove(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  return (
    <Link href={href}>
      <motion.div
        onMouseMove={handleMove}
        style={{ rotateX, rotateY }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="group relative cursor-pointer overflow-hidden rounded-3xl
                   border border-slate-800/70 bg-slate-950/60 px-6 py-8
                   shadow-xl shadow-black/30"
      >
        <div className="text-4xl mb-3">{emoji}</div>

        <h3 className="text-xl font-semibold text-sky-100">
          {title}
        </h3>

        <p className="mt-1 text-xs uppercase tracking-wide text-emerald-300/80">
          {subtitle}
        </p>

        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          {description}
        </p>

        <p className="mt-5 text-[12px] font-semibold text-emerald-300">
          Open {title} →
        </p>
      </motion.div>
    </Link>
  );
}
