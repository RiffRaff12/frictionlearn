"use client";

interface ClozeWordProps {
  word: string;
  onReveal: () => void;
  isRevealed: boolean;
}

export default function ClozeWord({ word, onReveal, isRevealed }: ClozeWordProps) {
  if (isRevealed) {
    return <span className="text-white font-semibold">{word}</span>;
  }
  
  return (
    <button
      onClick={onReveal}
      className="inline-block px-2 py-1 mx-1 bg-red-500 text-white rounded border-2 border-red-600 hover:bg-red-600 transition-colors cursor-pointer font-mono text-sm"
      title="Click to reveal word"
    >
      ?
    </button>
  );
} 