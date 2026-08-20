"use client";

import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { useThemeContext } from "../lib/theme-context";
import { PORTFOLIO_DATA, RiceScreenshot, DotfileRepo } from "../lib/portfolio-data";
import { audioEngine } from "../lib/audio";
import {
  Monitor,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  FolderGit2,
  Cpu,
  Layers,
  Sparkles,
  Command,
  Code2,
} from "lucide-react";

export const RiceDetailModal: React.FC = () => {
  const { riceModalOpen, setRiceModalOpen, showToast } = useThemeContext();
  const riceData = PORTFOLIO_DATA.hobbies.linuxRice;
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedRepo, setCopiedRepo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"gallery" | "dotfiles">("gallery");

  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while modal is active
  useEffect(() => {
    const mainLenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (riceModalOpen) {
      if (mainLenis) mainLenis.stop();
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (mainLenis) mainLenis.start();
      document.body.style.overflow = "";
    };
  }, [riceModalOpen]);

  // Dedicated Lenis smooth scrolling inside modal
  useEffect(() => {
    if (!riceModalOpen || !scrollWrapperRef.current || !scrollContentRef.current) return;

    const modalLenis = new Lenis({
      wrapper: scrollWrapperRef.current,
      content: scrollContentRef.current,
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      wheelMultiplier: 0.85,
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
  }, [riceModalOpen, activeTab]);

  // Keyboard navigation for screenshots
  useEffect(() => {
    if (!riceModalOpen || !riceData?.screenshots.length) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "l") {
        e.preventDefault();
        setActiveImageIndex((prev) => (prev + 1) % riceData.screenshots.length);
        audioEngine.playKeyClick("down");
      } else if (e.key === "ArrowLeft" || e.key === "h") {
        e.preventDefault();
        setActiveImageIndex((prev) => (prev - 1 + riceData.screenshots.length) % riceData.screenshots.length);
        audioEngine.playKeyClick("down");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [riceModalOpen, riceData?.screenshots.length]);

  if (!riceModalOpen || !riceData) return null;

  const currentScreenshot: RiceScreenshot = riceData.screenshots[activeImageIndex] || riceData.screenshots[0];

  const handleCopyClone = (repo: DotfileRepo) => {
    navigator.clipboard.writeText(repo.cloneCmd);
    setCopiedRepo(repo.name);
    audioEngine.playKeyClick("enter");
    showToast(`Copied: ${repo.cloneCmd}`);
    setTimeout(() => setCopiedRepo(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => {
          audioEngine.playKeyClick("down");
          setRiceModalOpen(false);
        }}
      />

      {/* Modal Window Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-2xl bg-[#0e0f12] border border-neutral-700 shadow-2xl overflow-hidden z-10 flex flex-col text-neutral-200">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight font-sans">
                  Linux & Hyprland Rice Showcase
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400 font-mono">
                  Arch Linux / Wayland
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5 hidden sm:block">
                Customized monochrome Wayland desktop, Neovim IDE & dotfiles ecosystem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://github.com/${riceData.githubUser}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioEngine.playKeyClick("enter")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>All Repos</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
            <button
              onClick={() => {
                audioEngine.playKeyClick("down");
                setRiceModalOpen(false);
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Specs Overview Grid */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#0a0b0e] border-b border-neutral-800/80 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono shrink-0">
          <div className="px-1.5 py-0.5">
            <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Compositor</div>
            <div className="text-[11px] font-bold text-white truncate">Hyprland</div>
          </div>
          <div className="px-1.5 py-0.5 border-l border-neutral-800/80">
            <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Terminal</div>
            <div className="text-[11px] font-bold text-white truncate">Kitty & Ghostty</div>
          </div>
          <div className="px-1.5 py-0.5 border-t sm:border-t-0 border-neutral-800/80 sm:border-l">
            <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Editor</div>
            <div className="text-[11px] font-bold text-white truncate">Neovim (Lua)</div>
          </div>
          <div className="px-1.5 py-0.5 border-t sm:border-t-0 border-l border-neutral-800/80">
            <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Status Bar</div>
            <div className="text-[11px] font-bold text-white truncate">Waybar</div>
          </div>
          <div className="px-1.5 py-0.5 border-t sm:border-t-0 border-neutral-800/80 sm:border-l col-span-2 sm:col-span-1">
            <div className="text-[9px] text-neutral-500 uppercase tracking-wider">File Manager</div>
            <div className="text-[11px] font-bold text-emerald-400 truncate">Yazi (Rust)</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#08090b] border-b border-neutral-800/80 flex items-center justify-between gap-3 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setActiveTab("gallery");
                audioEngine.playKeyClick("down");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === "gallery"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800/80"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Gallery ({riceData.screenshots.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("dotfiles");
                audioEngine.playKeyClick("down");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === "dotfiles"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800/80"
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Dotfiles ({riceData.dotfiles.length})</span>
            </button>
          </div>

          <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline shrink-0">
            Use <kbd className="px-1 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">←</kbd> / <kbd className="px-1 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">→</kbd> to switch
          </span>
        </div>

        {/* Scrollable Modal Content */}
        <div
          ref={scrollWrapperRef}
          data-lenis-prevent="true"
          className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 max-h-[calc(88vh-160px)] space-y-6 bg-[#08090b]"
        >
          <div ref={scrollContentRef} className="space-y-6">
            
            {/* TAB 1: SCREENSHOTS GALLERY */}
            {activeTab === "gallery" && (
              <div className="space-y-4">
                
                {/* Main Large Active Image Lightbox */}
                <div className="relative w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl group/image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentScreenshot.imagePath}
                    alt={currentScreenshot.title}
                    className="w-full h-auto max-h-[50vh] object-contain mx-auto transition-transform duration-300"
                  />

                  {/* Left / Right Nav Arrows */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev - 1 + riceData.screenshots.length) % riceData.screenshots.length);
                      audioEngine.playKeyClick("down");
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/70 hover:bg-black/90 border border-neutral-700/80 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100"
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev + 1) % riceData.screenshots.length);
                      audioEngine.playKeyClick("down");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/70 hover:bg-black/90 border border-neutral-700/80 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100"
                    aria-label="Next screenshot"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image Counter Badge */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-neutral-700 text-[10px] font-mono text-white">
                    {activeImageIndex + 1} / {riceData.screenshots.length}
                  </div>
                </div>

                {/* Active Screenshot Info */}
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 font-mono">
                        {currentScreenshot.category}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white font-sans">
                        {currentScreenshot.title}
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-400 font-sans mt-1">
                      {currentScreenshot.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    {currentScreenshot.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Thumbnails Row Selector */}
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
                    Quick Switch Screenshots
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 sm:gap-2">
                    {riceData.screenshots.map((shot, idx) => (
                      <button
                        key={shot.id}
                        onClick={() => {
                          setActiveImageIndex(idx);
                          audioEngine.playKeyClick("down");
                        }}
                        className={`relative rounded-lg overflow-hidden border transition-all h-14 bg-neutral-950 ${
                          activeImageIndex === idx
                            ? "border-white ring-2 ring-white/20 scale-105"
                            : "border-neutral-800 hover:border-neutral-600 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={shot.imagePath}
                          alt={shot.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                          <span className="text-[8px] text-white font-mono truncate">{idx + 1}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: DOTFILES REPOSITORIES */}
            {activeTab === "dotfiles" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-sans flex items-start gap-2.5">
                  <Terminal className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Direct Dotfiles Repository Access: </span>
                    All configuration files are organized in modular repositories under{" "}
                    <a
                      href={`https://github.com/${riceData.githubUser}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline font-mono"
                    >
                      github.com/{riceData.githubUser}
                    </a>
                    . Click <Copy className="w-3 h-3 inline mx-1" /> to copy the clone command.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {riceData.dotfiles.map((dot) => (
                    <div
                      key={dot.name}
                      className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/90 hover:border-neutral-700 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-white">
                              <Code2 className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-white font-mono group-hover:text-neutral-100 transition-colors">
                                ~/.config/{dot.name}
                              </h4>
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {dot.repo}
                              </span>
                            </div>
                          </div>

                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 font-mono">
                            {dot.category}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-400 font-sans mt-2.5 line-clamp-2">
                          {dot.description}
                        </p>
                      </div>

                      {/* Clone Command Bar */}
                      <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0 bg-neutral-950 px-2 py-1 rounded border border-neutral-800/80 text-[10px] font-mono text-neutral-400 truncate">
                          {dot.cloneCmd}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleCopyClone(dot)}
                            className="p-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
                            title="Copy clone command"
                          >
                            {copiedRepo === dot.name ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <a
                            href={dot.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => audioEngine.playKeyClick("enter")}
                            className="p-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
                            title="View on GitHub"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-neutral-400 font-sans text-center sm:text-left">
            Crafted with Hyprland on Arch Linux. All 9 dotfile configs are open-source on GitHub.
          </span>
          <a
            href="https://github.com/Bimbok/hypr"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioEngine.playKeyClick("enter")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white transition-colors"
          >
            <span>Hyprland Config on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </a>
        </div>

      </div>
    </div>
  );
};
