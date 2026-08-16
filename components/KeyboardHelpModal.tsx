"use client";

import React, { useEffect } from "react";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { Keyboard, X } from "lucide-react";

export const KeyboardHelpModal: React.FC = () => {
  const { keyboardHelpOpen, setKeyboardHelpOpen } = useThemeContext();

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (keyboardHelpOpen) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
    };
  }, [keyboardHelpOpen]);

  if (!keyboardHelpOpen) return null;

  const shortcuts = [
    { key: "j / k", action: "Scroll down / up smoothly" },
    { key: "gg", action: "Jump to top of page" },
    { key: "G", action: "Jump to bottom of page" },
    { key: "1 - 4", action: "Jump directly to tab section 1-4" },
    { key: "⌘K or /", action: "Open Command Palette search modal" },
    { key: ":", action: "Open Vim floating command prompt input" },
    { key: "?", action: "Toggle this Keyboard Shortcuts help sheet" },
    { key: "ESC", action: "Close active prompt or modal window" },
    { key: "↑ ↑ ↓ ↓ ← → ← → B A", action: "Konami Code: Trigger CRT Retro & Matrix Rain" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 font-mono">
      <div
        className="fixed inset-0"
        onClick={() => {
          audioEngine.playKeyClick("down");
          setKeyboardHelpOpen(false);
        }}
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-[#0e0f12] border border-neutral-700 shadow-2xl overflow-hidden z-10 text-xs text-neutral-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-4.5 h-4.5 text-white" />
            <span className="font-extrabold text-sm text-white font-sans tracking-tight">
              Keyboard Shortcuts & Keybindings
            </span>
          </div>
          <button
            onClick={() => {
              audioEngine.playKeyClick("down");
              setKeyboardHelpOpen(false);
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-5 space-y-2 max-h-[70vh] overflow-y-auto bg-[#08090b]">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-xs hover:border-neutral-700 transition-colors"
            >
              <kbd className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-white font-bold text-[11px] font-mono shadow-inner">
                {sc.key}
              </kbd>
              <span className="text-neutral-300 text-right font-sans text-xs font-medium pl-3">
                {sc.action}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-400 text-center font-mono">
          Neovim & Vim keybindings are enabled globally on desktop!
        </div>

      </div>
    </div>
  );
};
