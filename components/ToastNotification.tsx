"use client";

import React from "react";
import { useThemeContext } from "../lib/theme-context";
import { Terminal } from "lucide-react";

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useThemeContext();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-16 right-4 z-50 animate-in slide-in-from-top-3 duration-200 pointer-events-none">
      <div className="px-4 py-2.5 rounded-lg bg-[var(--terminal-bg)] border border-[var(--accent-color)] text-[var(--accent-color)] shadow-2xl font-mono text-xs flex items-center gap-2.5">
        <Terminal className="w-4 h-4 shrink-0 animate-pulse" />
        <span className="font-medium text-[var(--text-primary)]">{toastMessage}</span>
      </div>
    </div>
  );
};
