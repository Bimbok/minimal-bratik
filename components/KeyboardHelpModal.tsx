"use client";

import React, { useEffect } from "react";
import { useThemeContext } from "../lib/theme-context";
import { Keyboard } from "lucide-react";
import { Modal } from "./ui/modal";

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
    <Modal
      isOpen={keyboardHelpOpen}
      onClose={() => setKeyboardHelpOpen(false)}
      title="Keyboard Shortcuts & Keybindings"
      icon={<Keyboard className="w-4.5 h-4.5 text-white" />}
      maxWidth="lg"
      className="bg-[#0e0f12] border-neutral-700 text-xs text-neutral-200"
    >
      {/* Shortcuts List */}
      <div className="space-y-2 bg-[#08090b] -m-4 sm:-m-5 p-5">
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

        {/* Footer info */}
        <div className="pt-3 text-[11px] text-neutral-500 text-center font-mono">
          Neovim & Vim keybindings are enabled globally on desktop!
        </div>
      </div>
    </Modal>
  );
};
