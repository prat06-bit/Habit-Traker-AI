"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isLoggedIn =
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem("ai-habit-user"));

  const linkClass = (path: string) =>
    pathname === path
      ? "text-emerald-400 font-semibold"
      : "text-slate-300 hover:text-white transition";

  function handleProtectedNav(path: string) {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    router.push(path);
  }

  function logout() {
    localStorage.removeItem("ai-habit-user");
    router.push("/login");
  }

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

        {/* LINKS */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          <button
            onClick={() => handleProtectedNav("/dashboard")}
            className={linkClass("/dashboard")}
          >
            Dashboard
          </button>

          <button
            onClick={() => handleProtectedNav("/breakdown")}
            className={linkClass("/breakdown")}
          >
            Breakdown
          </button>

          <button
            onClick={() => handleProtectedNav("/insights")}
            className={linkClass("/insights")}
          >
            Insights
          </button>

          <button
            onClick={() => handleProtectedNav("/history")}
            className={linkClass("/history")}
          >
            History
          </button>

          {!isLoggedIn ? (
            <Link
              href="/login"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold"
            >
              Sign In →
            </Link>
          ) : (
            <button
              onClick={logout}
              className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
