"use client";

import React, { useEffect } from "react";
import { Command } from "cmdk";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { useThemeContext, SectionId, ThemeMode } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import {
  Search,
  Terminal,
  Palette,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Code2,
  Mail,
  Cpu,
  Download,
  FolderGit2,
  Award,
  HelpCircle,
  Play,
  UserPlus,
} from "lucide-react";

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveSection,
    setSelectedProject,
    setTheme,
    toggleAudio,
    isMuted,
    setResumeOpen,
    setNeofetchOpen,
    setCertificationsOpen,
    setKeyboardHelpOpen,
    setMatrixRainActive,
    showToast,
  } = useThemeContext();

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (commandPaletteOpen) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
    };
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const handleSelectSection = (id: SectionId) => {
    setActiveSection(id);
    setCommandPaletteOpen(false);
    audioEngine.playKeyClick("enter");
    const elem = document.getElementById(id);
    if (elem) {
      const lenis = (window as unknown as { lenis?: { scrollTo: (el: HTMLElement, opts: object) => void } }).lenis;
      if (lenis) {
        lenis.scrollTo(elem, { duration: 1.5, offset: -20 });
      } else {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSelectTheme = (t: ThemeMode) => {
    setTheme(t);
    setCommandPaletteOpen(false);
    showToast(`Switched theme to ${t.toUpperCase()}`);
  };

  const handleDownloadVCard = () => {
    setCommandPaletteOpen(false);
    const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:Bratik Mukherjee
N:Mukherjee;Bratik;;;
NICKNAME:Bimbok
TITLE:Full Stack & Software Developer — System Architect
EMAIL;TYPE=INTERNET,HOME:bimbokmkj@gmail.com
TEL;TYPE=CELL,VOICE:+919883593295
URL:https://bratikmkj.vercel.app
URL;TYPE=GitHub:https://github.com/Bimbok
URL;TYPE=LinkedIn:https://linkedin.com/in/bimbok
ADR;TYPE=HOME:;;West Bengal;India;;;
NOTE:Full Stack & Software Developer specializing in C++, Go, Python, React 19, and Linux Systems.
END:VCARD`;

    const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Bratik_Mukherjee.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    audioEngine.playChime();
    showToast("Downloaded Bratik Mukherjee vCard (.vcf)!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150 font-mono">
      <div
        className="fixed inset-0"
        onClick={() => setCommandPaletteOpen(false)}
      />

      <div className="relative w-full max-w-xl rounded-xl bg-[#0e0f12] border border-neutral-700 shadow-2xl overflow-hidden z-10 text-xs text-neutral-200">
        <Command label="Command Palette" className="w-full">
          
          {/* Input Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-neutral-950">
            <Search className="w-4 h-4 text-white shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Search projects (Fyzenor, AVIS, NyayaConnect...), sections, or commands..."
              className="w-full bg-transparent text-white focus:outline-none placeholder:text-neutral-500 text-xs font-mono"
            />
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">
              ESC
            </kbd>
          </div>

          {/* Command Options List with data-lenis-prevent */}
          <Command.List data-lenis-prevent className="max-h-80 overflow-y-auto overscroll-contain p-2 space-y-1">
            <Command.Empty className="p-4 text-center text-neutral-500">
              No matching commands found.
            </Command.Empty>

            {/* Navigation Group */}
            <Command.Group heading="Navigate Sections" className="text-[10px] uppercase font-bold text-neutral-500 px-2 py-1">
              <Command.Item
                onSelect={() => handleSelectSection("home")}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-neutral-300" />
                  <span>/home (Overview & Bio)</span>
                </div>
                <kbd className="text-[10px] text-neutral-500">1</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelectSection("skills")}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-neutral-300" />
                  <span>~/.config/skills (Tech Stack & Tools)</span>
                </div>
                <kbd className="text-[10px] text-neutral-500">2</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelectSection("projects")}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-neutral-300" />
                  <span>/projects (12 Interactive Repositories)</span>
                </div>
                <kbd className="text-[10px] text-neutral-500">3</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelectSection("contact")}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neutral-300" />
                  <span>/contact (EmailJS, Phone & SSH)</span>
                </div>
                <kbd className="text-[10px] text-neutral-500">4</kbd>
              </Command.Item>
            </Command.Group>

            {/* Projects & Repositories Group */}
            <Command.Group heading={`Projects & Repositories (${PORTFOLIO_DATA.projects.length} Total)`} className="text-[10px] uppercase font-bold text-neutral-500 px-2 py-1 mt-2">
              {PORTFOLIO_DATA.projects.map((proj) => (
                <Command.Item
                  key={proj.id}
                  onSelect={() => {
                    setCommandPaletteOpen(false);
                    setSelectedProject(proj);
                    audioEngine.playKeyClick("enter");
                  }}
                  className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {proj.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={proj.logoUrl} alt="" className="w-4 h-4 rounded-full object-cover shrink-0 border border-neutral-800" />
                    ) : proj.imagePath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={proj.imagePath} alt="" className="w-4 h-4 rounded object-cover shrink-0 border border-neutral-800" />
                    ) : (
                      <FolderGit2 className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                    <span className="font-bold text-white whitespace-nowrap">{proj.title}</span>
                    <span className="text-neutral-400 text-[11px] truncate hidden sm:inline">— {proj.tagline}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {proj.videoUrl && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 font-mono flex items-center gap-1">
                        <Play className="w-2 h-2 fill-current" /> Video
                      </span>
                    )}
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
                      {proj.status}
                    </span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Actions & System Group */}
            <Command.Group heading="Actions & System" className="text-[10px] uppercase font-bold text-neutral-500 px-2 py-1 mt-2">
              <Command.Item
                onSelect={() => {
                  setCommandPaletteOpen(false);
                  setResumeOpen(true);
                  audioEngine.playKeyClick("enter");
                }}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-neutral-300" />
                  <span>cat resume (View & Switch Developer Resumes)</span>
                </div>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  setCommandPaletteOpen(false);
                  setCertificationsOpen(true);
                  audioEngine.playKeyClick("enter");
                }}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-neutral-300" />
                  <span>cat certificates (SIH '25, AWS AI Bharat, GFG & Udemy)</span>
                </div>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  setCommandPaletteOpen(false);
                  setNeofetchOpen(true);
                  audioEngine.playKeyClick("enter");
                }}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-neutral-300" />
                  <span>neofetch (Display Workstation & System Specs)</span>
                </div>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  setCommandPaletteOpen(false);
                  setKeyboardHelpOpen(true);
                  audioEngine.playKeyClick("enter");
                }}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-neutral-300" />
                  <span>help (Show Vim Keybindings & Quick Help)</span>
                </div>
              </Command.Item>

              <Command.Item
                onSelect={handleDownloadVCard}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-neutral-300" />
                  <span>vcard (Download Bratik Mukherjee .vcf)</span>
                </div>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  setCommandPaletteOpen(false);
                  setMatrixRainActive((prev) => !prev);
                  audioEngine.playChime();
                }}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neutral-300" />
                  <span>matrix (Toggle Code Rain Canvas)</span>
                </div>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  toggleAudio();
                  setCommandPaletteOpen(false);
                }}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-white" />}
                  <span>{isMuted ? "Unmute Key Click Sounds" : "Mute Key Click Sounds"}</span>
                </div>
              </Command.Item>
            </Command.Group>

            {/* Themes Group */}
            <Command.Group heading="Themes" className="text-[10px] uppercase font-bold text-neutral-500 px-2 py-1 mt-2">
              <Command.Item
                onSelect={() => handleSelectTheme("dark")}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-white" />
                  <span>theme dark (Deep Monochrome Blackish Default)</span>
                </div>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelectTheme("gruvbox")}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>theme gruvbox (Retro Warm Dark Terminal)</span>
                </div>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelectTheme("crt")}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-neutral-800 text-neutral-200 cursor-pointer aria-selected:bg-neutral-800 aria-selected:text-white"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <span>theme crt (Amber Phosphor Scanline CRT)</span>
                </div>
              </Command.Item>
            </Command.Group>

          </Command.List>

        </Command>
      </div>
    </div>
  );
};
