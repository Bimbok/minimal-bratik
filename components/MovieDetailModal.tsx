"use client";

import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { useThemeContext } from "../lib/theme-context";
import { PORTFOLIO_DATA, TraktData } from "../lib/portfolio-data";
import { Modal } from "./ui/modal";
import { Button, LinkButton } from "./ui/button";
import { Badge } from "./ui/badge";
import { TraktIcon } from "./BrandIcons";
import { Clapperboard, Film, Tv, Star, ExternalLink, Search } from "lucide-react";

export const MovieDetailModal: React.FC<{ cinemaData?: TraktData }> = ({ cinemaData: propData }) => {
  const { movieModalOpen, setMovieModalOpen } = useThemeContext();
  const [activeTab, setActiveTab] = useState<"history" | "shows" | "movies">("movies");
  const [searchQuery, setSearchQuery] = useState("");
  const [liveCinema, setLiveCinema] = useState<TraktData | undefined>(propData || PORTFOLIO_DATA.hobbies.cinema);

  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  // Poll live Trakt history & watching status while modal is open
  useEffect(() => {
    if (!movieModalOpen) return;
    let isMounted = true;

    const fetchLive = async () => {
      try {
        const res = await fetch(
          `/api/trakt?username=${PORTFOLIO_DATA.hobbies.cinema?.traktUsername || "bimbok"}&t=${Date.now()}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data?.success && data?.cinema) {
          setLiveCinema(data.cinema);
        }
      } catch {
        // Keep fallback
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [movieModalOpen]);

  // Lock outer body scroll while modal is active
  useEffect(() => {
    const mainLenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (movieModalOpen) {
      if (mainLenis) mainLenis.stop();
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (mainLenis) mainLenis.start();
      document.body.style.overflow = "";
    };
  }, [movieModalOpen]);

  // Dedicated Lenis smooth momentum scrolling inside the modal
  useEffect(() => {
    if (!movieModalOpen || !scrollWrapperRef.current || !scrollContentRef.current) return;

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
  }, [movieModalOpen, activeTab, liveCinema]);

  const cinema = liveCinema || PORTFOLIO_DATA.hobbies.cinema;
  if (!cinema) return null;

  const stats = cinema.stats;
  const history = cinema.recentHistory;
  const shows = cinema.shows || [];
  const movies = cinema.movies || [];
  const nowWatching = cinema.nowWatching;

  const query = searchQuery.trim().toLowerCase();

  const filteredHistory = history.filter((item) => {
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.showTitle?.toLowerCase().includes(query) ||
      item.genres?.some((g) => g.toLowerCase().includes(query))
    );
  });

  const filteredShows = shows.filter((s) => {
    if (!query) return true;
    return (
      s.title.toLowerCase().includes(query) ||
      s.network?.toLowerCase().includes(query) ||
      s.genres?.some((g) => g.toLowerCase().includes(query)) ||
      String(s.year || "").includes(query)
    );
  });

  const filteredMovies = movies.filter((m) => {
    if (!query) return true;
    return (
      m.title.toLowerCase().includes(query) ||
      m.genres?.some((g) => g.toLowerCase().includes(query)) ||
      String(m.year || "").includes(query)
    );
  });

  return (
    <Modal
      isOpen={movieModalOpen}
      onClose={() => setMovieModalOpen(false)}
      title="Cinema & TV Series Vault"
      icon={<TraktIcon className="w-4.5 h-4.5 text-[#ED1C24]" />}
      maxWidth="4xl"
      className="bg-[#0c0d10] border-neutral-800 text-neutral-200"
      headerActions={
        <LinkButton
          variant="secondary"
          size="sm"
          href={cinema.traktProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs gap-1.5"
        >
          <span>Trakt Profile</span>
          <ExternalLink className="w-3 h-3 text-neutral-400" />
        </LinkButton>
      }
    >
      <div className="space-y-4">
        {/* Profile Card Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-neutral-700 bg-neutral-950 shrink-0 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cinema.avatarUrl || "https://media.trakt.tv/users/18230155/avatar.webp?v=1795001515"}
                alt={cinema.traktUsername}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/banner.png";
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center">
                <TraktIcon className="w-3 h-3 text-[#ED1C24]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white font-sans tracking-tight">
                  {cinema.traktUsername}
                </h3>
                <Badge variant="subtle" className="text-[10px]">
                  Cinephile & Scrobbler
                </Badge>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Psychological Thriller, Crime, Drama & Epic Cinema
              </p>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-center">
            <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="text-sm sm:text-base font-extrabold text-white">{stats.episodesWatched}</div>
              <div className="text-[10px] text-neutral-500 uppercase">Episodes</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="text-sm sm:text-base font-extrabold text-white">{stats.showsWatched}</div>
              <div className="text-[10px] text-neutral-500 uppercase">Shows</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="text-sm sm:text-base font-extrabold text-white">{stats.totalHours}h</div>
              <div className="text-[10px] text-neutral-500 uppercase">Watched</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="text-sm sm:text-base font-extrabold text-white">{stats.moviesWatched}</div>
              <div className="text-[10px] text-neutral-500 uppercase">Movies</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-1.5 font-mono text-xs flex-wrap">
            <Button
              variant={activeTab === "movies" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("movies")}
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Movies ({movies.length})</span>
            </Button>
            <Button
              variant={activeTab === "shows" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("shows")}
            >
              <Tv className="w-3.5 h-3.5 text-[#ED1C24]" />
              <span>TV Series ({shows.length})</span>
            </Button>
            <Button
              variant={activeTab === "history" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("history")}
            >
              <Clapperboard className="w-3.5 h-3.5" />
              <span>Watch History ({history.length})</span>
            </Button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-52 shrink-0 font-mono text-xs">
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

        {/* Dedicated Smooth Scrollable Body with Lenis momentum */}
        <div
          ref={scrollWrapperRef}
          data-lenis-prevent="true"
          className="overflow-y-auto max-h-[55vh] sm:max-h-[58vh] pr-1.5 focus:outline-none"
        >
          <div ref={scrollContentRef} className="space-y-4">
            {/* Live Now Watching Banner if currently streaming */}
            {nowWatching && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-950 border border-red-800/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 aspect-[2/3] rounded-lg bg-neutral-900 border border-neutral-700 overflow-hidden shrink-0 shadow-lg relative flex items-center justify-center">
                    {nowWatching.posterUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={nowWatching.posterUrl}
                        alt={nowWatching.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Tv className="w-6 h-6 text-neutral-500 m-auto" />
                    )}
                  </div>
                  <div>
                    <Badge variant="status" className="mb-1 text-red-400 border-red-800/60 bg-red-950/60 text-[9px]">
                      Currently Watching
                    </Badge>
                    <h4 className="font-bold text-sm text-white font-sans">{nowWatching.showTitle || nowWatching.title}</h4>
                    {nowWatching.season && nowWatching.number && (
                      <p className="text-xs text-neutral-300 font-mono">
                        S{nowWatching.season} E{nowWatching.number} — {nowWatching.title}
                      </p>
                    )}
                  </div>
                </div>
                {nowWatching.url && (
                  <LinkButton variant="primary" size="sm" href={nowWatching.url} target="_blank" rel="noopener noreferrer">
                    <span>Trakt Info</span>
                    <ExternalLink className="w-3 h-3" />
                  </LinkButton>
                )}
              </div>
            )}

            {/* Tab 1: Watch History */}
            {activeTab === "history" && (
              <div className="space-y-2.5">
                {filteredHistory.length === 0 ? (
                  <div className="py-12 text-center text-neutral-500 font-mono text-xs">
                    No history items match &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Thumbnail / Screenshot */}
                        <div className="relative w-20 sm:w-24 aspect-[16/9] rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                          {item.screenshotUrl || item.posterUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.screenshotUrl || item.posterUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <Film className="w-4 h-4 text-neutral-500" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute bottom-0.5 left-1 text-[8px] font-mono text-white/90 font-bold uppercase">
                            {item.type}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-neutral-100 group-hover:text-white truncate font-sans">
                              {item.showTitle ? `${item.showTitle}: ` : ""}{item.title}
                            </h4>
                            {item.rating && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-amber-400 font-semibold shrink-0">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>{item.rating}</span>
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-400 font-mono truncate flex items-center gap-2 mt-0.5">
                            {item.season && item.number && (
                              <Badge variant="subtle" className="text-[9px] px-1.5 py-0.2">
                                S{item.season} E{item.number}
                              </Badge>
                            )}
                            <span>{item.watchedAt}</span>
                            {item.year && <span className="text-neutral-500">• {item.year}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-neutral-400 hover:text-white font-mono flex items-center gap-1 hover:underline"
                          >
                            <span>Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: TV Shows & Series */}
            {activeTab === "shows" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredShows.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-neutral-500 font-mono text-xs">
                    No TV shows match &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  filteredShows.map((show) => (
                    <div
                      key={show.id}
                      className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-neutral-700 transition-all flex gap-3.5 group"
                    >
                      <div className="w-20 aspect-[2/3] rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 shadow-md relative flex items-center justify-center">
                        {show.posterUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={show.posterUrl}
                            alt={show.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        ) : (
                          <Tv className="w-6 h-6 text-neutral-500 m-auto" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-xs sm:text-sm text-white truncate font-sans group-hover:text-neutral-100">
                              {show.title}
                            </h4>
                            {show.rating && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-amber-400 font-semibold shrink-0">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>{show.rating}</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate">
                            {show.year} {show.network && `• ${show.network}`}
                          </div>
                        </div>

                        <div className="pt-2">
                          <Badge variant="subtle" className="text-[9px]">
                            {show.plays} episodes watched
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Movies */}
            {activeTab === "movies" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {filteredMovies.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-neutral-500 font-mono text-xs">
                    No movies match &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  filteredMovies.map((movie) => (
                    <a
                      key={movie.id}
                      href={movie.url || `https://trakt.tv/movies/${encodeURIComponent(movie.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900 transition-all flex flex-col justify-between group"
                    >
                      <div className="aspect-[2/3] w-full rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden mb-2 shadow-md relative flex items-center justify-center">
                        {movie.posterUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <Film className="w-8 h-8 text-neutral-500 m-auto" />
                        )}
                      </div>

                      <div className="px-0.5">
                        <h4 className="font-bold text-xs text-white truncate font-sans group-hover:text-neutral-100">
                          {movie.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mt-1">
                          <span>{movie.year || "Movie"}</span>
                          {movie.rating && (
                            <span className="inline-flex items-center gap-0.5 text-amber-400 font-semibold">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>{movie.rating}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 font-mono shrink-0">
          <span>Connected via Trakt.tv API v2</span>
          <Button variant="default" size="sm" onClick={() => setMovieModalOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
