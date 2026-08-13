"use client";

import React from "react";
import { useThemeContext } from "../lib/theme-context";
import { Keyboard, X, Terminal, Command } from "lucide-react";

export const KeyboardHelpModal: React.FC = () => {
  const { keyboardHelpOpen, setKeyboardHelpOpen } = useThemeContext();

  if (!keyboardHelpOpen) return null;

  const shortcuts = [
    { key: "j / k", action: "Scroll down / up smoothly" },
    { key: "gg", action: "Jump to top of page" },
    { key: "G", action: "Jump to bottom of page" },
    { key: "1 - 5", action: "Jump directly to tab section 1-5" },
    { key: "⌘K or /", action: "Open Command Palette search modal" },
    { key: ":", action: "Open Vim floating command prompt input" },
    { key: "?", action: "Toggle this Keyboard Shortcuts help sheet" },
    { key: "ESC", action: "Close active prompt or modal window" },
    { key: "↑ ↑ ↓ ↓ ← → ← → B A", action: "Konami Code: Trigger CRT Retro & Matrix Rain" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div
        className="fixed inset-0"
        onClick={() => setKeyboardHelpOpen(false)}
      />

      <div className="relative w-full max-w-lg rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl overflow-hidden z-10 text-xs text-[var(--text-primary)]">
        
        {/* Header */}
        <div className="px-4 py-3 bg-[var(--terminal-bg)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[var(--accent-color)]" />
            <span className="font-bold">Keyboard Shortcuts & Keybindings</span>
          </div>
          <button
            onClick={() => setKeyboardHelpOpen(false)}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-5 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded bg-[var(--bg-main)] border border-[var(--border-color)] text-xs"
            >
              <kbd className="px-2 py-1 rounded bg-[var(--terminal-bg)] border border-[var(--border-highlight)] text-[var(--accent-color)] font-bold text-[11px]">
                {sc.key}
              </kbd>
              <span className="text-[var(--text-secondary)] text-right">{sc.action}</span>
            </div>
          ))}
        </div>

        <div className="px-4 py-2 bg-[var(--terminal-bg)] border-t border-[var(--border-color)] text-[10px] text-[var(--text-muted)] text-center">
          Neovim & Vim keybindings are enabled globally on desktop!
        </div>

      </div>
    </div>
  );
};
