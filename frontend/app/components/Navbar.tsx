"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  // ✅ Read localStorage ONLY after mount
  useEffect(() => {
    setMounted(true);
    setUser(localStorage.getItem("ai-habit-user"));
  }, []);

  const logout = () => {
    localStorage.removeItem("ai-habit-user");
    setUser(null);
    router.push("/login");
  };

  const linkClass = (path: string) =>
    pathname === path
      ? "text-emerald-400 font-semibold"
      : "text-slate-300 hover:text-white transition";

  // ⛔ Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-emerald-400"
        >
          <span className="h-9 w-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white">
            💡
          </span>
          Habit Tracker AI
        </Link>

        {/* NAV */}
        <div className="flex items-center gap-6 text-sm">

          {/* ALWAYS VISIBLE */}
          <Link href="/" className={linkClass("/")}>Home</Link>

          {/* PROTECTED LINKS (redirect via AuthGuard) */}
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

          {/* AUTH ACTION */}
          {user ? (
            <button
              onClick={logout}
              className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold"
            >
              Sign In →
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
