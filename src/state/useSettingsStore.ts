import { create } from "zustand";

export type DisfluentFont = "serif" | "handwrite" | "condensed";

export interface FrictionSettings {
  disfluentFont: DisfluentFont;
  variableSpacing: boolean;
  clozePerParagraph: number; // 1..3
  unstableSegmentation: boolean;
  temporalDelay: boolean;
  visualNoise: boolean;
  fontScale: number; // 0.8 .. 1.6
  normalMode: boolean;
  showFullText: boolean;
  enableCloze: boolean;
  randomFontSize: boolean;
  randomFontColor: boolean;
  fontSizeRange: number; // 0.5 .. 2.5
  colorIntensity: number; // 0.1 .. 1.0
}

export interface ReadingState {
  isProcessing: boolean;
  currentChunkIndex: number;
}

interface SettingsStore {
  settings: FrictionSettings;
  reading: ReadingState;
  setSetting: <K extends keyof FrictionSettings>(key: K, value: FrictionSettings[K]) => void;
  setReading: <K extends keyof ReadingState>(key: K, value: ReadingState[K]) => void;
  resetReading: () => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    disfluentFont: "serif",
    variableSpacing: true,
    clozePerParagraph: 2,
    unstableSegmentation: true,
    temporalDelay: false,
    visualNoise: true,
    fontScale: 1,
    normalMode: false,
    showFullText: false,
    enableCloze: false,
    randomFontSize: true,
    randomFontColor: true,
    fontSizeRange: 1.5,
    colorIntensity: 0.8,
  },
  reading: {
    isProcessing: false,
    currentChunkIndex: 0,
  },
  setSetting: (key, value) =>
    set((state) => ({ settings: { ...state.settings, [key]: value } })),
  setReading: (key, value) =>
    set((state) => ({ reading: { ...state.reading, [key]: value } })),
  resetReading: () =>
    set(() => ({ reading: { isProcessing: false, currentChunkIndex: 0 } })),
})); 