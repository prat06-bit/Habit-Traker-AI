"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function NavbarDashboard() {
  const router = useRouter();
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const logout = () => {
    localStorage.removeItem("ai-habit-user");
    router.push("/");
  };

  return (
    <nav
      onMouseMove={(e) =>
        setCursorPos({ x: e.clientX - 80, y: e.clientY - 80 })
      }
      className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-slate-800 shadow-lg"
    >
      {/* Cursor glow */}
      <motion.div
        animate={{ x: cursorPos.x, y: cursorPos.y }}
        className="pointer-events-none fixed h-40 w-40 bg-sky-400/20 blur-3xl rounded-full opacity-40"
      />

      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo / Dashboard text */}
        <Link
          href="/dashboard"
          className="text-xl font-bold text-emerald-400 flex items-center gap-2"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-md shadow-emerald-500/30 text-white">
            📊
          </span>
          Dashboard
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/breakdown" className="hover:text-white text-slate-300">
            Breakdown
          </Link>

          <Link href="/insights" className="hover:text-white text-slate-300">
            Insights
          </Link>

          <Link href="/history" className="hover:text-white text-slate-300">
            History
          </Link>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 hover:bg-red-400 rounded-full text-white text-xs font-semibold shadow-md"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
