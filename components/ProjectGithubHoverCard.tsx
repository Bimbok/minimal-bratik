"use client";

import React, { useState, useEffect } from "react";
import { Star, GitFork, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RepoStats {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  topics: string[];
  pushed_at: string;
  owner: {
    avatar_url: string;
    login: string;
  };
  license?: {
    spdx_id: string;
    name: string;
  };
}

const statsCache: Record<string, RepoStats> = {};

export const ProjectGithubHoverCard: React.FC<{
  repoPath: string;
  fallbackStars?: number;
  fallbackForks?: number;
}> = ({ repoPath, fallbackStars = 0, fallbackForks = 0 }) => {
  const [stats, setStats] = useState<RepoStats | null>(statsCache[repoPath] || null);
  const [loading, setLoading] = useState<boolean>(!statsCache[repoPath]);
  const [hovered, setHovered] = useState<boolean>(false);

  useEffect(() => {
    if (statsCache[repoPath]) {
      setStats(statsCache[repoPath]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchRepoStats = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repoPath}`);
        if (res.ok) {
          const data = await res.json();
          statsCache[repoPath] = data;
          if (isMounted) {
            setStats(data);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch repo stats:", err);
      }
    };

    fetchRepoStats();
    return () => {
      isMounted = false;
    };
  }, [repoPath]);

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "Recently";
    const date = new Date(isoStr);
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  const stars = stats ? stats.stargazers_count : fallbackStars;
  const forks = stats ? stats.forks_count : fallbackForks;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Live Badge Trigger */}
      <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 cursor-pointer hover:border-neutral-700 transition-colors">
        <span className="flex items-center gap-1 text-amber-400 font-bold">
          <Star className="w-3 h-3 fill-amber-400/20" />
          <span>{stars}</span>
        </span>
        <span className="text-neutral-600">•</span>
        <span className="flex items-center gap-1 text-sky-400 font-bold">
          <GitFork className="w-3 h-3" />
          <span>{forks}</span>
        </span>
      </div>

      {/* Hover Popup Card */}
      <AnimatePresence>
        {hovered && stats && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-xl bg-[#0e0f12] border border-neutral-700 shadow-2xl z-50 font-mono text-xs text-neutral-200 space-y-2.5 pointer-events-none"
          >
            {/* Owner & Repo Title */}
            <div className="flex items-center gap-2.5 border-b border-neutral-800 pb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stats.owner.avatar_url}
                alt={stats.owner.login}
                className="w-7 h-7 rounded-lg border border-neutral-700 object-cover"
              />
              <div className="min-w-0">
                <div className="text-[10px] text-neutral-500 font-sans font-bold">
                  LIVE GITHUB REPO STATS
                </div>
                <div className="text-xs font-extrabold text-white truncate">
                  {stats.full_name}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-neutral-300 font-sans leading-snug line-clamp-2">
              {stats.description || "Open source project on GitHub."}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-neutral-950/90 border border-neutral-800 text-[10px] text-center">
              <div>
                <div className="text-neutral-500 text-[9px]">STARS</div>
                <div className="font-extrabold text-amber-400 mt-0.5">⭐ {stats.stargazers_count}</div>
              </div>
              <div>
                <div className="text-neutral-500 text-[9px]">FORKS</div>
                <div className="font-extrabold text-sky-400 mt-0.5">🔀 {stats.forks_count}</div>
              </div>
              <div>
                <div className="text-neutral-500 text-[9px]">ISSUES</div>
                <div className="font-extrabold text-white mt-0.5">🐛 {stats.open_issues_count}</div>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
              <span className="flex items-center gap-1 text-neutral-200 font-semibold">
                <span className="w-2 h-2 rounded-full bg-neutral-300 animate-pulse" />
                {stats.language || "Multi"}
              </span>
              <span className="flex items-center gap-1 text-neutral-500">
                <Calendar className="w-2.5 h-2.5" />
                <span>Pushed {formatDate(stats.pushed_at)}</span>
              </span>
            </div>

            {/* Topics */}
            {stats.topics && stats.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1 border-t border-neutral-800/60">
                {stats.topics.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.2 rounded text-[9px] bg-neutral-900 text-neutral-400 border border-neutral-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
