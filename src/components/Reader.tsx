"use client";

import FrictionText from "./FrictionText";
import NoiseLayer from "./NoiseLayer";

export default function Reader({ text, regenKey }: { text: string; regenKey?: number }) {
  const settings = {
    visualNoise: true,
    normalMode: false,
    disfluentFont: "serif" as const,
    variableSpacing: true,
    fontScale: 1,
    enableCloze: false,
  };

  return (
    <div className="relative">
      <NoiseLayer enabled={settings.visualNoise && !settings.normalMode} />
      <div className="min-h-[200px] p-4 sm:p-6 rounded-md border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur">
        <FrictionText
          key={regenKey}
          text={text}
          font={settings.disfluentFont}
          variableSpacing={settings.variableSpacing && !settings.normalMode}
          unstableSegmentation={false}
          showFullText={settings.normalMode}
          fontScale={settings.fontScale}
          enableCloze={settings.enableCloze}
          randomFontSize={true}
          randomFontColor={true}
          fontSizeRange={1.5}
          colorIntensity={0.8}
        />
      </div>
    </div>
  );
} 