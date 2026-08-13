"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { ResumeDriveFile } from "../app/api/resumes/route";
import {
  FileText,
  X,
  Download,
  Copy,
  Check,
  Maximize2,
  Image as ImageIcon,
  Lock,
  Unlock,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export const ResumeModal: React.FC = () => {
  const {
    resumeOpen,
    setResumeOpen,
    showToast,
    isAdmin,
    setIsAdmin,
    activeResumeId,
    setActiveResumeId,
  } = useThemeContext();

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"pdf" | "image" | "text">("pdf");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState("");
  const [passError, setPassError] = useState(false);

  // Live resumes state fetched from Google Drive API
  const [liveResumes, setLiveResumes] = useState<ResumeDriveFile[]>(PORTFOLIO_DATA.resumeDriveFiles);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch live resumes from Google Drive API route
  const fetchLiveResumes = useCallback(async (forceRefresh = false) => {
    setIsRefreshing(true);
    try {
      const url = forceRefresh ? "/api/resumes?refresh=true" : "/api/resumes";
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.resumes) && data.resumes.length > 0) {
        setLiveResumes(data.resumes);
        if (forceRefresh) {
          audioEngine.playChime();
          showToast(`Synced ${data.resumes.length} live files from Google Drive!`);
        }
      }
    } catch {
      // Fallback to pre-indexed list if fetch fails
    } finally {
      setIsRefreshing(false);
    }
  }, [showToast]);

  // Trigger live fetch when modal opens or when Admin logs in
  useEffect(() => {
    if (resumeOpen) {
      fetchLiveResumes(false);
    }
  }, [resumeOpen, fetchLiveResumes]);

  // Default active resume or fallback to top item
  const activeResume =
    liveResumes.find((r) => r.id === activeResumeId) ||
    liveResumes[0] ||
    PORTFOLIO_DATA.resumeDriveFiles[0];

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
  }, [resumeOpen, activeTab, isAdmin, liveResumes]);

  if (!resumeOpen) return null;

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = adminPassInput.trim();
    if (!cleanInput) return;

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: cleanInput }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setAdminPassInput("");
        setPassError(false);
        audioEngine.playChime();
        showToast("👑 Admin Mode Authenticated! Live Drive Vault Active.");
        fetchLiveResumes(true);
      } else {
        setPassError(true);
        audioEngine.playError();
      }
    } catch {
      setPassError(true);
      audioEngine.playError();
    }
  };

  const handleSelectActiveResume = (id: string, name: string) => {
    setActiveResumeId(id);
    audioEngine.playKeyClick("enter");
    showToast(`Active Public Resume set to: ${name}`);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.resumeText);
    setCopied(true);
    audioEngine.playKeyClick("enter");
    showToast("Resume text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${activeResume.id}`;
    window.open(downloadUrl, "_blank");
    audioEngine.playChime();
    showToast(`Downloading ${activeResume.fileTitle}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      <div
        className="fixed inset-0"
        onClick={() => setResumeOpen(false)}
      />

      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-2xl bg-[#0e0f12] border border-neutral-700 shadow-2xl overflow-hidden z-10 text-xs text-neutral-200 flex flex-col">
        
        {/* Top Header */}
        <div className="px-4 sm:px-5 py-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0 gap-2 flex-wrap">
          
          {/* View Tab Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-neutral-900 border border-neutral-800">
            <button
              onClick={() => setActiveTab("pdf")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "pdf"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Viewer</span>
            </button>

            <button
              onClick={() => setActiveTab("image")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "image"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo</span>
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
              <span>Text</span>
            </button>
          </div>

          {/* Action Buttons & Admin Controls */}
          <div className="flex items-center gap-2">
            {/* Admin Status Toggle Button */}
            {isAdmin ? (
              <button
                onClick={() => {
                  setIsAdmin(false);
                  showToast("Admin session signed out");
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center gap-1.5 font-bold text-xs hover:bg-emerald-900 transition-all"
                title="Admin Mode Active (Click to Logout)"
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Admin Mode</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:bg-neutral-800 transition-all flex items-center gap-1.5 text-xs"
                title="Admin Login to Select Public Resume Version"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Login</span>
              </button>
            )}

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 rounded-lg bg-white text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-neutral-200 transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>Download PDF</span>
            </button>

            {/* Close Button */}
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
          className="p-4 sm:p-5 flex-1 overflow-y-auto overscroll-contain bg-[#08090b]"
        >
          <div ref={contentRef} className="space-y-4">
            
            {/* ADMIN VAULT PANEL (Visible ONLY when logged in as Admin) */}
            {isAdmin && (
              <div className="rounded-xl bg-[#0d0e11] border border-emerald-500/30 p-4 space-y-3 shadow-2xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-2 text-white font-bold font-sans">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Google Drive Live Vault ({liveResumes.length} Files Detected)</span>
                  </div>

                  <button
                    onClick={() => fetchLiveResumes(true)}
                    disabled={isRefreshing}
                    className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 font-mono text-[10px] flex items-center gap-1.5 transition-all"
                    title="Re-scan Google Drive Folder for newly uploaded files"
                  >
                    <RefreshCw className={`w-3 h-3 text-emerald-400 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>{isRefreshing ? "Scanning Drive..." : "Refresh Drive Files"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {liveResumes.map((item) => {
                    const isActive = item.id === activeResumeId;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectActiveResume(item.id, item.name)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all space-y-1.5 ${
                          isActive
                            ? "bg-neutral-900 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40"
                            : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-white font-mono">
                            {item.tag}
                          </span>
                          {isActive && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ACTIVE
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-bold text-white font-sans truncate">
                          {item.name}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-900">
                          <span className="truncate max-w-[140px]">{item.fileTitle}</span>
                          <ExternalLink className="w-3 h-3 text-neutral-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 1: PDF VIEWER */}
            {activeTab === "pdf" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2 text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white font-sans">{activeResume.name}</span>
                  </div>
                  <a
                    href={`https://drive.google.com/file/d/${activeResume.id}/view`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Open in Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Embedded Google Drive PDF Viewer */}
                <div className="relative w-full h-[62vh] sm:h-[68vh] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl">
                  <iframe
                    src={`https://drive.google.com/file/d/${activeResume.id}/preview`}
                    className="w-full h-full border-0"
                    title="Bratik Mukherjee Resume PDF"
                    allow="autoplay"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: PHOTO RESUME */}
            {activeTab === "image" && (
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
            )}

            {/* TAB 3: PLAIN TEXT */}
            {activeTab === "text" && (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button
                    onClick={handleCopyText}
                    className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 flex items-center gap-1.5 transition-all text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Text"}</span>
                  </button>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800 shadow-inner">
                  <pre className="font-mono text-xs leading-relaxed text-neutral-200 whitespace-pre-wrap">
                    {PORTFOLIO_DATA.resumeText}
                  </pre>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between shrink-0 font-mono">
          <span className="truncate max-w-[280px] sm:max-w-md">
            Active: <span className="text-white font-bold">{activeResume.name}</span>
          </span>
          <span>Press ESC to exit</span>
        </div>

      </div>

      {/* ADMIN LOGIN DIALOG MODAL */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setShowAdminLogin(false)}
          />

          <div className="relative w-full max-w-md rounded-2xl bg-[#0e0f12] border border-neutral-700 p-5 sm:p-6 shadow-2xl space-y-4 z-10 font-mono text-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-white" />
                <h3 className="font-extrabold text-sm text-white font-sans">
                  Portfolio Admin Passkey
                </h3>
              </div>
              <button
                onClick={() => setShowAdminLogin(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              Enter your Admin Password to access the Google Drive Resume Vault and set the active public PDF for all visitors.
            </p>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-3">
              <input
                type="password"
                name="portfolio_admin_passkey_vault"
                autoComplete="new-password"
                data-1p-ignore="true"
                autoFocus
                placeholder="Enter admin passkey..."
                value={adminPassInput}
                onChange={(e) => {
                  setAdminPassInput(e.target.value);
                  setPassError(false);
                }}
                className={`w-full p-2.5 rounded-xl bg-neutral-950 border text-xs text-white focus:outline-none font-mono ${
                  passError ? "border-red-500 focus:border-red-400" : "border-neutral-800 focus:border-white"
                }`}
              />

              {passError && (
                <p className="text-[11px] text-red-400 font-mono">
                  Incorrect passkey. Please try again.
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-all shadow-md font-mono"
                >
                  Authenticate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setIsLightboxOpen(false)}
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
