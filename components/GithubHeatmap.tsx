"use client";

import React, { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Activity, ExternalLink, GitBranch, Star, Code2, Users, FolderGit2, Flame } from "lucide-react";
import { GithubIcon } from "./BrandIcons";

interface GithubUserData {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export const GithubHeatmap: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<"calendar" | "stats">("calendar");
  const [githubData, setGithubData] = useState<GithubUserData | null>({
    public_repos: 40,
    followers: 20,
    following: 12,
    created_at: "2023-05-07T15:00:54Z",
  });

  useEffect(() => {
    setMounted(true);

    // Fetch live GitHub stats from official GitHub REST API
    fetch("https://api.github.com/users/Bimbok")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.public_repos === "number") {
          setGithubData({
            public_repos: data.public_repos,
            followers: data.followers,
            following: data.following,
            created_at: data.created_at,
          });
        }
      })
      .catch(() => {
        // Fallback to initial values if rate-limited
      });
  }, []);

  const languageBreakdown = [
    { name: "C++ / C++17", pct: 35, color: "bg-white" },
    { name: "Go (Golang)", pct: 25, color: "bg-neutral-300" },
    { name: "Python / AI", pct: 20, color: "bg-neutral-400" },
    { name: "TypeScript / React", pct: 15, color: "bg-neutral-500" },
    { name: "Shell & CMake", pct: 5, color: "bg-neutral-600" },
  ];

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
              Live Profile Stats
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

      {/* GitHub Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
            <FolderGit2 className="w-3.5 h-3.5 text-white" />
            <span>Public Repos</span>
          </div>
          <p className="font-bold text-white text-base">
            {githubData ? `${githubData.public_repos} Repos` : "40 Repos"}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
            <Users className="w-3.5 h-3.5 text-white" />
            <span>Followers</span>
          </div>
          <p className="font-bold text-white text-base">
            {githubData ? `${githubData.followers} Followers` : "20 Followers"}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
            <Code2 className="w-3.5 h-3.5 text-white" />
            <span>Core Languages</span>
          </div>
          <p className="font-bold text-white text-sm">C++ / Go / TS</p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
            <Flame className="w-3.5 h-3.5 text-white" />
            <span>Open Source</span>
          </div>
          <p className="font-bold text-white text-sm">Active Maintainer</p>
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

      {/* VIEW 2: Native Native GitHub Stats & Top Languages Breakdown */}
      {activeView === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          
          {/* GitHub Profile Summary Card */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/90 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <GithubIcon className="w-4 h-4 text-white" />
                <span className="font-extrabold text-white font-sans text-xs">GitHub Profile Overview</span>
              </div>
              <span className="text-[10px] text-neutral-500">github.com/Bimbok</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Total Repositories:</span>
                <span className="text-white font-bold">{githubData?.public_repos || 40}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Followers:</span>
                <span className="text-white font-bold">{githubData?.followers || 20}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Following:</span>
                <span className="text-white font-bold">{githubData?.following || 12}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Member Since:</span>
                <span className="text-white font-bold">May 2023</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-neutral-900">
                <span className="text-neutral-400">Environment:</span>
                <span className="text-white font-bold font-mono">Arch Linux • Neovim</span>
              </div>
            </div>
          </div>

          {/* Top Languages Distribution Card */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/90 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-white" />
                <span className="font-extrabold text-white font-sans text-xs">Most Used Languages</span>
              </div>
              <span className="text-[10px] text-neutral-500">Repository Analysis</span>
            </div>

            <div className="space-y-2.5">
              {languageBreakdown.map((lang) => (
                <div key={lang.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-300 font-medium">{lang.name}</span>
                    <span className="text-neutral-400">{lang.pct}%</span>
                  </div>
                  <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-neutral-800">
                    <div
                      className={`${lang.color} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${lang.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </section>
  );
};
