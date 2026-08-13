"use client";

import React, { useEffect, useState } from "react";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { Code2, Disc, ExternalLink, Activity, Radio, Sparkles } from "lucide-react";

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
  error?: {
    code?: string;
    message?: string;
  };
  success?: boolean;
}

export const DiscordActivityWidget: React.FC = () => {
  const [lanyardData, setLanyardData] = useState<LanyardResponse["data"] | null>(null);
  const [isNotMonitored, setIsNotMonitored] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [elapsedStr, setElapsedStr] = useState<string>("0:00");
  const [durationStr, setDurationStr] = useState<string>("0:00");

  const discordUsername = PORTFOLIO_DATA.profile.discordUsername || "bimbokmkj";
  const discordUserId = PORTFOLIO_DATA.profile.discordUserId || "1282246489430818827";

  useEffect(() => {
    let isMounted = true;

    const fetchLanyardStatus = async () => {
      try {
        let res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
        if (!res.ok) {
          res = await fetch(`https://api.lanyard.rest/v1/users/${discordUsername}`);
        }
        
        const data: LanyardResponse = await res.json();

        if (isMounted) {
          if (data.error?.code === "user_not_monitored") {
            setIsNotMonitored(true);
            setLanyardData(null);
          } else if (data.success && data.data) {
            setIsNotMonitored(false);
            setLanyardData(data.data);
          }
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

  // Real-time track progress timer for Spotify
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

  // Helper to map activity names (Neovim, Obsidian, VS Code, Arch, etc.) to skillicons.dev icons
  const getActivityIconUrl = (act: ActivityItem): string | null => {
    const name = act.name.toLowerCase();
    if (name.includes("neovim") || name.includes("nvim") || name.includes("vim")) {
      return "https://skillicons.dev/icons?i=vim&theme=dark";
    }
    if (name.includes("obsidian")) {
      return "https://skillicons.dev/icons?i=obsidian&theme=dark";
    }
    if (name.includes("visual studio code") || name.includes("vscode") || name.includes("code")) {
      return "https://skillicons.dev/icons?i=vscode&theme=dark";
    }
    if (name.includes("arch") || name.includes("linux")) {
      return "https://skillicons.dev/icons?i=arch&theme=dark";
    }
    if (name.includes("github")) {
      return "https://skillicons.dev/icons?i=github&theme=dark";
    }

    if (act.assets?.large_image) {
      if (act.assets.large_image.startsWith("mp:external/")) {
        const match = act.assets.large_image.match(/https\/(.*)$/);
        if (match) return `https://${match[1]}`;
      } else if (act.assets.large_image.startsWith("https://")) {
        return act.assets.large_image;
      }
    }
    return null;
  };

  // If Lanyard is not monitored yet, render notice
  if (isNotMonitored) {
    return (
      <div className="rounded-2xl bg-[#0d0e11] border border-neutral-800 p-4 sm:p-5 shadow-2xl font-mono space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Discord Presence Setup Required</span>
          </div>
          <span className="text-[10px] text-neutral-500">@{discordUsername}</span>
        </div>
        <p className="text-xs text-neutral-300 font-sans">
          To show your live Discord activity (Neovim, Obsidian, Spotify, Games & Status) on your portfolio, join the Lanyard Discord server once:
        </p>
        <div className="pt-1">
          <a
            href="https://discord.gg/lanyard"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-all shadow-md"
          >
            <span>Join Lanyard Discord Server (1-Click)</span>
            <ExternalLink className="w-3.5 h-3.5 text-black" />
          </a>
        </div>
      </div>
    );
  }

  // Filter activities
  const activeAppActivities = lanyardData?.activities?.filter((act) => act.type === 0 || act.type === 1 || act.type === 3) || [];
  const customStatus = lanyardData?.activities?.find((act) => act.type === 4);
  const isListeningSpotify = lanyardData?.listening_to_spotify && lanyardData?.spotify;

  // RULE: If nothing active is happening on Discord, HIDE COMPLETELY!
  if (!isListeningSpotify && activeAppActivities.length === 0 && !customStatus?.state) {
    return null;
  }

  const statusColorMap = {
    online: "bg-emerald-400 shadow-emerald-500/50",
    idle: "bg-amber-400 shadow-amber-500/50",
    dnd: "bg-red-500 shadow-red-500/50",
    offline: "bg-neutral-600 shadow-neutral-600/50",
  };
  const statusColor = statusColorMap[lanyardData?.discord_status || "online"];

  return (
    <div className="rounded-2xl bg-[#0b0c0f]/95 border border-neutral-800/90 p-4 sm:p-5 shadow-2xl space-y-4 font-mono relative overflow-hidden group backdrop-blur-xl">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-emerald-500/15 transition-all duration-700" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-gradient-to-tr from-neutral-800/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between text-xs border-b border-neutral-800/70 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className={`w-2.5 h-2.5 rounded-full ${statusColor} shadow-sm`} />
            {lanyardData?.discord_status === "online" && (
              <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-white font-sans">
              Discord Activity Presence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-400 font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800/80">
            @{discordUsername} • <span className="capitalize">{lanyardData?.discord_status || "online"}</span>
          </span>
        </div>
      </div>

      {/* Custom Status Banner */}
      {customStatus?.state && (
        <div className="flex items-center gap-2.5 text-xs font-sans text-neutral-200 bg-neutral-950/70 p-3 rounded-xl border border-neutral-800/80 shadow-inner group/status hover:border-neutral-700 transition-all">
          <div className="p-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 shrink-0">
            <Disc className="w-3.5 h-3.5 text-white group-hover/status:rotate-180 transition-transform duration-700" />
          </div>
          <span className="font-mono text-[11px] tracking-tight italic text-neutral-300">
            &ldquo;{customStatus.state}&rdquo;
          </span>
        </div>
      )}

      {/* Render Active App Activities (Neovim, Obsidian, VS Code) */}
      {activeAppActivities.map((act) => {
        const iconUrl = getActivityIconUrl(act);

        return (
          <div
            key={act.id}
            className="flex items-center gap-4 bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-950 transition-all duration-300 shadow-md group/card"
          >
            {iconUrl ? (
              <div className="w-11 h-11 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shrink-0 p-1 flex items-center justify-center shadow-lg group-hover/card:scale-105 transition-transform duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={iconUrl}
                  alt={act.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white shrink-0 shadow-lg group-hover/card:scale-105 transition-transform duration-300">
                {act.name.toLowerCase().includes("code") || act.name.toLowerCase().includes("vim") ? (
                  <Code2 className="w-5 h-5 text-white" />
                ) : (
                  <Activity className="w-5 h-5 text-white" />
                )}
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-white font-sans tracking-tight">
                  {act.name}
                </h4>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
                  ACTIVE APP
                </span>
              </div>

              {act.details && (
                <p className="text-[11px] text-neutral-200 font-mono truncate font-medium">
                  {act.details}
                </p>
              )}
              {act.state && (
                <p className="text-[10px] text-neutral-400 font-mono truncate">
                  {act.state}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Render Spotify Activity (if listening) */}
      {isListeningSpotify && lanyardData.spotify && (
        <div className="space-y-3 bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300 shadow-md">
          {/* Spotify Sub-Header */}
          <div className="flex items-center justify-between text-[11px] font-mono border-b border-neutral-900 pb-2">
            <div className="flex items-center gap-2">
              {/* 60FPS Equalizer Animation */}
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-full bg-emerald-400 rounded-full animate-pulse" />
                <span className="w-0.5 h-2/3 bg-emerald-400 rounded-full animate-pulse [animation-delay:200ms]" />
                <span className="w-0.5 h-4/5 bg-emerald-400 rounded-full animate-pulse [animation-delay:400ms]" />
              </div>
              <span className="font-extrabold text-emerald-400 uppercase tracking-wider text-[10px] font-sans">
                Listening to Spotify
              </span>
            </div>

            <span className="text-[10px] text-neutral-400">
              {elapsedStr} / {durationStr}
            </span>
          </div>

          <div className="flex items-center gap-3.5 pt-0.5">
            {/* Album Cover */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lanyardData.spotify.album_art_url}
                alt={lanyardData.spotify.album}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Song Meta */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-white font-sans truncate hover:text-emerald-400 transition-colors">
                <a
                  href={`https://open.spotify.com/track/${lanyardData.spotify.track_id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {lanyardData.spotify.song}
                </a>
              </h4>
              <p className="text-[11px] text-neutral-400 truncate font-sans">
                {lanyardData.spotify.artist}
              </p>
            </div>

            <a
              href={`https://open.spotify.com/track/${lanyardData.spotify.track_id}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-emerald-500/50 hover:bg-neutral-800 transition-all shrink-0 shadow-md"
              title="Open in Spotify"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          </div>

          {/* Smooth Gradient Progress Bar */}
          <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-neutral-800/80 relative">
            <div
              className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 h-full transition-all duration-1000 ease-linear rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
