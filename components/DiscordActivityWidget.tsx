"use client";

import React, { useEffect, useState } from "react";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { Code2, Disc, ExternalLink, Activity, Radio } from "lucide-react";

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
  const discordUserId = PORTFOLIO_DATA.profile.discordUserId || "1059779383617306634";

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

  // If Lanyard is not monitored yet, render 1-click notice to join Lanyard server
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
          To show your live Discord activity (Neovim, Spotify, Games & Status) on your portfolio, join the Lanyard Discord server once:
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
    online: "bg-emerald-400 border-emerald-950",
    idle: "bg-amber-400 border-amber-950",
    dnd: "bg-red-500 border-red-950",
    offline: "bg-neutral-600 border-neutral-950",
  };
  const statusColor = statusColorMap[lanyardData?.discord_status || "online"];

  return (
    <div className="rounded-2xl bg-[#0d0e11] border border-neutral-800/90 p-4 sm:p-5 shadow-2xl space-y-4 font-mono relative overflow-hidden group">
      
      {/* Background Subtle Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700" />

      {/* Top Header */}
      <div className="flex items-center justify-between text-xs border-b border-neutral-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
            {lanyardData?.discord_status === "online" && (
              <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
            )}
          </div>

          <span className="font-extrabold text-[11px] uppercase tracking-wider text-neutral-200">
            Discord Activity Presence
          </span>
        </div>

        <span className="text-[10px] text-neutral-400 font-mono">
          @{discordUsername} • {lanyardData?.discord_status || "online"}
        </span>
      </div>

      {/* Custom Status Quote (if set) */}
      {customStatus?.state && (
        <div className="flex items-center gap-2 text-xs font-sans text-neutral-300 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/60 italic">
          <Disc className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>&ldquo;{customStatus.state}&rdquo;</span>
        </div>
      )}

      {/* Render All Active App Activities (e.g. Neovim, VS Code) */}
      {activeAppActivities.map((act) => (
        <div key={act.id} className="flex items-center gap-3.5 bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/80">
          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white shrink-0">
            {act.name.toLowerCase().includes("code") || act.name.toLowerCase().includes("vim") ? (
              <Code2 className="w-5 h-5 text-white" />
            ) : (
              <Activity className="w-5 h-5 text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-white font-sans truncate">
              {act.name}
            </h4>
            {act.details && (
              <p className="text-[11px] text-neutral-300 truncate">
                {act.details}
              </p>
            )}
            {act.state && (
              <p className="text-[10px] text-neutral-500 truncate">
                {act.state}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Render Spotify Activity (if listening) */}
      {isListeningSpotify && lanyardData.spotify && (
        <div className="space-y-2 bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/80">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 pb-1">
            <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Listening to Spotify
            </span>
            <span>{elapsedStr} / {durationStr}</span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 shrink-0 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lanyardData.spotify.album_art_url}
                alt={lanyardData.spotify.album}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <h4 className="text-xs font-bold text-white font-sans truncate hover:text-emerald-400 transition-colors">
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
            </div>

            <a
              href={`https://open.spotify.com/track/${lanyardData.spotify.track_id}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-all shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          </div>

          <div className="w-full bg-neutral-900 rounded-full h-1 overflow-hidden border border-neutral-800/60 mt-1">
            <div
              className="bg-emerald-400 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
