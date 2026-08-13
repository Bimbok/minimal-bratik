"use client";

import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { FileText, X, Download, Copy, Check, Maximize2, Image as ImageIcon } from "lucide-react";

export const ResumeModal: React.FC = () => {
  const { resumeOpen, setResumeOpen, showToast } = useThemeContext();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"image" | "text">("image");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainLenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (resumeOpen) {
      if (mainLenis) mainLenis.stop();
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (mainLenis) mainLenis.start();
      document.body.style.overflow = "";
    };
  }, [resumeOpen]);

  useEffect(() => {
    if (!resumeOpen || !wrapperRef.current || !contentRef.current) return;

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
  }, [resumeOpen, activeTab]);

  if (!resumeOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.resumeText);
    setCopied(true);
    audioEngine.playKeyClick("enter");
    showToast("Resume text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
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

  const handleDownloadImage = () => {
    const a = document.createElement("a");
    a.href = "/resume/Bratik.jpg";
    a.download = "Bratik_Mukherjee_Resume.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    audioEngine.playChime();
    showToast("Downloaded Bratik_Mukherjee_Resume.jpg");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      <div
        className="fixed inset-0"
        onClick={() => setResumeOpen(false)}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-[#0e0f12] border border-neutral-700 shadow-2xl overflow-hidden z-10 text-xs text-neutral-200 flex flex-col">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-neutral-900 border border-neutral-800">
              <button
                onClick={() => setActiveTab("image")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "image"
                    ? "bg-white text-black shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Resume Image</span>
              </button>

              <button
                onClick={() => setActiveTab("text")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "text"
                    ? "bg-white text-black shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Plain Text</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "text" && (
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 flex items-center gap-1.5 transition-all text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            )}

            <button
              onClick={activeTab === "image" ? handleDownloadImage : handleDownloadText}
              className="px-3 py-1.5 rounded-lg bg-white text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-neutral-200 transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>{activeTab === "image" ? "Download Image" : "Download .txt"}</span>
            </button>

            <button
              onClick={() => setResumeOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Scroll Area with dedicated Lenis smooth scroll */}
        <div
          ref={wrapperRef}
          data-lenis-prevent
          className="p-4 sm:p-6 flex-1 overflow-y-auto overscroll-contain bg-[#08090b]"
        >
          <div ref={contentRef} className="space-y-4">
            {activeTab === "image" ? (
              <div
                className="relative w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 group cursor-pointer shadow-2xl"
                onClick={() => setIsLightboxOpen(true)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/resume/Bratik.jpg"
                  alt="Bratik Mukherjee Resume"
                  className="w-full h-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold backdrop-blur-[2px]">
                  <Maximize2 className="w-5 h-5" />
                  <span>Click to Expand Full Screen</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <pre className="font-mono text-xs leading-relaxed text-neutral-200 whitespace-pre-wrap">
                  {PORTFOLIO_DATA.resumeText}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between shrink-0 font-mono">
          <span>Bratik Mukherjee — Resume Document</span>
          <span>Press ESC to exit</span>
        </div>

      </div>

      {/* High-Res Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setIsLightboxOpen(null as unknown as boolean)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 z-50"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/resume/Bratik.jpg"
            alt="Bratik Mukherjee Full Resume"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
