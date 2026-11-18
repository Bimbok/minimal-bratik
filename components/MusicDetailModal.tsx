"use client";

import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { useThemeContext } from "../lib/theme-context";
import { PORTFOLIO_DATA, MusicData } from "../lib/portfolio-data";
import { Modal } from "./ui/modal";
import { Button, LinkButton } from "./ui/button";
import { Badge } from "./ui/badge";
import { LastFmIcon } from "./BrandIcons";
import { Music, Disc, Heart, ExternalLink, Play, Users } from "lucide-react";

export const MusicDetailModal: React.FC<{ musicData?: MusicData }> = ({ musicData: propData }) => {
  const { musicModalOpen, setMusicModalOpen } = useThemeContext();
  const [activeTab, setActiveTab] = useState<"recent" | "artists" | "topTracks">("recent");
  const [liveMusic, setLiveMusic] = useState<MusicData | undefined>(propData || PORTFOLIO_DATA.hobbies.music);

  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  // Fetch live scrobbles directly from our Last.fm API endpoint with 4-second real-time polling
  useEffect(() => {
    if (!musicModalOpen) return;
    let isMounted = true;

    const fetchLive = async () => {
      try {
        const res = await fetch(
          `/api/lastfm?username=${PORTFOLIO_DATA.hobbies.music?.lastfmUsername || "bimbokmkj"}&t=${Date.now()}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data?.success && data?.music) {
          setLiveMusic(data.music);
        }
      } catch {
        // Keep existing data
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [musicModalOpen]);

  // Lock outer body scroll while modal is active
  useEffect(() => {
    const mainLenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (musicModalOpen) {
      if (mainLenis) mainLenis.stop();
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (mainLenis) mainLenis.start();
      document.body.style.overflow = "";
    };
  }, [musicModalOpen]);

  // Dedicated Lenis smooth momentum scrolling inside the modal
  useEffect(() => {
    if (!musicModalOpen || !scrollWrapperRef.current || !scrollContentRef.current) return;

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
  }, [musicModalOpen, activeTab, liveMusic]);

  const music = liveMusic || PORTFOLIO_DATA.hobbies.music;
  if (!music) return null;

  const stats = music.stats;
  const recentTracks = music.recentTracks;
  const topArtists = music.topArtists || [];
  const topTrack = music.topTrack;

  return (
    <Modal
      isOpen={musicModalOpen}
      onClose={() => setMusicModalOpen(false)}
      title="Music & Last.fm Streaming Vault"
      icon={<LastFmIcon className="w-4.5 h-4.5 text-[#D51007]" />}
      maxWidth="4xl"
      className="bg-[#0c0d10] border-neutral-800 text-neutral-200"
      headerActions={
        <LinkButton
          variant="secondary"
          size="sm"
          href={music.lastfmProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs gap-1.5"
        >
          <span>Last.fm Profile</span>
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
                src="/banner.png"
                alt="Bimbok"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center">
                <LastFmIcon className="w-3 h-3 text-[#D51007]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white font-sans tracking-tight">
                  {music.lastfmUsername}
                </h3>
                <Badge variant="subtle" className="text-[10px]">
                  Scrobbler
                </Badge>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Bollywood, Indian Indie, Sufi & Acoustic Flow State
              </p>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-center">
            <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="text-sm sm:text-base font-extrabold text-white">{stats.scrobbles.toLocaleString()}</div>
              <div className="text-[10px] text-neutral-500 uppercase">Scrobbles</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="text-sm sm:text-base font-extrabold text-white">{stats.artists}</div>
              <div className="text-[10px] text-neutral-500 uppercase">Artists</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="text-sm sm:text-base font-extrabold text-white">{stats.lovedTracks}</div>
              <div className="text-[10px] text-neutral-500 uppercase">Loved</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <Button
              variant={activeTab === "recent" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("recent")}
            >
              <Disc className="w-3.5 h-3.5" />
              <span>Recent Scrobbles ({recentTracks.length})</span>
            </Button>
            <Button
              variant={activeTab === "artists" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("artists")}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Top Artists</span>
            </Button>
            <Button
              variant={activeTab === "topTracks" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("topTracks")}
            >
              <Heart className="w-3.5 h-3.5 text-[#D51007]" />
              <span>Obsessions & Favorites</span>
            </Button>
          </div>

          <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
            Scrobbling from LastWave & YouTube Music
          </span>
        </div>

        {/* Dedicated Smooth Scrollable Body with Lenis momentum */}
        <div
          ref={scrollWrapperRef}
          data-lenis-prevent="true"
          className="overflow-y-auto max-h-[55vh] sm:max-h-[58vh] pr-1.5 focus:outline-none"
        >
          <div ref={scrollContentRef} className="space-y-4">
            {/* Tab 1: Recent Tracks */}
            {activeTab === "recent" && (
              <div className="space-y-2">
                {recentTracks.map((track, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-neutral-700 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-11 h-11 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                        {track.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={track.imageUrl}
                            alt={track.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget.parentElement?.querySelector(".music-fallback");
                              if (fallback) (fallback as HTMLElement).classList.remove("hidden");
                            }}
                          />
                        ) : null}
                        <Music className={`w-4 h-4 text-neutral-500 music-fallback ${track.imageUrl ? "hidden" : ""}`} />
                        {track.nowPlaying && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="flex items-center gap-0.5 h-3">
                              <span className="w-0.5 h-full bg-emerald-400 rounded-full animate-pulse" />
                              <span className="w-0.5 h-2/3 bg-emerald-400 rounded-full animate-pulse [animation-delay:150ms]" />
                              <span className="w-0.5 h-4/5 bg-emerald-400 rounded-full animate-pulse [animation-delay:300ms]" />
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <a
                            href={track.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-xs sm:text-sm text-neutral-100 hover:text-white truncate font-sans hover:underline"
                          >
                            {track.name}
                          </a>
                          {track.nowPlaying && (
                            <Badge variant="status" className="text-emerald-400 border-emerald-800/60 bg-emerald-950/50">
                              Now Playing
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 font-mono truncate">
                          {track.artist} {track.album && <span className="text-neutral-500">• {track.album}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-right font-mono text-[11px] text-neutral-500">
                      <span>{track.playedAt}</span>
                      {track.url && (
                        <a
                          href={track.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-white transition-opacity"
                          title="Open on Last.fm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Top Artists */}
            {activeTab === "artists" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {topArtists.map((artist, idx) => (
                  <a
                    key={artist.name}
                    href={artist.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 text-center font-mono font-bold text-neutral-500 text-xs">
                        #{idx + 1}
                      </span>
                      <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-white font-bold text-xs">
                        {artist.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-white truncate font-sans group-hover:text-neutral-100">
                          {artist.name}
                        </h4>
                        {artist.playcount && (
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {artist.playcount} scrobbles
                          </span>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-neutral-600 group-hover:text-white transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            )}

            {/* Tab 3: Top Tracks / Obsessions */}
            {activeTab === "topTracks" && (
              <div className="space-y-4">
                {topTrack && (
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#D51007] shrink-0 shadow-lg">
                        <Heart className="w-6 h-6 fill-current" />
                      </div>
                      <div>
                        <Badge variant="accent" className="mb-1 text-[10px]">
                          Current #1 All-Time Obsession
                        </Badge>
                        <h4 className="font-bold text-sm text-white font-sans">{topTrack.name}</h4>
                        <p className="text-xs text-neutral-400 font-mono">{topTrack.artist} • {topTrack.album}</p>
                      </div>
                    </div>
                    {topTrack.url && (
                      <LinkButton
                        variant="secondary"
                        size="sm"
                        href={topTrack.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Listen</span>
                        <Play className="w-3 h-3 fill-current" />
                      </LinkButton>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-xs font-bold text-neutral-400 font-mono">Curated Loved Tracks</div>
                  {recentTracks.slice(0, 8).map((track, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-neutral-950/50 border border-neutral-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Heart className="w-3.5 h-3.5 text-[#D51007] fill-current shrink-0" />
                        <span className="font-semibold text-white font-sans truncate">{track.name}</span>
                        <span className="text-neutral-500 font-mono text-[11px] truncate">— {track.artist}</span>
                      </div>
                      <Badge variant="subtle" className="text-[9px]">Loved</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 font-mono shrink-0">
          <span>Connected via Last.fm Scrobbler API</span>
          <Button variant="default" size="sm" onClick={() => setMusicModalOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
