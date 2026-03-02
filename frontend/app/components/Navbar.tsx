"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isLoggedIn =
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem("ai-habit-user"));

  function logout() {
    localStorage.removeItem("ai-habit-user");
    router.push("/login");
  }

  const linkClass = (path: string) =>
    pathname === path
      ? "text-emerald-400 font-semibold"
      : "text-slate-300 hover:text-white";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 font-bold text-emerald-400">
           Habit Tracker AI
        </Link>

        {}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className={linkClass("/")}>Home</Link>

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

          {!isLoggedIn ? (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-emerald-500 text-slate-900 font-semibold"
            >
              Sign In →
            </Link>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
