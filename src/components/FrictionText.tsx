"use client";

import { useMemo, type ReactNode, useEffect, useState } from "react";
import { DisfluentFont } from "@/state/useSettingsStore";
import ClozeWord from "./ClozeWord";

type Alignment = "text-left" | "text-right" | "text-justify";

function tokenize(text: string): string[] {
  // Split into words and whitespace, preserving whitespace tokens
  return text.split(/(\s+)/).filter((t) => t.length > 0);
}

function getRandomClozeWords(tokens: string[], clozePercentage: number = 0.15): Set<number> {
  const wordIndices: number[] = [];
  tokens.forEach((token, index) => {
    if (!isWhitespace(token) && token.length > 2) { // Only hide words longer than 2 chars
      wordIndices.push(index);
    }
  });
  
  const numToHide = Math.floor(wordIndices.length * clozePercentage);
  const selectedIndices = new Set<number>();
  
  // Randomly select words to hide
  for (let i = 0; i < numToHide && wordIndices.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * wordIndices.length);
    selectedIndices.add(wordIndices[randomIndex]);
    wordIndices.splice(randomIndex, 1);
  }
  
  return selectedIndices;
}

// Debug function to log cloze words
function debugClozeWords(tokens: string[], clozeWords: Set<number>) {
  console.log('Total tokens:', tokens.length);
  console.log('Cloze words selected:', clozeWords.size);
  console.log('Cloze word indices:', Array.from(clozeWords));
  console.log('Sample cloze words:', Array.from(clozeWords).slice(0, 5).map(i => tokens[i]));
}

function isWhitespace(token: string): boolean {
  return /^\s+$/.test(token);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[], exclude?: T): T {
  const options = exclude ? arr.filter((x) => x !== exclude) : arr;
  return options[Math.floor(Math.random() * options.length)];
}

function buildRandomWordSegments(tokens: string[]): string[] {
  const segments: string[] = [];
  let current: string[] = [];
  let wordsInCurrent = 0;
  let targetWords = randomInt(1, 8);

  for (const tok of tokens) {
    current.push(tok);
    if (!isWhitespace(tok)) wordsInCurrent++;

    if (wordsInCurrent >= targetWords) {
      // Try to end on whitespace
      if (!isWhitespace(current[current.length - 1])) {
        current.push(" ");
      }
      segments.push(current.join(""));
      current = [];
      wordsInCurrent = 0;
      targetWords = randomInt(1, 8);
    }
  }

  if (current.length) segments.push(current.join(""));
  return segments;
}

function randomSpacingStyle(): React.CSSProperties | null {
  if (Math.random() > 0.5) return null; // about half the segments get spacing tweaks
  const wordSpacingEm = 0.02 + Math.random() * 0.18; // 0.02–0.20em
  const letterSpacingEm = Math.random() < 0.6 ? 0 : Math.random() * 0.03;
  const mt = randomInt(0, 10);
  const mb = randomInt(0, 12);
  return {
    wordSpacing: `${wordSpacingEm}em`,
    letterSpacing: `${letterSpacingEm}em`,
    marginTop: `${mt}px`,
    marginBottom: `${mb}px`,
    lineHeight: 1.45 + Math.random() * 0.3,
  };
}

function getRandomFontSize(baseRem: number, enabled: boolean, range: number): number {
  if (!enabled) return baseRem;
  // More dramatic range with bounds for readability
  const factor = 1 - (range * 0.5) + Math.random() * range; // e.g., 0.25x – 1.75x with range=1.5
  return Number((baseRem * factor).toFixed(2));
}

function getRandomColor(isDark: boolean, enabled: boolean, intensity: number): string {
  if (!enabled) return isDark ? "#e5e7eb" : "#111827";
  
  // Curated 5-color palette that works on dark backgrounds
  const lightColors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"]; // red-400, blue-400, emerald-400, amber-400, violet-400
  const darkColors = ["#fecaca", "#bfdbfe", "#a7f3d0", "#fde68a", "#ddd6fe"]; // light variants for high contrast on black
  
  const pool = isDark ? darkColors : lightColors;
  const baseColor = pool[Math.floor(Math.random() * pool.length)];
  
  // Apply intensity by mixing with base theme color
  const baseThemeColor = isDark ? "#e5e7eb" : "#111827";
  return baseColor; // For now, just return the vibrant color
}

function splitIntoSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g);
  return matches ? matches.map((s) => s) : [text];
}

