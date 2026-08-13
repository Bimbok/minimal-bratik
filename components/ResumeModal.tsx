"use client";

import React, { useState } from "react";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { FileText, X, Download, Copy, Check } from "lucide-react";

export const ResumeModal: React.FC = () => {
  const { resumeOpen, setResumeOpen, showToast } = useThemeContext();
  const [copied, setCopied] = useState(false);

  if (!resumeOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.resumeText);
    setCopied(true);
    audioEngine.playKeyClick("enter");
    showToast("Resume text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([PORTFOLIO_DATA.resumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Bimbok_Mukherjee_Resume.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    audioEngine.playChime();
    showToast("Downloaded Bimbok_Mukherjee_Resume.txt");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div
        className="fixed inset-0"
        onClick={() => setResumeOpen(false)}
      />

      <div className="relative w-full max-w-3xl rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl overflow-hidden z-10 text-xs text-[var(--text-primary)]">
        
        {/* Top Header */}
        <div className="px-4 py-3 bg-[var(--terminal-bg)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--accent-color)]" />
            <span className="font-bold">resume.txt (Plain-Text Overlay)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[var(--accent-color)] text-[11px] text-[var(--text-primary)] flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-2.5 py-1 rounded bg-[var(--accent-color)] text-[var(--bg-main)] font-bold text-[11px] flex items-center gap-1.5 hover:brightness-110 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>

            <button
              onClick={() => setResumeOpen(false)}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto bg-[var(--terminal-bg)]">
          <pre className="font-mono text-xs leading-relaxed text-[var(--text-primary)] whitespace-pre-wrap">
            {PORTFOLIO_DATA.resumeText}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[var(--bg-card)] border-t border-[var(--border-color)] text-[10px] text-[var(--text-muted)] flex items-center justify-between">
          <span>GPG Fingerprint Verified</span>
          <span>Press ESC or click outside to dismiss</span>
        </div>

      </div>
    </div>
  );
};
