"use client";

import { useEffect, useRef } from "react";

export default function NoiseLayer({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let raf = 0;
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = Math.max(parent.clientHeight, 300);
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
    }

    function draw() {
      const { width, height } = canvas!;
      context!.clearRect(0, 0, width, height);
      (context as CanvasRenderingContext2D).globalAlpha = 0.04;
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const w = 40 + Math.random() * 120;
        const h = 2 + Math.random() * 8;
        (context as CanvasRenderingContext2D).fillStyle = i % 2 === 0 ? "#999" : "#666";
        (context as CanvasRenderingContext2D).fillRect(x, y, w, h);
      }
      (context as CanvasRenderingContext2D).globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-60"
    />
  );
} 