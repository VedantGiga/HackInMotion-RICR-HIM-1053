"use client";

import { useEffect, useRef } from "react";

/** Lightweight canvas flow-field particle background (deep blue + lime streams). */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = Math.min(1400, Math.floor((w * h) / 900));
    const parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: 0.35 + Math.random() * 0.9,
      v: 0.15 + Math.random() * 0.5,
      lime: Math.random() > 0.93,
    }));

    let t = 0;
    let raf = 0;

    const field = (x: number, y: number) =>
      Math.sin(x * 0.0032 + t * 0.0006) * 1.6 + Math.cos(y * 0.0041 - t * 0.0004) * 1.6;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        const a = field(p.x, p.y);
        p.x += Math.cos(a) * p.v;
        p.y += Math.sin(a) * p.v * 0.8;
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        if (p.y < -5) p.y = h + 5;
        if (p.y > h + 5) p.y = -5;

        ctx.fillStyle = p.lime ? "rgba(139,92,246,0.55)" : "rgba(120,170,255,0.42)";
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      t += 1;
      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
