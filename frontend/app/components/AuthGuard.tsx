"use client";

import { ReactNode } from "react";
import { redirect } from "next/navigation";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const isLoggedIn =
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem("ai-habit-user"));

  if (!isLoggedIn) {
    redirect("/login");
  }

  return <>{children}</>;
}
