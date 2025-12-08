import React from "react";
import { Achievement } from "../lib/achievements";

export default function Badges({ badges }: { badges: Achievement[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((b) => (
        <div
          key={b.id}
          className={`p-4 rounded-xl border ${
            b.unlocked ? "border-emerald-400/40" : "border-slate-700/60"
          } bg-slate-900/60`}
        >
          <div className="text-3xl">{b.icon}</div>
          <p className="mt-2 text-sky-100 font-semibold">{b.title}</p>
          <p className="text-xs text-slate-400">{b.description}</p>

          {!b.unlocked && (
            <p className="mt-2 text-[10px] text-slate-500 italic">Locked</p>
          )}
        </div>
      ))}
    </div>
  );
}
