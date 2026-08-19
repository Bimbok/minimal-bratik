"use client";

import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { useThemeContext } from "../lib/theme-context";
import { PORTFOLIO_DATA, AnimeItem } from "../lib/portfolio-data";
import { audioEngine } from "../lib/audio";
import {
  Tv,
  X,
  Star,
  ExternalLink,
  Flame,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Search,
} from "lucide-react";

export const AnimeDetailModal: React.FC = () => {
  const { animeModalOpen, setAnimeModalOpen } = useThemeContext();
  const [filter, setFilter] = useState<"all" | "watching" | "completed" | "favorites">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [animeList, setAnimeList] = useState<AnimeItem[]>(PORTFOLIO_DATA.hobbies.anime);
  const [profileUrl, setProfileUrl] = useState<string>(PORTFOLIO_DATA.hobbies.animeProfileUrl);
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

  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic list if available
  useEffect(() => {
    if (!animeModalOpen) return;
    
    fetch(`/api/anime?username=${PORTFOLIO_DATA.hobbies.myAnimeListUsername || "Bimbok"}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.anime) && data.anime.length > 0) {
          setAnimeList(data.anime);
        }
        if (data?.profileUrl) {
          setProfileUrl(data.profileUrl);
        }
        if (data?.stats) {
          setStats(data.stats);
        }
      })
      .catch(() => {
        // Keep initial fallback
      });
  }, [animeModalOpen]);

  // Lock body scroll while modal is active
  useEffect(() => {
    const mainLenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (animeModalOpen) {
      if (mainLenis) mainLenis.stop();
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (mainLenis) mainLenis.start();
      document.body.style.overflow = "";
    };
  }, [animeModalOpen]);

  // Dedicated Lenis smooth momentum scrolling inside the modal
  useEffect(() => {
    if (!animeModalOpen || !scrollWrapperRef.current || !scrollContentRef.current) return;

    const modalLenis = new Lenis({
      wrapper: scrollWrapperRef.current,
      content: scrollContentRef.current,
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
      infinite: false,
    });

    let rafId: number;
    function raf(time: number) {
      modalLenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      modalLenis.destroy();
    };
  }, [animeModalOpen, filter, searchQuery, animeList]);

  if (!animeModalOpen) return null;

  const filteredAnime = animeList.filter((item) => {
    let matchesFilter = true;
    if (filter === "watching") matchesFilter = item.status === "watching";
    else if (filter === "completed") matchesFilter = item.status === "completed";
    else if (filter === "favorites") matchesFilter = Boolean(item.isFavorite || item.score >= 8.8);

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      (item.titleEnglish && item.titleEnglish.toLowerCase().includes(query)) ||
      item.genres.some((g) => g.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const watchingCount = animeList.filter((a) => a.status === "watching").length;
  const completedCount = animeList.filter((a) => a.status === "completed").length;
  const favoritesCount = animeList.filter((a) => a.isFavorite || a.score >= 8.8).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      {/* Backdrop click to dismiss */}
      <div
        className="fixed inset-0"
        onClick={() => {
          audioEngine.playKeyClick("down");
          setAnimeModalOpen(false);
        }}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl bg-[#0e0f12] border border-neutral-700 shadow-2xl overflow-hidden z-10 flex flex-col text-neutral-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight font-sans">
                  Anime Watchlist & Archive
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400 font-mono hidden sm:inline">
                  MAL: @{PORTFOLIO_DATA.hobbies.myAnimeListUsername || "Bimbok"}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                Official list synced directly with MyAnimeList (@{PORTFOLIO_DATA.hobbies.myAnimeListUsername})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioEngine.playKeyClick("enter")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white transition-colors"
            >
              <span>View MAL Profile</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
            <button
              onClick={() => {
                audioEngine.playKeyClick("down");
                setAnimeModalOpen(false);
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAL Profile Statistics Summary Bar */}
        <div className="px-5 py-2.5 bg-[#0a0b0e] border-b border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono shrink-0">
          <div className="px-2 py-0.5">
            <div className="text-[9px] text-neutral-400 uppercase tracking-wider">Days Watched</div>
            <div className="text-xs font-bold text-white">{stats.daysWatched} Days</div>
          </div>
          <div className="px-2 py-0.5 border-l border-neutral-800/80">
            <div className="text-[9px] text-neutral-400 uppercase tracking-wider">Mean Score</div>
            <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1">
              <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
              <span>{stats.meanScore.toFixed(2)}</span>
            </div>
          </div>
          <div className="px-2 py-0.5 border-l border-neutral-800/80">
            <div className="text-[9px] text-neutral-400 uppercase tracking-wider">Episodes</div>
            <div className="text-xs font-bold text-white">{stats.episodesWatched} Eps</div>
          </div>
          <div className="px-2 py-0.5 border-l border-neutral-800/80">
            <div className="text-[9px] text-neutral-400 uppercase tracking-wider">Total Entries</div>
            <div className="text-xs font-bold text-emerald-400">{stats.totalEntries} Titles</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-5 py-3 bg-[#08090b] border-b border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => {
                setFilter("all");
                audioEngine.playKeyClick("down");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filter === "all"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800/80"
              }`}
            >
              All ({animeList.length})
            </button>

            <button
              onClick={() => {
                setFilter("watching");
                audioEngine.playKeyClick("down");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                filter === "watching"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800/80"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Watching ({watchingCount})</span>
            </button>

            <button
              onClick={() => {
                setFilter("completed");
                audioEngine.playKeyClick("down");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                filter === "completed"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800/80"
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-neutral-400" />
              <span>Completed ({completedCount})</span>
            </button>

            <button
              onClick={() => {
                setFilter("favorites");
                audioEngine.playKeyClick("down");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                filter === "favorites"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800/80"
              }`}
            >
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Top Rated ({favoritesCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-48 shrink-0">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, genre..."
              className="w-full pl-8 pr-3 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600 font-mono"
            />
          </div>

        </div>

        {/* Scrollable Anime List Grid with data-lenis-prevent */}
        <div
          ref={scrollWrapperRef}
          data-lenis-prevent="true"
          className="p-4 sm:p-5 overflow-y-auto overscroll-contain flex-1 max-h-[calc(85vh-130px)] space-y-3 bg-[#08090b]"
        >
          <div ref={scrollContentRef}>
            {filteredAnime.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 font-sans text-xs">
                No anime found matching your filter criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredAnime.map((item) => {
                  const progressPct = item.totalEpisodes > 0
                    ? Math.min(100, Math.round((item.episodesWatched / item.totalEpisodes) * 100))
                    : 0;

                  const subtitleText = item.titleEnglish && item.titleEnglish !== item.title
                    ? item.titleEnglish
                    : item.titleJapanese || "";

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/90 hover:border-neutral-700 transition-all flex gap-3.5 group"
                    >
                      {/* Cover Thumbnail */}
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {item.status === "watching" && (
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-emerald-500/40 text-[9px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                          </div>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          {/* Title & Score */}
                          <div className="flex items-start justify-between gap-1.5">
                            <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 font-sans">
                              {item.title}
                            </h4>
                            <span className="px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] font-bold text-amber-300 shrink-0 flex items-center gap-1 font-mono">
                              <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                              {item.score.toFixed(1)}
                            </span>
                          </div>

                          {/* Clean Subtitle */}
                          {subtitleText && (
                            <p className="text-[10px] text-neutral-400 truncate mt-0.5 font-sans">
                              {subtitleText}
                            </p>
                          )}

                          {/* Genres */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.genres.slice(0, 3).map((g, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-950/80 border border-neutral-800 text-neutral-400 font-mono"
                              >
                                {g}
                              </span>
                            ))}
                            {item.year && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-950/80 border border-neutral-800 text-neutral-400 font-mono">
                                {item.year}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Episode Progress Bar & Action */}
                        <div className="mt-2.5 pt-2 border-t border-neutral-800/60">
                          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                            <span>
                              {item.status === "completed" ? (
                                <span className="text-neutral-300 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-neutral-400" /> Completed
                                </span>
                              ) : (
                                <span className="text-emerald-400 font-semibold">
                                  Ep {item.episodesWatched} / {item.totalEpisodes}
                                </span>
                              )}
                            </span>
                            <span className="text-[9px] text-neutral-400">{progressPct}%</span>
                          </div>

                          <div className="w-full h-1.5 rounded-full bg-neutral-950 border border-neutral-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                item.status === "completed" ? "bg-neutral-400" : "bg-emerald-500"
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] text-neutral-400 capitalize font-mono">
                              {item.status.replace("_", " ")}
                            </span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => audioEngine.playKeyClick("enter")}
                              className="text-[10px] text-neutral-300 hover:text-white font-medium flex items-center gap-1 hover:underline"
                            >
                              <span>MAL Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-neutral-400 font-sans text-center sm:text-left">
            Total {animeList.length} titles cataloged across Action, Sci-Fi, Psychological & Fantasy.
          </span>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioEngine.playKeyClick("enter")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white transition-colors"
          >
            <span>View Full Profile on MyAnimeList</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </a>
        </div>

      </div>
    </div>
  );
};
