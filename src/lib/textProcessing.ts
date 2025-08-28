export function chunkTextIntoGroups(text: string, targetSentencesPerChunk: number = 2): string[] {
  if (!text) return [];
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let buffer: string[] = [];
  for (const sentence of sentences) {
    buffer.push(sentence);
    if (buffer.length >= targetSentencesPerChunk) {
      chunks.push(buffer.join(" "));
      buffer = [];
    }
  }
  if (buffer.length) chunks.push(buffer.join(" "));
  return chunks.length ? chunks : [text.trim()];
}

export function pickClozeTargetsFromChunk(chunk: string, desiredCount: number = 2): string[] {
  const words = chunk.split(/\s+/).filter(Boolean);
  const candidates = new Set<string>();

  for (const word of words) {
    const cleaned = word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
    if (!cleaned) continue;
    if (/^\d{4}$/.test(cleaned)) {
      candidates.add(cleaned);
      continue;
    }
    if (/^[A-Z][a-z]{3,}/.test(cleaned)) {
      candidates.add(cleaned);
      continue;
    }
    if (cleaned.length >= 8) {
      candidates.add(cleaned);
      continue;
    }
  }

  const list = Array.from(candidates);
  list.sort((a, b) => b.length - a.length);
  return list.slice(0, Math.max(1, Math.min(3, desiredCount)));
}

export interface ProcessResponseChunk {
  text: string;
  clozeTargets: string[]; // words to hide in this chunk
}

export interface ProcessResponseBody {
  chunks: ProcessResponseChunk[];
} 