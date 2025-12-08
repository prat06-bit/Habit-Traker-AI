// app/lib/api.ts

export type HabitEntry = {
  text: string;
  date: string;
  status: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

// ---- helpers ----
function readLocalHistory(): HabitEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      localStorage.getItem("ai-habit-history") || "[]"
    ) as HabitEntry[];
  } catch {
    return [];
  }
}

function writeLocalHistory(data: HabitEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ai-habit-history", JSON.stringify(data));
}

// ---- API functions ----
export async function fetchHabits(): Promise<HabitEntry[]> {
  try {
    const res = await fetch(`${API_BASE}/habits`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Backend /habits failed");
    const data = (await res.json()) as HabitEntry[];
    writeLocalHistory(data);
    return data;
  } catch (err) {
    console.warn("[api] fetchHabits failed, using localStorage", err);
    const local = readLocalHistory();
    return local;
  }
}

export async function addHabitApi(habit: HabitEntry): Promise<void> {
  try {
    await fetch(`${API_BASE}/habits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(habit),
    });
  } catch (err) {
    console.warn("[api] addHabit failed, will still update local", err);
  } finally {
    const current = readLocalHistory();
    writeLocalHistory([...current, habit]);
  }
}

/**
 * Overwrite backend + local history with the given list.
 * Uses /habits/clear + POST /habits for each entry (works with your current backend).
 */
export async function overwriteHabitsApi(
  habits: HabitEntry[]
): Promise<void> {
  try {
    await fetch(`${API_BASE}/habits/clear`, { method: "POST" });
    for (const h of habits) {
      await fetch(`${API_BASE}/habits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(h),
      });
    }
  } catch (err) {
    console.warn("[api] overwriteHabits failed, using local only", err);
  } finally {
    writeLocalHistory(habits);
  }
}
