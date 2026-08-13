"use client";

import React, { useEffect, useState } from "react";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { Music, ExternalLink, Disc } from "lucide-react";

interface SpotifyData {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

interface LanyardResponse {
  data?: {
    listening_to_spotify?: boolean;
    spotify?: SpotifyData;
    discord_status?: string;
  };
  success?: boolean;
}

export const SpotifyStatusWidget: React.FC = () => {
  const [spotify, setSpotify] = useState<SpotifyData | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [elapsedStr, setElapsedStr] = useState<string>("0:00");
  const [durationStr, setDurationStr] = useState<string>("0:00");

  const discordUserId = PORTFOLIO_DATA.profile.discordUserId || "1059779383617306634";

  // Fetch Lanyard API for live Spotify status
  useEffect(() => {
    let isMounted = true;

    const fetchSpotifyStatus = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
        if (!res.ok) return;
        const data: LanyardResponse = await res.json();

        if (isMounted && data.success && data.data) {
          if (data.data.listening_to_spotify && data.data.spotify) {
            setSpotify(data.data.spotify);
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
          }
        }
      } catch {
        // Ignore network errors silently
      }
    };

    fetchSpotifyStatus();
    const interval = setInterval(fetchSpotifyStatus, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [discordUserId]);

  // Real-time track progress calculation timer
  useEffect(() => {
    if (!isPlaying || !spotify?.timestamps) return;

    const updateProgress = () => {
      const { start, end } = spotify.timestamps;
      const now = Date.now();
      const total = end - start;
      const current = now - start;

      const pct = Math.min(100, Math.max(0, (current / total) * 100));
      setProgress(pct);

      const elSec = Math.floor(current / 1000);
      const durSec = Math.floor(total / 1000);

      const formatTime = (sec: number) => {
        const m = Math.floor(Math.max(0, sec) / 60);
        const s = Math.floor(Math.max(0, sec) % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
      };

      setElapsedStr(formatTime(elSec));
      setDurationStr(formatTime(durSec));
    };

    updateProgress();
    const timer = setInterval(updateProgress, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, spotify]);

  return (
    <div className="rounded-2xl bg-[#0d0e11] border border-neutral-800/90 p-4 sm:p-5 shadow-2xl space-y-3 font-mono relative overflow-hidden group">
      
      {/* Background Subtle Pulsing Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between text-xs border-b border-neutral-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          ) : (
            <Disc className="w-4 h-4 text-neutral-500" />
          )}

          <span className="font-extrabold text-[11px] uppercase tracking-wider text-neutral-300">
            {isPlaying ? "Live on Spotify" : "Spotify — Vibe Mode"}
          </span>
        </div>

        {isPlaying && (
          <span className="text-[10px] text-neutral-400 font-mono">
            {elapsedStr} / {durationStr}
          </span>
        )}
      </div>

      {/* Track Info & Artwork */}
      {isPlaying && spotify ? (
        <div className="flex items-center gap-3.5 pt-1">
          {/* Album Cover Art */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={spotify.album_art_url}
              alt={spotify.album}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Song & Artist Meta */}
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-white font-sans truncate hover:text-emerald-400 transition-colors">
              <a
                href={`https://open.spotify.com/track/${spotify.track_id}`}
                target="_blank"
                rel="noreferrer"
              >
                {spotify.song}
              </a>
            </h4>
            <p className="text-[11px] text-neutral-400 truncate">
              {spotify.artist}
            </p>
            <p className="text-[10px] text-neutral-500 truncate font-mono">
              {spotify.album}
            </p>
          </div>

          {/* Open in Spotify link */}
          <a
            href={`https://open.spotify.com/track/${spotify.track_id}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all shrink-0"
            title="Open in Spotify"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
          </a>
        </div>
      ) : (
        /* Offline Fallback Card */
        <div className="flex items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400">
              <Music className="w-5 h-5 text-neutral-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-200 font-sans">
                Deep Focus & Coding Playlist
              </p>
              <p className="text-[11px] text-neutral-500 font-mono">
                Currently listening offline or in deep work
              </p>
            </div>
          </div>

          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-all text-[11px] flex items-center gap-1.5 shrink-0"
          >
            <span>Spotify Profile</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </a>
        </div>
      )}

      {/* Progress Bar (when playing) */}
      {isPlaying && (
        <div className="w-full bg-neutral-900 rounded-full h-1 overflow-hidden border border-neutral-800/60">
          <div
            className="bg-emerald-400 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

    </div>
  );
};
