"use client";

import React, { useEffect, useRef } from "react";
import { useThemeContext } from "../lib/theme-context";

export const MatrixRainCanvas: React.FC = () => {
  const { matrixRainActive, theme, setMatrixRainActive } = useThemeContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!matrixRainActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const chars = "011010010101010101アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンλμπσ123456789";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      // Semi-transparent black to create trailing effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = theme === "gruvbox" ? "#fabd2f" : "#00ff41";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [matrixRainActive, theme]);

  if (!matrixRainActive) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none opacity-40">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <button
        onClick={() => setMatrixRainActive(false)}
        className="pointer-events-auto absolute top-4 right-4 z-50 text-xs px-2.5 py-1 rounded border font-mono bg-black/80 text-emerald-400 border-emerald-500/40 hover:border-emerald-400 backdrop-blur"
      >
        ✕ Close Rain Matrix
      </button>
    </div>
  );
};
