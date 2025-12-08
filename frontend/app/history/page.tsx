"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthGuard from "../components/AuthGuard";
import { Trash2, ArrowUpDown } from "lucide-react";
import {
  fetchHabits,
  overwriteHabitsApi,
  type HabitEntry,
} from "../lib/api";

// ---------------------------------------------------------
// GROUPING FUNCTION
// ---------------------------------------------------------
function groupByDate(entries: HabitEntry[]) {
  const groups: Record<string, HabitEntry[]> = {
    Today: [],
    Yesterday: [],
    "Last 7 Days": [],
    Older: [],
  };

  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  entries.forEach((entry) => {
    const entryDate = new Date(entry.date);
    const diff = today.getTime() - entryDate.getTime();

    const isSameDay =
      entryDate.getDate() === today.getDate() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isSameAsYesterday =
      entryDate.getDate() === yesterday.getDate() &&
      entryDate.getMonth() === yesterday.getMonth() &&
      entryDate.getFullYear() === yesterday.getFullYear();

    if (isSameDay) {
      groups["Today"].push(entry);
    } else if (isSameAsYesterday) {
      groups["Yesterday"].push(entry);
    } else if (diff < 7 * oneDay) {
      groups["Last 7 Days"].push(entry);
    } else {
      groups["Older"].push(entry);
    }
  });

  return groups;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HabitEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  // ---------------------------------------------------------
  // LOAD HISTORY (from backend, fallback to local)
  // ---------------------------------------------------------
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const stored = await fetchHabits();
        // underlying file is stored oldest->newest
        const display = sortNewestFirst
          ? stored.slice().reverse()
          : stored.slice();
        setHistory(display);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    })();
    // only on first mount; sort toggle is handled locally
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------
  // DELETE ENTRY (also sync backend)
  // ---------------------------------------------------------
  const deleteEntry = async (index: number) => {
    const updatedDisplay = history.filter((_, i) => i !== index);
    setHistory(updatedDisplay);

    // Convert back to canonical order (oldest -> newest) for storage
    const canonical = sortNewestFirst
      ? updatedDisplay.slice().reverse()
      : updatedDisplay.slice();

    await overwriteHabitsApi(canonical);
  };

  // ---------------------------------------------------------
  // SORT TOGGLE
  // ---------------------------------------------------------
  const toggleSort = () => {
    setHistory([...history].reverse());
    setSortNewestFirst((prev) => !prev);
  };

  // ---------------------------------------------------------
  // SEARCH FILTER
  // ---------------------------------------------------------
  const filtered = history.filter((entry) => {
    const q = search.toLowerCase();
    return (
      entry.text.toLowerCase().includes(q) ||
      entry.date.toLowerCase().includes(q) ||
      (entry.status || "").toLowerCase().includes(q)
    );
  });

  const grouped = groupByDate(filtered);

  return (
    <AuthGuard>
      <main className="min-h-screen pt-28 pb-24 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto">
          {/* HEADER */}
          <header className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/70">
              History
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-sky-100">
              Your habit timeline
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm">
              Grouped by date with smooth animations, search, sorting and
              deletion.
            </p>
          </header>

          {/* SEARCH + SORT */}
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 py-2 px-4 rounded-xl bg-slate-900/70 border border-slate-700 text-sky-100 outline-none focus:ring-2 focus:ring-emerald-400/60 transition"
            />

            <button
              onClick={toggleSort}
              className="px-4 py-2 rounded-xl bg-slate-900/70 border border-slate-700 text-sky-100 flex items-center gap-2 hover:bg-slate-800 transition"
            >
              <ArrowUpDown size={18} />
              {sortNewestFirst ? "Newest first" : "Oldest first"}
            </button>
          </div>

          {/* MAIN WRAPPER */}
          <div className="mt-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 shadow-xl shadow-sky-900/40 max-h-[540px] overflow-y-auto scroll-smooth">
            {/* EMPTY STATE */}
            {!isLoading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 opacity-80">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-slate-500 text-sm">
                  No matching history found.
                </p>
              </div>
            )}

            {/* GROUPED LIST */}
            <AnimatePresence>
              {!isLoading && filtered.length > 0 && (
                <div className="space-y-10">
                  {Object.entries(grouped).map(([groupTitle, items]) =>
                    items.length === 0 ? null : (
                      <motion.div
                        key={groupTitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* STICKY GROUP HEADER */}
                        <h2 className="text-lg font-semibold text-emerald-300 tracking-wide mb-4 bg-slate-950/80 backdrop-blur-sm sticky top-0 py-2 z-20 border-b border-slate-800">
                          {groupTitle}
                        </h2>

                        <ol className="relative border-l border-slate-800/80 ml-3 space-y-6">
                          {items.map((entry) => (
                            <motion.li
                              key={entry.date + entry.text}
                              layout
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -15 }}
                              transition={{ duration: 0.3 }}
                              className="ml-4"
                            >
                              <span className="absolute -left-3 flex h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.7)]" />

                              <motion.div
                                whileHover={{
                                  rotateX: 6,
                                  rotateY: -6,
                                  scale: 1.03,
                                  boxShadow:
                                    "0px 10px 30px rgba(0,255,180,0.25), 0 0 20px rgba(0,255,200,0.1)",
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 220,
                                  damping: 12,
                                }}
                                className="relative rounded-xl bg-slate-900/70 border border-slate-700/70 px-4 py-3"
                              >
                                <button
                                  onClick={() =>
                                    deleteEntry(
                                      history.indexOf(entry)
                                    )
                                  }
                                  className="absolute top-2 right-2 p-1 rounded-lg hover:bg-red-500/20 transition"
                                >
                                  <Trash2
                                    size={16}
                                    className="text-red-400"
                                  />
                                </button>

                                <p className="text-xs text-slate-400 mb-1">
                                  {entry.date}
                                </p>
                                <p className="text-sm text-sky-50">
                                  {entry.text}
                                </p>
                                <p className="mt-1 text-[11px] font-semibold text-emerald-300">
                                  {entry.status || "Added"}
                                </p>
                              </motion.div>
                            </motion.li>
                          ))}
                        </ol>
                      </motion.div>
                    )
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