function getRandomFontSizeRem(enabled: boolean): number {
  if (!enabled) return 1; // 1rem base
  const candidates = [0.6, 0.8, 1, 1.2, 1.6, 2.2, 3, 4, 5];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function getRandomFontSizePx(enabled: boolean): number {
  if (!enabled) return 16; // default ~16px
  const candidates = [10, 12, 14, 16, 20, 28, 36, 48, 64, 80, 96];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function getRandomEmphasisStyle(): React.CSSProperties {
  const choice = ["italic", "underline", "bold"][Math.floor(Math.random() * 3)];
  if (choice === "italic") return { fontStyle: "italic" };
  if (choice === "underline") return { textDecoration: "underline" };
  return { fontWeight: 700 };
}

export default function FrictionText({
  text,
  font,
  showFullText,
  fontScale,
  enableCloze: _enableCloze,
  randomFontColor,
  colorIntensity,
}: {
  text: string;
  font: DisfluentFont;
  showFullText: boolean;
  fontScale: number;
  enableCloze: boolean;
  randomFontColor: boolean;
  colorIntensity: number;
}) {
  const baseFontClass = useMemo(() => {
    if (font === "serif") return "font-disfluent-serif";
    if (font === "handwrite") return "font-disfluent-hand";
    return "font-disfluent-condensed";
  }, [font]);

  // Alignment and font tracks that can change at random segment boundaries
  const alignOptions: Alignment[] = ["text-left", "text-right", "text-justify"];
  const fontOptions = [
    "font-disfluent-serif",
    "font-disfluent-hand",
    "font-disfluent-condensed",
    "font-disfluent-slab",
    "font-disfluent-mono",
  ];

  // Defer theme detection and any randomness until after mount to avoid hydration mismatches
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    try {
      const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(Boolean(prefersDark));
    } catch {
      setIsDark(false);
    }
  }, []);

  // Precompute deterministic tokens once per text change
  const tokens = useMemo(() => tokenize(text), [text]);

  // Defer random segmentation until after mount; store segments in state
  const [segments, setSegments] = useState<string[] | null>(null);
  useEffect(() => {
    if (isMounted) {
      setSegments(buildRandomWordSegments(tokens));
    } else {
      setSegments(null);
    }
  }, [isMounted, tokens]);

  // Add cloze deletion functionality with stable styling
  const [revealedWords, setRevealedWords] = useState<Set<string>>(new Set());
  
  // Create stable, deterministic styling that won't change on re-renders
  const stableStyling = useMemo(() => {
    if (!isMounted) return null;
    
    const alignOptions: Alignment[] = ["text-left", "text-right", "text-justify"];
    const fontOptions = [
      "font-disfluent-serif",
      "font-disfluent-hand",
      "font-disfluent-condensed",
      "font-disfluent-slab",
      "font-disfluent-mono",
    ];
    
    return segments?.map((seg, i) => {
      const alignChoice = (i * 7 + seg.length) % alignOptions.length;
      const fontChoice = (i * 13 + seg.charCodeAt(0)) % fontOptions.length;
      const spacingChoice = (i * 11) % 2 === 0;
      const sizeChoice = (i * 17) % 20 + 12; // 12-32px range
      const emphasisChoice = (i * 23) % 4; // 4 emphasis options
      
      return {
        align: alignOptions[alignChoice],
        font: fontOptions[fontChoice],
        spacing: spacingChoice ? randomSpacingStyle() : null,
        size: sizeChoice,
        color: getRandomColor(isDark, randomFontColor, colorIntensity),
        emphasis: emphasisChoice === 0 ? { fontWeight: 700 } : 
                 emphasisChoice === 1 ? { fontStyle: "italic" } :
                 emphasisChoice === 2 ? { textDecoration: "underline" } : {}
      };
    });
  }, [isMounted, segments, isDark, randomFontColor, colorIntensity]);

  const handleRevealWord = (wordKey: string) => {
    setRevealedWords(prev => new Set([...prev, wordKey]));
  };

  if (showFullText) {
    return (
      <div className={`${baseFontClass}`} style={{ fontSize: `${fontScale}rem` }}>
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    );
  }

  // currentFont is no longer carried; each segment picks independently for variety

  // Before mount, render a stable block to match SSR
  if (!isMounted || !segments) {
    return (
      <div className={`${baseFontClass}`} style={{ fontSize: `${fontScale}rem` }}>
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    );
  }

  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {segments.map((seg, i) => {
        // Use stable styling that won't change on re-renders
        const styling = stableStyling?.[i];
        if (!styling) return null;

        // Check if this segment contains cloze words
        const segmentTokens = tokenize(seg);
        const content: ReactNode = (
          <>
            {segmentTokens.map((token, tokenIndex) => {
              if (isWhitespace(token)) {
                return token;
              }
              
              // Check if this word should be hidden - use deterministic selection (reduced by 60%)
              const wordKey = `${i}-${tokenIndex}-${token}`;
              const shouldHide = _enableCloze && 
                (wordKey.charCodeAt(0) + wordKey.charCodeAt(1) + wordKey.charCodeAt(2)) % 10 === 0 && 
                token.length > 2;
              
              if (shouldHide) {
                return (
                  <ClozeWord
                    key={wordKey}
                    word={token}
                    onReveal={() => {
                      setRevealedWords(prev => new Set([...prev, wordKey]));
                    }}
                    isRevealed={revealedWords.has(wordKey)}
                  />
                );
              }
              
              return token;
            })}
          </>
        );

        return (
          <span
            key={i}
            className={`${styling.align} ${styling.font}`}
            style={{
              ...(styling.spacing || {}),
              display: "inline-block",
              fontSize: `${styling.size}px`,
              color: styling.color,
              ...styling.emphasis,
            }}
            suppressHydrationWarning
          >
            {content}
          </span>
        );
      })}
    </div>
  );
} 