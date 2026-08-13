"use client";

import React from "react";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { X, ExternalLink, Cpu, Check, Copy } from "lucide-react";
import { GithubIcon } from "./BrandIcons";

export const ProjectDetailModal: React.FC = () => {
  const { selectedProject, setSelectedProject, showToast } = useThemeContext();
  const [copiedCmd, setCopiedCmd] = React.useState(false);

  if (!selectedProject) return null;

  const gitCloneCmd = `git clone ${selectedProject.githubUrl}.git`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(gitCloneCmd);
    setCopiedCmd(true);
    audioEngine.playKeyClick("enter");
    showToast("Git clone command copied!");
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 font-mono text-xs">
      <div
        className="fixed inset-0"
        onClick={() => setSelectedProject(null)}
      />

      <div className="relative w-full max-w-2xl rounded-xl bg-[#0e0f12] border border-neutral-800 shadow-2xl overflow-hidden z-10 text-neutral-200">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              {selectedProject.status}
            </span>
            <span className="font-bold text-sm text-white">{selectedProject.title}</span>
          </div>
          <button
            onClick={() => setSelectedProject(null)}
            className="p-1 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-mono">
          
          {/* Tagline */}
          <p className="text-sm font-semibold text-emerald-400 leading-snug font-sans">
            {selectedProject.tagline}
          </p>

          {/* Description */}
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            {selectedProject.description}
          </p>

          {/* Architecture Highlights */}
          <div className="space-y-2">
            <div className="font-bold text-[11px] text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Architecture & Technical Highlights</span>
            </div>
            <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
              {selectedProject.architecture.map((arch, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <span className="text-emerald-400 font-bold">➢</span>
                  <span className="text-neutral-200 leading-relaxed font-sans">{arch}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clone Command */}
          <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <code className="text-emerald-400 text-[11px] truncate mr-2 font-mono">
              $ {gitCloneCmd}
            </code>
            <button
              onClick={handleCopyCmd}
              className="p-1 text-neutral-400 hover:text-emerald-400 transition-colors shrink-0"
              title="Copy clone command"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {selectedProject.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded text-[10px] bg-neutral-900 text-neutral-400 border border-neutral-800"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <div className="text-xs text-neutral-400 font-sans">
            Repo Path: <span className="font-mono text-emerald-400">{selectedProject.repoPath}</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <a
              href={selectedProject.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200 hover:border-neutral-700 transition-colors flex items-center gap-1.5"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>
            {selectedProject.liveUrl && (
              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
