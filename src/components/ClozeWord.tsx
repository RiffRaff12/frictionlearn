"use client";

import { useState } from "react";

export default function ClozeWord({ word }: { word: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <span
      onClick={() => setRevealed((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setRevealed((v) => !v);
      }}
      role="button"
      tabIndex={0}
      className={`inline-block px-0.5 mx-0.5 rounded-sm align-baseline underline decoration-dotted decoration-2 underline-offset-4 cursor-pointer transition-colors ${
        revealed ? "bg-transparent" : "bg-yellow-100/40 dark:bg-yellow-900/30"
      }`}
      title={revealed ? word : "Tap to reveal"}
    >
      <span className={revealed ? "blur-0" : "blur-[3px]"}>{word}</span>
    </span>
  );
} 