"use client";

import React, { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Activity, ExternalLink, GitBranch, Star, Code2, Terminal } from "lucide-react";
import { GithubIcon } from "./BrandIcons";

export const GithubHeatmap: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<"calendar" | "stats">("calendar");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="opensource" className="space-y-4 pt-6 border-t border-neutral-800/80">
      {/* Section Header */}
      <div className="flex items-center justify-between font-sans flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-neutral-300" />
          <h2 className="text-xl font-bold tracking-tight text-white">
            GitHub & Open Source Activity
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs">
            <button
              onClick={() => setActiveView("calendar")}
              className={`px-2.5 py-1 rounded-md transition-all font-bold ${
                activeView === "calendar"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Contributions
            </button>
            <button
              onClick={() => setActiveView("stats")}
              className={`px-2.5 py-1 rounded-md transition-all font-bold ${
                activeView === "stats"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Profile Stats
            </button>
          </div>

          <a
            href="https://github.com/Bimbok"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 hover:underline transition-all"
          >
            <span>@Bimbok</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* GitHub Quick Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
            <GithubIcon className="w-3.5 h-3.5 text-white" />
            <span>Profile</span>
          </div>
          <p className="font-bold text-white text-sm">@Bimbok</p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
            <GitBranch className="w-3.5 h-3.5 text-white" />
            <span>Primary Focus</span>
          </div>
          <p className="font-bold text-white text-sm">Systems & Web</p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
            <Code2 className="w-3.5 h-3.5 text-white" />
            <span>Core Stack</span>
          </div>
          <p className="font-bold text-white text-sm">C++ / Go / TS</p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
            <Terminal className="w-3.5 h-3.5 text-white" />
            <span>Environment</span>
          </div>
          <p className="font-bold text-white text-sm">Arch / Neovim</p>
        </div>
      </div>

      {/* VIEW 1: GitHub Contribution Heatmap */}
      {activeView === "calendar" && (
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/70 overflow-hidden flex justify-center font-mono text-xs text-neutral-300 min-h-[160px] items-center w-full shadow-inner">
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
            <div className="w-full h-32 rounded bg-neutral-950/80 animate-pulse flex items-center justify-center text-neutral-500 font-mono text-xs">
              Loading GitHub contribution calendar...
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: GitHub Live Stats & Top Languages Cards */}
      {activeView === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* GitHub Stats Card */}
          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/70 overflow-hidden flex items-center justify-center shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github-readme-stats.vercel.app/api?username=Bimbok&show_icons=true&theme=dark&bg_color=090a0c&title_color=ffffff&text_color=a3a3a3&icon_color=ffffff&border_color=262626&hide_border=false"
              alt="Bimbok's GitHub Stats"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>

          {/* Top Languages Card */}
          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/70 overflow-hidden flex items-center justify-center shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=Bimbok&layout=compact&theme=dark&bg_color=090a0c&title_color=ffffff&text_color=a3a3a3&border_color=262626&hide_border=false"
              alt="Bimbok's Top Languages"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
};
