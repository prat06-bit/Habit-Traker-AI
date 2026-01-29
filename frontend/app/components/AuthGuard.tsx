"use client";

import { ReactNode } from "react";
import { redirect } from "next/navigation";

export default function AuthGuard({ children }: { children: ReactNode }) {
  // ✅ synchronous auth check (eslint-safe)
  const isLoggedIn =
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem("ai-habit-user"));

  // ✅ redirect immediately if not authenticated
  if (!isLoggedIn) {
    redirect("/login");
  }

  // ✅ render protected content
  return <>{children}</>;
}
