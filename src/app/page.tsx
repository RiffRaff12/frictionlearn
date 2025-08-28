"use client";

import { useState, useRef } from "react";
import Reader from "@/components/Reader";

export default function Home() {
  const [input, setInput] = useState("");
  const [text, setText] = useState<string | null>(null);
  const [regenKey, setRegenKey] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setText(input.trim());
    setRegenKey((k) => k + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleClear = () => {
    setText(null);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = ""; // reset to CSS default (min-h applies)
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">FrictionLearn</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
        Make reading harder, remember more.
        </p>
      </header>

      <div className="grid gap-6 overflow-x-auto" style={{ gridTemplateColumns: "360px 1400px", width: "max-content" }}>
        <div className="min-w-[1400px] max-w-[1400px]">
          <form onSubmit={handleGenerate} className="mb-4">
            <div className="mb-2">
              <button type="submit" className="block w-fit px-4 py-2 rounded-md border text-sm">
                Generate
              </button>
              {text ? (
                <div className="mt-2">
                  <button
                    type="button"
                    className="block w-fit px-4 py-2 rounded-md border text-sm"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </div>
              ) : null}
            </div>
            <textarea
              ref={textareaRef}
              className="w-full min-w-[80ch] min-h-40 max-h-[70vh] p-3 border rounded-md bg-white/70 dark:bg-black/30 backdrop-blur resize-none overflow-hidden"
              placeholder="Paste or type a block of text and click 'Generate'"
              value={input}
              onChange={handleInputChange}
            />
          </form>
        </div>

        <div className="min-w-[360px] max-w-[360px]">
          {text ? (
            <Reader key={regenKey} text={text} regenKey={regenKey} />
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-300">Output will appear here after you click Start.</div>
          )}
        </div>
      </div>
    </div>
  );
}
