"use client";

import React from "react";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { Cpu, X, Terminal, Copy, Check } from "lucide-react";

export const NeofetchModal: React.FC = () => {
  const { neofetchOpen, setNeofetchOpen, showToast } = useThemeContext();
  const [copied, setCopied] = React.useState(false);

  if (!neofetchOpen) return null;

  const specs = PORTFOLIO_DATA.systemSpecs;

  const handleCopySpecs = () => {
    navigator.clipboard.writeText(JSON.stringify(specs, null, 2));
    setCopied(true);
    audioEngine.playKeyClick("enter");
    showToast("System specs copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const asciiLogo = `
       /\\         bimbok@hyprland-workstation
      /  \\        -------------------------
     /\\   \\       OS: Arch Linux x86_64
    /      \\      Host: ThinkPad X1 Carbon Gen 11
   /   ,,   \\     Kernel: 6.12.8-arch1-1
  /   |  |  -\\    Uptime: 14 days, 6 hours
 /_-''    ''-_\\   Shell: zsh 5.9
                  WM: Hyprland (Wayland)
                  Terminal: kitty / tmux 3.4
                  CPU: 13th Gen Intel i7-1370P
                  Memory: 24.8GiB / 31.7GiB
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div
        className="fixed inset-0"
        onClick={() => setNeofetchOpen(false)}
      />

      <div className="relative w-full max-w-2xl rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl overflow-hidden z-10 text-xs text-[var(--text-primary)]">
        
        {/* Header */}
        <div className="px-4 py-3 bg-[var(--terminal-bg)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[var(--accent-color)]" />
            <span className="font-bold">system_specs.neofetch</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySpecs}
              className="px-2 py-1 rounded bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[var(--accent-color)] text-[10px] text-[var(--text-secondary)]"
            >
              {copied ? "Copied!" : "Copy JSON"}
            </button>
            <button
              onClick={() => setNeofetchOpen(false)}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <pre className="text-[var(--accent-color)] font-mono text-[11px] sm:text-xs leading-tight overflow-x-auto">
            {asciiLogo}
          </pre>

          {/* Color palette test strip */}
          <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
            <span className="text-[10px] text-[var(--text-muted)]">Colors:</span>
            <div className="flex gap-1.5">
              <span className="w-4 h-4 bg-black rounded" />
              <span className="w-4 h-4 bg-red-500 rounded" />
              <span className="w-4 h-4 bg-green-500 rounded" />
              <span className="w-4 h-4 bg-yellow-500 rounded" />
              <span className="w-4 h-4 bg-blue-500 rounded" />
              <span className="w-4 h-4 bg-purple-500 rounded" />
              <span className="w-4 h-4 bg-cyan-500 rounded" />
              <span className="w-4 h-4 bg-white rounded" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
