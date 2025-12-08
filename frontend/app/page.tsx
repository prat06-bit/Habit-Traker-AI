"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<string | null>(null);
  const [cursorGlow, setCursorGlow] = useState({ x: 0, y: 0 });
  const [navOffset, setNavOffset] = useState(0);


  useEffect(() => {
    const u = localStorage.getItem("ai-habit-user");
    setUser(u);
  }, []);
useEffect(() => {
  const nav = document.querySelector("nav");
  if (nav) {
    const height = nav.getBoundingClientRect().height;
    setNavOffset(height);
  }
}, []);

  return (
    <main
      onMouseMove={(e) => setCursorGlow({ x: e.clientX, y: e.clientY })}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 pt-24 pb-24"
    >
      {/* MINIMAL CURSOR GLOW */}
     <motion.div
  animate={{
    x: cursorGlow.x - 20,
    y: cursorGlow.y - navOffset - 20,
  }}
  transition={{ type: "spring", stiffness: 800, damping: 18 }}
  className="pointer-events-none fixed h-10 w-10 rounded-full 
             bg-[radial-gradient(circle_at_center,rgba(0,255,200,1),rgba(0,200,255,0.8),rgba(0,180,255,0))]
             blur-xl opacity-70 z-40"
/>
      {/* BACKGROUND GLOWS */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 1 }}
          className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-sky-500/25 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.2 }}
          className="absolute right-[-120px] top-40 h-[360px] w-[360px] rounded-full bg-emerald-400/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ duration: 1.4 }}
          className="absolute bottom-[-200px] left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl"
        />
      </div>

      {/* FLOATING PARTICLES */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -12, 0],
            x: [0, 6, 0],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 4 + (i % 4),
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-cyan-300/60"
          style={{
            top: `${(i * 13) % 100}%`,
            left: `${(i * 37) % 100}%`,
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-6">

        {/* HERO */}
        <section className="text-center mt-10 md:mt-16">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.35em] uppercase text-emerald-300/80"
          >
            Your daily discipline, supercharged by AI
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-4 text-4xl md:text-6xl font-extrabold text-sky-50"
          >
            Level Up With Your{" "}
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "200% 50%" }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#38bdf8,#22c55e,#0ea5e9,#38bdf8)] bg-[length:200%_200%]"
            >
              AI Habit Coach
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="mt-4 text-sm md:text-base text-slate-300 max-w-2xl mx-auto"
          >
            Track habits, receive AI-powered insights, and stay consistent with a premium glowing dashboard.
          </motion.p>
        </section>

        {/* ★★★ FEATURE CARDS — NOW AT THE TOP ★★★ */}
        <section className="mt-20">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              href="/breakdown"
              title="Smart Breakdown"
              subtitle="See where your time & habits actually go each week."
              emoji="📊"
            />
            <FeatureCard
              href="/insights"
              title="AI Suggestions"
              subtitle="Personalized strategy powered by lightweight AI."
              emoji="✨"
            />
            <FeatureCard
              href="/history"
              title="History & Trends"
              subtitle="Review streaks, activity, and long-term momentum."
              emoji="📅"
            />
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="mt-24 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-sky-50"
          >
            Why People Choose Habit Tracker AI
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-slate-400 text-sm max-w-xl mx-auto mt-3"
          >
            Our engine helps you stay consistent with glowing visuals, clear analytics,
            and effortless habit tracking.
          </motion.p>

          <div className="grid gap-6 md:grid-cols-3 mt-10">
            <WhyPoint text="AI-powered Analytics" emoji="🤖" />
            <WhyPoint text="Smart Habit Breakdown" emoji="📊" />
            <WhyPoint text="Streak & Momentum Tracking" emoji="🔥" />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mt-24">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-3xl md:text-4xl font-bold text-sky-50"
          >
            Trusted by Consistent People
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center text-sm text-slate-400 max-w-xl mx-auto mt-3"
          >
            Real users improving their routines every day.
          </motion.p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Aarav Sharma",
                quote:
                  "The AI insights feel like a real coach. My streaks doubled in 2 weeks.",
                emoji: "🤝",
              },
              {
                name: "Neha Kapoor",
                quote:
                  "The UI is stunning. The breakdown graphs changed how I plan my week.",
                emoji: "💚",
              },
              {
                name: "Rohan Verma",
                quote:
                  "Everything feels premium — animations, glow effects, and clean dashboard.",
                emoji: "⚡",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="rounded-3xl p-6 bg-slate-950/60 border border-slate-800/60 shadow-lg shadow-black/20 hover:border-emerald-400/40 transition"
              >
                <div className="text-3xl mb-3">{t.emoji}</div>
                <p className="text-sm text-slate-300 leading-relaxed">“{t.quote}”</p>
                <p className="mt-4 text-xs text-emerald-300 font-semibold">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-32 border-t border-slate-800/60 pt-10 pb-6 text-center">
          <div className="flex flex-col gap-2">
            <p className="text-slate-400 text-sm">
              Built with ❤️ using Next.js, TailwindCSS & lightweight AI models.
            </p>

            <div className="flex justify-center gap-6 text-sm mt-2">
              <Link href="/" className="text-slate-400 hover:text-sky-300 transition">
                Home
              </Link>
              <Link href="/dashboard" className="text-slate-400 hover:text-sky-300 transition">
                Dashboard
              </Link>
              <Link href="/insights" className="text-slate-400 hover:text-sky-300 transition">
                Insights
              </Link>
              <Link href="/history" className="text-slate-400 hover:text-sky-300 transition">
                History
              </Link>
            </div>

            <p className="text-xs text-slate-600 mt-4">
              © {new Date().getFullYear()} Habit Tracker AI — All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* COMPONENTS */
function WhyPoint({ text, emoji }: { text: string; emoji: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="rounded-2xl border border-slate-800/70 bg-slate-950/50 py-6 px-5 shadow-md shadow-black/30"
    >
      <div className="text-3xl">{emoji}</div>
      <p className="mt-3 text-slate-200 text-sm font-semibold">{text}</p>
    </motion.div>
  );
}

function FeatureCard({ href, title, subtitle, emoji }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  function handleMove(e: any) {
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
        className="group relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950/60 px-6 py-8 shadow-xl shadow-black/25 cursor-pointer"
      >
        {/* Hover Glow */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
          <div className="absolute -right-16 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        </div>

        <div className="relative">
          <div className="text-4xl mb-3">{emoji}</div>
          <h3 className="text-xl font-semibold text-sky-100">{title}</h3>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">{subtitle}</p>
          <p className="mt-4 text-[12px] font-semibold text-emerald-300">Open {title} →</p>
        </div>
      </motion.div>
    </Link>
  );
}
