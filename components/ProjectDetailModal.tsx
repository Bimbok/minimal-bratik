"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { X, ExternalLink, Cpu, Check, Copy } from "lucide-react";
import { GithubIcon } from "./BrandIcons";

export const ProjectDetailModal: React.FC = () => {
  const { selectedProject, setSelectedProject, showToast } = useThemeContext();
  const [copiedCmd, setCopiedCmd] = React.useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainLenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (selectedProject) {
      if (mainLenis) mainLenis.stop();
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (mainLenis) mainLenis.start();
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject || !wrapperRef.current || !contentRef.current) return;

    const modalLenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
      infinite: false,
    });

    let rafId: number;
    function raf(time: number) {
      modalLenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      modalLenis.destroy();
    };
  }, [selectedProject]);

  if (!selectedProject) return null;

  const gitCloneCmd = `git clone ${selectedProject.githubUrl}.git`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(gitCloneCmd);
    setCopiedCmd(true);
    audioEngine.playKeyClick("enter");
    showToast("Git clone command copied to clipboard!");
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-mono text-xs">
      <div
        className="fixed inset-0"
        onClick={() => setSelectedProject(null)}
      />

      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0e0f12] border border-neutral-700 shadow-2xl overflow-hidden z-10 text-neutral-200 flex flex-col max-h-[85vh]">
        
        {/* Top Header */}
        <div className="px-5 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {selectedProject.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedProject.logoUrl}
                alt={`${selectedProject.title} logo`}
                className="w-6 h-6 rounded-full object-cover border border-neutral-800 shrink-0"
              />
            )}
            <span className="font-extrabold text-base text-white font-sans tracking-tight">
              {selectedProject.title}
            </span>
            <span className="text-[10px] uppercase font-mono font-extrabold px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800">
              {selectedProject.status}
            </span>
          </div>
          <button
            onClick={() => {
              audioEngine.playKeyClick("down");
              setSelectedProject(null);
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Scroll Content with dedicated Lenis smooth scroll */}
        <div
          ref={wrapperRef}
          data-lenis-prevent
          className="p-5 sm:p-6 flex-1 overflow-y-auto overscroll-contain bg-[#08090b]"
        >
          <div ref={contentRef} className="space-y-5">
            
            {/* Tagline */}
            <p className="text-sm sm:text-base font-extrabold text-white leading-snug font-sans tracking-tight">
              {selectedProject.tagline}
            </p>

            {/* Description */}
            <p className="text-xs text-neutral-300 leading-relaxed font-sans font-normal">
              {selectedProject.description}
            </p>

            {/* Architecture Highlights */}
            <div className="space-y-2.5 pt-1">
              <div className="font-bold text-[11px] text-neutral-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                <Cpu className="w-4 h-4 text-white" />
                <span>Architecture & Technical Highlights</span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2.5 shadow-inner">
                {selectedProject.architecture.map((arch, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-sans text-neutral-200">
                    <span className="text-neutral-500 font-bold">•</span>
                    <span className="leading-relaxed">{arch}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clone Command Box */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between shadow-inner">
              <code className="text-white text-[11px] truncate mr-2 font-mono font-bold">
                $ {gitCloneCmd}
              </code>
              <button
                onClick={handleCopyCmd}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors shrink-0"
                title="Copy clone command"
              >
                {copiedCmd ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedProject.tech.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md text-[10px] bg-neutral-900 text-neutral-300 border border-neutral-800 font-mono"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-neutral-400 font-mono">
            Repo Path: <span className="text-white font-bold">{selectedProject.repoPath}</span>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs">
            <a
              href={selectedProject.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-800 transition-all flex items-center gap-2 font-bold"
            >
              <GithubIcon className="w-4 h-4 text-white" />
              <span>GitHub Repo</span>
            </a>
            {selectedProject.liveUrl && (
              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-white text-black font-extrabold hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5 text-black" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
