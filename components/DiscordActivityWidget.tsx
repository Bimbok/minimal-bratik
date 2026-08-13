"use client";

import React, { useEffect, useState } from "react";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { Code2, Disc, ExternalLink, Activity } from "lucide-react";

interface SpotifyData {
  track_id: string;
  timestamps?: {
    start: number;
    end: number;
  };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

interface ActivityItem {
  id: string;
  name: string;
  type: number; // 0: Game/Coding, 1: Streaming, 2: Listening, 3: Watching, 4: Custom Status
  state?: string;
  details?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  emoji?: {
    name?: string;
    id?: string;
  };
}

interface LanyardResponse {
  data?: {
    listening_to_spotify?: boolean;
    spotify?: SpotifyData;
    discord_status?: "online" | "idle" | "dnd" | "offline";
    activities?: ActivityItem[];
    discord_user?: {
      username: string;
      id: string;
      avatar: string;
    };
  };
  success?: boolean;
}

export const DiscordActivityWidget: React.FC = () => {
  const [lanyardData, setLanyardData] = useState<LanyardResponse["data"] | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [elapsedStr, setElapsedStr] = useState<string>("0:00");
  const [durationStr, setDurationStr] = useState<string>("0:00");

  const discordUsername = PORTFOLIO_DATA.profile.discordUsername || "bimbokmkj";
  const discordUserId = PORTFOLIO_DATA.profile.discordUserId || "1059779383617306634";

  // Fetch Lanyard API for live Discord status & all active rich presence activities
  useEffect(() => {
    let isMounted = true;

    const fetchLanyardStatus = async () => {
      try {
        // Try numeric ID first, then fallback to username if configured
        let res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
        if (!res.ok) {
          res = await fetch(`https://api.lanyard.rest/v1/users/${discordUsername}`);
        }
        if (!res.ok) return;

        const data: LanyardResponse = await res.json();

        if (isMounted && data.success && data.data) {
          setLanyardData(data.data);
        }
      } catch {
        // Ignore network errors silently
      }
    };

    fetchLanyardStatus();
    const interval = setInterval(fetchLanyardStatus, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [discordUserId, discordUsername]);

  // Real-time track progress timer if listening to Spotify
  useEffect(() => {
    if (!lanyardData?.listening_to_spotify || !lanyardData?.spotify?.timestamps) return;

    const updateProgress = () => {
      const { start, end } = lanyardData.spotify!.timestamps!;
      if (!start || !end) return;

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
  }, [lanyardData]);

  // Filter valid active activities excluding pure status text if empty
  const activeActivities = lanyardData?.activities?.filter((act) => act.type !== 4) || [];
  const customStatus = lanyardData?.activities?.find((act) => act.type === 4);
  const isListeningSpotify = lanyardData?.listening_to_spotify && lanyardData?.spotify;
  const codingOrAppActivity = activeActivities.find((act) => act.type === 0 || act.type === 1 || act.type === 3);

  // RULE: If there is NO active activity currently happening on Discord, HIDE THE WIDGET COMPLETELY!
  if (!isListeningSpotify && !codingOrAppActivity && !customStatus?.state) {
    return null;
  }

  // Get Discord Status Indicator color
  const statusColorMap = {
    online: "bg-emerald-400 border-emerald-950",
    idle: "bg-amber-400 border-amber-950",
    dnd: "bg-red-500 border-red-950",
    offline: "bg-neutral-600 border-neutral-950",
  };
  const statusColor = statusColorMap[lanyardData?.discord_status || "offline"];

  return (
    <div className="rounded-2xl bg-[#0d0e11] border border-neutral-800/90 p-4 sm:p-5 shadow-2xl space-y-3.5 font-mono relative overflow-hidden group">
      
      {/* Background Subtle Pulsing Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between text-xs border-b border-neutral-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
            {lanyardData?.discord_status === "online" && (
              <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
            )}
          </div>

          <span className="font-extrabold text-[11px] uppercase tracking-wider text-neutral-200">
            {isListeningSpotify
              ? "Live on Spotify"
              : codingOrAppActivity
              ? `Discord Activity: ${codingOrAppActivity.name}`
              : "Discord Presence"}
          </span>
        </div>

        {isListeningSpotify ? (
          <span className="text-[10px] text-neutral-400 font-mono">
            {elapsedStr} / {durationStr}
          </span>
        ) : (
          <span className="text-[10px] text-neutral-500 font-mono capitalize">
            @{discordUsername} • {lanyardData?.discord_status || "online"}
          </span>
        )}
      </div>

      {/* 1. SPOTIFY ACTIVITY DISPLAY */}
      {isListeningSpotify && lanyardData.spotify ? (
        <div className="flex items-center gap-3.5 pt-0.5">
          {/* Album Cover Art */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lanyardData.spotify.album_art_url}
              alt={lanyardData.spotify.album}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Song & Artist Meta */}
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-white font-sans truncate hover:text-emerald-400 transition-colors">
              <a
                href={`https://open.spotify.com/track/${lanyardData.spotify.track_id}`}
                target="_blank"
                rel="noreferrer"
              >
                {lanyardData.spotify.song}
              </a>
            </h4>
            <p className="text-[11px] text-neutral-400 truncate">
              {lanyardData.spotify.artist}
            </p>
            <p className="text-[10px] text-neutral-500 truncate font-mono">
              {lanyardData.spotify.album}
            </p>
          </div>

          {/* Open in Spotify button */}
          <a
            href={`https://open.spotify.com/track/${lanyardData.spotify.track_id}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all shrink-0"
            title="Open in Spotify"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
          </a>
        </div>
      ) : codingOrAppActivity ? (
        /* 2. CODING / APP / GAME ACTIVITY DISPLAY */
        <div className="flex items-center gap-3.5 pt-0.5">
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white shrink-0">
            {codingOrAppActivity.name.toLowerCase().includes("code") || codingOrAppActivity.name.toLowerCase().includes("vim") ? (
              <Code2 className="w-6 h-6 text-white" />
            ) : (
              <Activity className="w-6 h-6 text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-white font-sans truncate">
              {codingOrAppActivity.name}
            </h4>
            {codingOrAppActivity.details && (
              <p className="text-[11px] text-neutral-300 truncate">
                {codingOrAppActivity.details}
              </p>
            )}
            {codingOrAppActivity.state && (
              <p className="text-[10px] text-neutral-500 truncate">
                {codingOrAppActivity.state}
              </p>
            )}
          </div>
        </div>
      ) : customStatus?.state ? (
        /* 3. CUSTOM DISCORD STATUS DISPLAY */
        <div className="flex items-center gap-3 pt-0.5">
          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 shrink-0">
            <Disc className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs font-medium text-neutral-200 font-sans italic">
            &ldquo;{customStatus.state}&rdquo;
          </p>
        </div>
      ) : null}

      {/* Progress Bar (when listening to Spotify) */}
      {isListeningSpotify && (
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
