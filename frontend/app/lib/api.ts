// app/lib/api.ts

export type HabitEntry = {
  text: string;
  date: string; // ISO string
  status: "done" | "skipped" | "pending";
};

/**
 * API base
 * MUST be set in production via NEXT_PUBLIC_API_BASE
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"
    : "");

/* ======================================================
   Local storage helpers (SSR-safe)
   ====================================================== */

function readLocalHistory(): HabitEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("ai-habit-history");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HabitEntry[]) : [];
  } catch {
    return [];
  }
}

function writeLocalHistory(data: HabitEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("ai-habit-history", JSON.stringify(data));
}

/* ======================================================
   Generic typed fetch helper
   ====================================================== */

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  if (!API_BASE) {
    throw new Error("API_BASE is not configured");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return (await res.json()) as T;
}

/* ======================================================
   API functions
   ====================================================== */

export async function fetchHabits(): Promise<HabitEntry[]> {
  try {
    const data = await apiFetch<HabitEntry[]>("/habits");
    writeLocalHistory(data);
    return data;
  } catch (err) {
    console.warn("[api] fetchHabits failed → using localStorage", err);
    return readLocalHistory();
  }
}

export async function addHabitApi(habit: HabitEntry): Promise<void> {
  try {
    await apiFetch<void>("/habits", {
      method: "POST",
      body: JSON.stringify(habit),
    });
  } catch (err) {
    console.warn("[api] addHabit failed → local only", err);
  } finally {
    const current = readLocalHistory();
    writeLocalHistory([...current, habit]);
  }
}

export async function overwriteHabitsApi(
  habits: HabitEntry[]
): Promise<void> {
  try {
    await apiFetch<void>("/habits/clear", { method: "POST" });

    for (const h of habits) {
      await apiFetch<void>("/habits", {
        method: "POST",
        body: JSON.stringify(h),
      });
    }
  } catch (err) {
    console.warn("[api] overwriteHabits failed → local only", err);
  } finally {
    writeLocalHistory(habits);
  }
}
