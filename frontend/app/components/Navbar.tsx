"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [cursorGlow, setCursorGlow] = useState({ x: 0, y: 0 });

  // 🔥 Re-check auth whenever route changes (fixes not updating after login)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = localStorage.getItem("ai-habit-user");
    setUser(u);
  }, [pathname]);

  // Scroll hide/show
  useEffect(() => {
    let lastY = window.scrollY;

    function handleScroll() {
      const currentY = window.scrollY;
      setHidden(currentY > lastY && currentY > 10);
      lastY = currentY;
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("ai-habit-user");
    setUser(null); // update immediately
    router.push("/");
  };

  const linkClass = (path: string) =>
    pathname === path
      ? "text-emerald-400 font-semibold"
      : "text-slate-300 hover:text-white";

  // HABITS button → works only when logged OUT
  const handleHabits = () => {
    if (!user) return router.push("/login");
  };

  return (
    <nav
      onMouseMove={(e) => setCursorGlow({ x: e.clientX, y: e.clientY })}
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Cursor glow */}
      <motion.div
        animate={{ x: cursorGlow.x - 80, y: cursorGlow.y - 80 }}
        className="pointer-events-none fixed h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl opacity-40 -z-10"
      />

      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* LOGO */}
        <Link
          href="/"
          className="relative group flex items-center gap-2 text-xl font-bold text-emerald-400"
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl 
            bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30
            text-white text-lg transition group-hover:scale-110"
          >
            💡
          </span>
          Habit Tracker AI
        </Link>

        {/* NAVIGATION */}
        <div className="flex items-center gap-8 text-sm">
          {/* Always visible */}
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          {/* BEFORE LOGIN → show Habits */}
          {!user && (
            <button
              onClick={handleHabits}
              className="text-slate-300 hover:text-white transition"
            >
              Habits
            </button>
          )}

          {/* AFTER LOGIN → DO NOT show Habits */}
          {user && (
            <>
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link href="/breakdown" className={linkClass("/breakdown")}>
                Breakdown
              </Link>
              <Link href="/insights" className={linkClass("/insights")}>
                Insights
              </Link>
              <Link href="/history" className={linkClass("/history")}>
                History
              </Link>

              <button
                onClick={logout}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 rounded-full text-xs font-semibold text-white shadow-md"
              >
                Sign Out
              </button>
            </>
          )}

          {/* BEFORE LOGIN → Sign In */}
          {!user && (
            <Link
              href="/login"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 
              text-white shadow-md shadow-emerald-500/30 hover:scale-105 transition"
            >
              Sign In →
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
