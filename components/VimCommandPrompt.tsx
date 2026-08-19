"use client";

import React, { useState, useEffect, useRef } from "react";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { useThemeContext, ThemeMode } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { Terminal, X } from "lucide-react";

export const VimCommandPrompt: React.FC = () => {
  const {
    vimPromptOpen,
    setVimPromptOpen,
    setSelectedProject,
    setTheme,
    setResumeOpen,
    setAnimeModalOpen,
    setNeofetchOpen,
    setMatrixRainActive,
    toggleAudio,
    showToast,
    setCommandPaletteOpen,
    setKeyboardHelpOpen,
  } = useThemeContext();

  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (vimPromptOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInputVal("");
    }
  }, [vimPromptOpen]);

  if (!vimPromptOpen) return null;

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) {
      setVimPromptOpen(false);
      return;
    }

    audioEngine.playKeyClick("enter");
    const parts = trimmed.split(" ");
    const main = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase();

    // Check commands
    if (main === "cat" && (arg === "resume" || arg === "resume.txt")) {
      setVimPromptOpen(false);
      setResumeOpen(true);
      showToast("Opened resume modal");
    } else if (main === "anime" || (main === "cat" && arg === "anime")) {
      setVimPromptOpen(false);
      setAnimeModalOpen(true);
      showToast("Opened Anime Watchlist & Jikan Archive");
    } else if (main === "fetch" || main === "neofetch") {
      setVimPromptOpen(false);
      setNeofetchOpen(true);
      showToast("Opened system specs neofetch");
    } else if (main === "home" || main === "skills" || main === "projects" || main === "hobbies" || main === "contact") {
      setVimPromptOpen(false);
      const elem = document.getElementById(main);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        showToast(`Navigated to /${main}`);
      }
    } else if (main === "p" || main === "project") {
      setVimPromptOpen(false);
      if (arg) {
        const found = PORTFOLIO_DATA.projects.find(
          (p) => p.id.toLowerCase().includes(arg) || p.title.toLowerCase().includes(arg)
        );
        if (found) {
          setSelectedProject(found);
          showToast(`Opened ${found.title}`);
        } else {
          audioEngine.playError();
          showToast(`Project "${arg}" not found. Type :projects`);
        }
      } else {
        const elem = document.getElementById("projects");
        if (elem) elem.scrollIntoView({ behavior: "smooth" });
      }
    } else if (main === "theme") {
      if (arg === "dark" || arg === "gruvbox" || arg === "crt") {
        setTheme(arg as ThemeMode);
        setVimPromptOpen(false);
        showToast(`Theme changed to ${arg}`);
      } else {
        audioEngine.playError();
        showToast("Usage: :theme [dark | gruvbox | crt]");
      }
    } else if (main === "matrix") {
      setMatrixRainActive((prev) => !prev);
      setVimPromptOpen(false);
      showToast("Toggled Matrix Code Rain");
    } else if (main === "sound" || main === "mute") {
      toggleAudio();
      setVimPromptOpen(false);
      showToast("Audio toggled");
    } else if (main === "clear" || main === "q" || main === "w" || main === "wq") {
      setVimPromptOpen(false);
      setCommandPaletteOpen(false);
      setKeyboardHelpOpen(false);
    } else if (main === "help") {
      setVimPromptOpen(false);
      setKeyboardHelpOpen(true);
    } else {
      audioEngine.playError();
      showToast(`Unknown vim command: :${trimmed}. Type :help`);
      setVimPromptOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(inputVal);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setVimPromptOpen(false);
    }
  };

  return (
    <div className="fixed bottom-14 left-2 right-2 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in slide-in-from-bottom-2 duration-150 font-mono">
      <div className="p-3.5 rounded-xl bg-[#0e0f12] border border-neutral-700 shadow-2xl text-xs text-neutral-200 space-y-2.5">
        
        <div className="flex items-center justify-between text-[10px] text-neutral-300 font-bold pb-1.5 border-b border-neutral-800">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-white" />
            <span>VIM COMMAND PROMPT</span>
          </span>
          <button
            onClick={() => setVimPromptOpen(false)}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white font-extrabold text-sm">:</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="cat resume | fetch | theme dark | matrix | q"
            className="w-full bg-transparent text-white focus:outline-none placeholder:text-neutral-500 text-xs font-mono"
          />
          <button
            onClick={() => executeCommand(inputVal)}
            className="px-2.5 py-1 rounded-lg bg-white text-black font-extrabold text-[10px] hover:bg-neutral-200 transition-all shadow-md shrink-0"
          >
            Run
          </button>
        </div>

        <div className="text-[9px] text-neutral-500 flex items-center justify-between pt-1 border-t border-neutral-800/60">
          <span>Try: <code className="text-neutral-300">cat resume</code>, <code className="text-neutral-300">fetch</code></span>
          <span>[ESC to exit]</span>
        </div>

      </div>
    </div>
  );
};
