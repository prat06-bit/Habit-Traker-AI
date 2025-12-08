"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full py-6 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-4">
        
        <h1 className="text-2xl font-semibold text-blue-300 tracking-wide">
          AI Habit Tracker
        </h1>

        <div className="flex gap-6 text-blue-200">
          <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
          <Link href="/history" className="hover:text-white transition">History</Link>
          <Link href="/insights" className="hover:text-white transition">Insights</Link>
        </div>

      </nav>
    </header>
  );
}
