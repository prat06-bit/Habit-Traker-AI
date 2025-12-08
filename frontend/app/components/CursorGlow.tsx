"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Pos = { x: number; y: number };

export default function CursorGlow() {
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("pointermove", handle);
    return () => window.removeEventListener("pointermove", handle);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed z-0 h-32 w-32 rounded-full
                 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.9),rgba(56,189,248,0.45),rgba(15,23,42,0))]
                 mix-blend-screen blur-3xl"
      animate={{ x: pos.x - 64, y: pos.y - 64 }}
      transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.8 }}
    />
  );
}
