"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // ✅ SAME SOURCE OF TRUTH AS NAVBAR
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("ai-habit-user");

    if (!user) {
      router.replace("/login");
      setAllowed(false);
    } else {
      setAllowed(true);
    }
  }, [router]);

  // ⛔ Prevent flash / infinite redirect
  if (allowed === null) return null;

  return <>{children}</>;
}
