"use client";

import React, { useState, useEffect } from "react";
import { useThemeContext, SectionId } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { GitBranch, Clock, Volume2, VolumeX, Terminal } from "lucide-react";

export const StatusBar: React.FC = () => {
  const {
    vimMode,
    activeSection,
    isMuted,
    toggleAudio,
    setVimPromptOpen,
  } = useThemeContext();

  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      const secs = String(now.getSeconds()).padStart(2, "0");
      setTimeStr(`${hours}:${mins}:${secs}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const sectionFileMap: Record<SectionId, string> = {
    home: "1: home.ts",
    skills: "2: skills.json",
    projects: "3: projects.tsx",
    lab: "4: lab.sh",
    contact: "5: contact.yml",
  };

  const vimModeBgMap = {
    NORMAL: "bg-white text-black font-extrabold shadow-md",
    COMMAND: "bg-neutral-200 text-black font-extrabold shadow-md",
    VISUAL: "bg-neutral-300 text-black font-extrabold shadow-md",
  };

  return (
    <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[94%] sm:w-auto px-3.5 py-1.5 rounded-2xl bg-[#0b0c0e]/90 border border-neutral-800/90 shadow-2xl backdrop-blur-xl font-mono text-[11px] select-none flex items-center justify-between gap-4 transition-all duration-300">
      
      {/* Left Group: Vim mode & Active Buffer section */}
      <div className="flex items-center gap-2">
        {/* Vim Mode badge */}
        <span
          className={`px-2.5 py-0.5 rounded-lg uppercase tracking-wider text-[10px] ${
            vimModeBgMap[vimMode] || "bg-white text-black font-extrabold shadow-md"
          }`}
        >
          -- {vimMode} --
        </span>

        {/* Current Buffer File */}
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-neutral-200 font-semibold">
          <Terminal className="w-3 h-3 text-neutral-400" />
          <span>{sectionFileMap[activeSection]}</span>
        </span>

        {/* Git Branch Status */}
        <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-neutral-400">
          <GitBranch className="w-3 h-3 text-neutral-300" />
          <span>main*</span>
        </span>
      </div>

      {/* Center Group: Vim Navigation Hints (Desktop) */}
      <div className="hidden lg:flex items-center gap-3 text-neutral-500 text-[10px]">
        <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold">j/k</kbd> scroll</span>
        <span>•</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-white font-semibold">⌘K</kbd> palette</span>
        <span>•</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold">?</kbd> help</span>
      </div>

      {/* Right Group: Time, Audio Toggle & Mobile Triggers */}
      <div className="flex items-center gap-2.5">
        
        {/* Mobile quick trigger for Vim Prompt */}
        <button
          onClick={() => {
            audioEngine.playKeyClick("down");
            setVimPromptOpen(true);
          }}
          className="lg:hidden px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 font-bold text-[10px]"
          title="Open Vim Command Prompt (:)"
        >
          :cmd
        </button>

        {/* Real-time Time Clock */}
        <span className="flex items-center gap-1.5 text-neutral-300 bg-neutral-900/80 px-2 py-0.5 rounded-lg border border-neutral-800/80">
          <Clock className="w-3 h-3 text-neutral-400" />
          <span suppressHydrationWarning>{timeStr || "12:00:00"}</span>
        </span>

        {/* Audio Toggle button */}
        <button
          onClick={toggleAudio}
          className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors bg-neutral-900/80 px-2 py-0.5 rounded-lg border border-neutral-800/80"
          title={isMuted ? "Audio Muted" : "Audio Active"}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-white" />
          )}
          <span className="hidden md:inline text-[10px] font-semibold">{isMuted ? "MUTED" : "SOUND ON"}</span>
        </button>
      </div>

    </footer>
  );
};
