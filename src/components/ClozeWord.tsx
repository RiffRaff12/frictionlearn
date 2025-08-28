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
      className="inline-block px-2 py-1 mx-1 bg-white text-black rounded border-2 border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer font-mono text-sm"
      title="Click to reveal word"
    >
      ?
    </button>
  );
} 