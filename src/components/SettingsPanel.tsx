"use client";

import { useSettingsStore } from "@/state/useSettingsStore";
import type { DisfluentFont } from "@/state/useSettingsStore";

export default function SettingsPanel() {
  const { settings, setSetting } = useSettingsStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border rounded-md bg-white/60 dark:bg-black/30 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm">Font style</label>
        <select
          className="px-2 py-1 rounded border text-sm"
          value={settings.disfluentFont}
          onChange={(e) => setSetting("disfluentFont", e.target.value as DisfluentFont)}
        >
          <option value="serif">Serif-heavy</option>
          <option value="handwrite">Handwritten-like</option>
          <option value="condensed">Condensed</option>
        </select>
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="text-sm">Font size</label>
        <input
          type="range"
          min={0.8}
          max={1.6}
          step={0.05}
          value={settings.fontScale}
          onChange={(e) => setSetting("fontScale", Number(e.target.value))}
        />
        <span className="text-xs w-10 text-right">{settings.fontScale.toFixed(2)}x</span>
      </div>

      <Toggle label="Variable spacing" value={settings.variableSpacing} onChange={(v) => setSetting("variableSpacing", v)} />
      <Toggle label="Unstable segmentation" value={settings.unstableSegmentation} onChange={(v) => setSetting("unstableSegmentation", v)} />
      <Toggle label="Visual noise" value={settings.visualNoise} onChange={(v) => setSetting("visualNoise", v)} />

      <Toggle label="Random font size" value={settings.randomFontSize} onChange={(v) => setSetting("randomFontSize", v)} />
      <Toggle label="Random font color" value={settings.randomFontColor} onChange={(v) => setSetting("randomFontColor", v)} />

      {settings.randomFontSize ? (
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm">Font size range</label>
          <input
            type="range"
            min={0.5}
            max={2.5}
            step={0.1}
            value={settings.fontSizeRange}
            onChange={(e) => setSetting("fontSizeRange", Number(e.target.value))}
          />
          <span className="text-xs w-10 text-right">{settings.fontSizeRange.toFixed(1)}x</span>
        </div>
      ) : null}

      {settings.randomFontColor ? (
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm">Color intensity</label>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.1}
            value={settings.colorIntensity}
            onChange={(e) => setSetting("colorIntensity", Number(e.target.value))}
          />
          <span className="text-xs w-10 text-right">{settings.colorIntensity.toFixed(1)}</span>
        </div>
      ) : null}

      <Toggle label="Normal mode" value={settings.normalMode} onChange={(v) => setSetting("normalMode", v)} />
      <Toggle label="Show full text" value={settings.showFullText} onChange={(v) => setSetting("showFullText", v)} />

      <Toggle label="Enable cloze" value={settings.enableCloze} onChange={(v) => setSetting("enableCloze", v)} />

      {settings.enableCloze ? (
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm">Cloze per paragraph</label>
          <input
            type="number"
            min={1}
            max={3}
            className="w-16 px-2 py-1 rounded border text-sm"
            value={settings.clozePerParagraph}
            onChange={(e) => setSetting("clozePerParagraph", Math.max(1, Math.min(3, Number(e.target.value) || 1)))}
          />
        </div>
      ) : null}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm">{label}</span>
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
} 