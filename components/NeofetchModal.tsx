"use client";

import React from "react";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { Cpu, Copy, Check } from "lucide-react";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";

export const NeofetchModal: React.FC = () => {
  const { neofetchOpen, setNeofetchOpen, showToast } = useThemeContext();
  const [copied, setCopied] = React.useState(false);

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
    <Modal
      isOpen={neofetchOpen}
      onClose={() => setNeofetchOpen(false)}
      title="system_specs.neofetch"
      icon={<Cpu className="w-4 h-4 text-emerald-400" />}
      maxWidth="2xl"
      className="bg-[var(--bg-card)] border-[var(--border-color)] text-xs text-[var(--text-primary)]"
      headerActions={
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopySpecs}
          className="text-[10px] gap-1 px-2 py-1"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied!" : "Copy JSON"}</span>
        </Button>
      }
    >
      <div className="space-y-4">
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
    </Modal>
  );
};
