"use client";

import React, { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Activity } from "lucide-react";

export const GithubHeatmap: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="opensource" className="space-y-4 pt-6 border-t border-neutral-800/80">
      <div className="flex items-center justify-between font-sans">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-neutral-300" />
          <span>Open Source Activity</span>
        </h2>
        <span className="text-[11px] font-mono text-neutral-500">
          github.com/Bimbok
        </span>
      </div>

      {/* GitHub Calendar Container - Monochrome Calming Obsidian Palette */}
      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/70 overflow-hidden flex justify-center font-mono text-xs text-neutral-300 min-h-[160px] items-center w-full">
        {mounted ? (
          <div className="w-full flex justify-center items-center overflow-x-auto sm:overflow-hidden">
            <GitHubCalendar
              username="Bimbok"
              colorScheme="dark"
              blockSize={10}
              blockMargin={3}
              fontSize={11}
              theme={{
                dark: ["#161b22", "#21262d", "#30363d", "#6e7681", "#f0f6fc"],
              }}
            />
          </div>
        ) : (
          <div className="w-full h-32 rounded bg-neutral-950/80 animate-pulse flex items-center justify-center text-neutral-600 font-mono text-xs">
            Loading GitHub contribution calendar...
          </div>
        )}
      </div>
    </section>
  );
};
