"use client";

import React from "react";
import { useThemeContext, SectionId, ThemeMode } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { Terminal, Volume2, VolumeX, Command, HelpCircle, Palette, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Header: React.FC = () => {
  const {
    theme,
    setTheme,
    isMuted,
    toggleAudio,
    activeSection,
    setActiveSection,
    setCommandPaletteOpen,
    setKeyboardHelpOpen,
  } = useThemeContext();

  const navItems: { id: SectionId; label: string; file: string }[] = [
    { id: "home", label: "/home", file: "home.ts" },
    { id: "skills", label: "~/.skills", file: "skills.json" },
    { id: "projects", label: "/projects", file: "projects.tsx" },
    { id: "lab", label: "/lab", file: "lab.sh" },
    { id: "contact", label: "/contact", file: "contact.yml" },
  ];

  const handleNavClick = (id: SectionId) => {
    setActiveSection(id);
    audioEngine.playKeyClick("down");
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const nextThemeMap: Record<ThemeMode, ThemeMode> = {
    dark: "gruvbox",
    gruvbox: "crt",
    crt: "dark",
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-[var(--border-color)] bg-[var(--bg-main)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Left Monogram / Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-2 group text-left focus:outline-none"
        >
          <div className="p-1.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] group-hover:border-[var(--accent-color)] transition-colors">
            <Terminal className="w-4 h-4 text-[var(--accent-color)]" />
          </div>
          <div className="font-mono text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            <span>bimbok.dev</span>
            <span className="text-[var(--accent-color)] animate-pulse">_</span>
          </div>
        </button>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
          {navItems.map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 focus:outline-none ${
                  isActive
                    ? "text-[var(--accent-color)] font-medium bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                }`}
              >
                <span className="text-[10px] opacity-60">[{idx + 1}]</span>
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-[var(--accent-color)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools & Toggles */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Command Palette Trigger */}
          <button
            onClick={() => {
              audioEngine.playKeyClick("down");
              setCommandPaletteOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-highlight)] transition-colors"
            title="Open Command Palette (Cmd + K or /)"
          >
            <Command className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline px-1 py-0.5 text-[10px] bg-[var(--bg-main)] border border-[var(--border-color)] rounded text-[var(--text-muted)]">
              ⌘K
            </kbd>
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={() => setTheme(nextThemeMap[theme])}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-colors capitalize"
            title="Cycle Theme (Dark -> Gruvbox -> CRT)"
          >
            <Palette className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span className="hidden md:inline">{theme}</span>
          </button>

          {/* Sound Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-1.5 rounded-md border transition-colors ${
              isMuted
                ? "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)]"
                : "bg-[var(--badge-bg)] border-[var(--accent-color)]/40 text-[var(--accent-color)]"
            }`}
            title={isMuted ? "Enable Keyboard Sounds" : "Mute Keyboard Sounds"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Shortcuts Help Toggle */}
          <button
            onClick={() => {
              audioEngine.playKeyClick("down");
              setKeyboardHelpOpen(true);
            }}
            className="p-1.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-highlight)] transition-colors"
            title="Keyboard Shortcuts Cheat Sheet (?)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
