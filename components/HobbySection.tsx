"use client";

import React, { useState, useEffect } from "react";
import { useThemeContext } from "../lib/theme-context";
import { PORTFOLIO_DATA, AnimeItem } from "../lib/portfolio-data";
import { audioEngine } from "../lib/audio";
import {
  Heart,
  Tv,
  Star,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Play,
  Flame,
} from "lucide-react";

export const HobbySection: React.FC = () => {
  const { setAnimeModalOpen } = useThemeContext();
  const [animeData, setAnimeData] = useState<AnimeItem[]>(PORTFOLIO_DATA.hobbies.anime);
  const [profileUrl, setProfileUrl] = useState<string>(PORTFOLIO_DATA.hobbies.animeProfileUrl);
  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(false);
  const [stats, setStats] = useState(
    PORTFOLIO_DATA.hobbies.stats || {
      daysWatched: 7.2,
      meanScore: 8.47,
      totalEntries: 20,
      episodesWatched: 416,
      watching: 1,
      completed: 19,
    }
  );

  // Fetch dynamic public profile data via Jikan/MAL API route
  useEffect(() => {
    fetch(`/api/anime?username=${PORTFOLIO_DATA.hobbies.myAnimeListUsername || "Bimbok"}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.anime) && data.anime.length > 0) {
          setAnimeData(data.anime);
          setIsLiveSynced(true);
        }
        if (data?.profileUrl) {
          setProfileUrl(data.profileUrl);
        }
        if (data?.stats) {
          setStats(data.stats);
        }
      })
      .catch(() => {
        // Fallback already in place
      });
  }, []);

  // Filter 1-2 featured anime: Watching first, then recently completed
  const watchingAnime = animeData.filter((a) => a.status === "watching");
  const completedAnime = animeData.filter((a) => a.status === "completed");
  const displayAnime = [
    ...watchingAnime,
    ...completedAnime,
  ].slice(0, 2);

  return (
    <section id="hobbies" className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
              ~/.config/hobbies
            </span>
            <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
              // personal interests & creative outlets
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 tracking-tight font-sans flex items-center gap-2">
            <Heart className="w-5 h-5 text-neutral-400" />
            <span>Hobbies & Personal Life</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MAL Synced (@{PORTFOLIO_DATA.hobbies.myAnimeListUsername})</span>
          </span>
        </div>
      </div>

      {/* Grid for Hobbies (Ready for Hobby #1 and upcoming Hobby #2) */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* ========================================================= */}
        {/* HOBBY 1: ANIME & MANGA MODULE                             */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 relative overflow-hidden group">
          
          {/* Subtle Top Gradient Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neutral-600 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />

          {/* Module Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-white shadow-inner">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white font-sans tracking-tight">
                    Anime & Manga Watchlist
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400">
                    Hobby 01
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  Directly synced with official MyAnimeList profile & statistics.
                </p>
              </div>
            </div>

            {/* Header Action: Open Full Modal */}
            <button
              onClick={() => {
                audioEngine.playKeyClick("enter");
                setAnimeModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-white transition-all shadow-sm self-start sm:self-auto group/btn"
            >
              <span>Explore All {stats.totalEntries} Titles</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Quick Profile Stat Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-center font-mono">
            <div className="px-2 py-1">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Days Watched</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{stats.daysWatched} Days</div>
            </div>
            <div className="px-2 py-1 border-l border-neutral-800/80">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Mean Score</div>
              <div className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5 flex items-center justify-center gap-1">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>{stats.meanScore.toFixed(2)}</span>
              </div>
            </div>
            <div className="px-2 py-1 border-l border-neutral-800/80">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Episodes</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{stats.episodesWatched} Eps</div>
            </div>
            <div className="px-2 py-1 border-l border-neutral-800/80">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Completed</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">{stats.completed} Titles</div>
            </div>
          </div>

          {/* Recently Updated / Currently Watching Anime Cards (1-2 Featured) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayAnime.map((item) => {
              const progressPercent = item.totalEpisodes > 0
                ? Math.min(100, Math.round((item.episodesWatched / item.totalEpisodes) * 100))
                : 0;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    audioEngine.playKeyClick("down");
                    setAnimeModalOpen(true);
                  }}
                  className="p-3.5 rounded-xl bg-[#090a0d] border border-neutral-800 hover:border-neutral-600 transition-all cursor-pointer flex gap-3.5 group/card"
                >
                  {/* Anime Poster with Hover Scaling */}
                  <div className="relative w-20 sm:w-24 h-28 sm:h-32 rounded-lg overflow-hidden shrink-0 bg-neutral-950 border border-neutral-800 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const currentSrc = e.currentTarget.src;
                        if (!currentSrc.includes("/api/anime/proxy") && item.imageUrl.startsWith("http")) {
                          e.currentTarget.src = `/api/anime/proxy?url=${encodeURIComponent(item.imageUrl)}`;
                        }
                      }}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {item.status === "watching" && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-emerald-500/50 text-[9px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Watching
                      </div>
                    )}
                  </div>

                  {/* Anime Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {/* Title & Rating */}
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 font-sans group-hover/card:text-neutral-100 transition-colors">
                          {item.title}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] font-bold text-amber-300 shrink-0 flex items-center gap-1 font-mono">
                          <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                          {item.score.toFixed(1)}
                        </span>
                      </div>

                      {/* Clean Subtitle */}
                      {(item.titleEnglish && item.titleEnglish !== item.title ? item.titleEnglish : item.titleJapanese) && (
                        <p className="text-[10px] text-neutral-400 truncate mt-0.5 font-sans">
                          {item.titleEnglish && item.titleEnglish !== item.title ? item.titleEnglish : item.titleJapanese}
                        </p>
                      )}

                      {/* Genre Tags */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.genres.slice(0, 2).map((genre, gIdx) => (
                          <span
                            key={gIdx}
                            className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 font-mono"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar & Episodes */}
                    <div className="mt-2.5 pt-2 border-t border-neutral-800/80">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          Ep {item.episodesWatched} / {item.totalEpisodes}
                        </span>
                        <span className="text-[9px] text-neutral-400">{progressPercent}%</span>
                      </div>

                      {/* Progress Bar Track */}
                      <div className="w-full h-1.5 rounded-full bg-neutral-950 border border-neutral-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Module Bottom Bar */}
          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-neutral-400 text-[11px] font-sans">
              <span className="text-white font-semibold">9+ titles archived</span>
              <span>•</span>
              <span>Shounen, Sci-Fi, Dark Fantasy & Adventure</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playKeyClick("down");
                  setAnimeModalOpen(true);
                }}
                className="text-xs text-neutral-300 hover:text-white font-medium flex items-center gap-1 hover:underline"
              >
                <span>View Full List</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioEngine.playKeyClick("enter")}
                className="text-xs text-neutral-400 hover:text-white font-medium flex items-center gap-1 hover:underline"
              >
                <span>MyAnimeList Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
