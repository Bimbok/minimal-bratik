"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { audioEngine } from "./audio";
import { Project } from "./portfolio-data";

export type ThemeMode = "dark" | "gruvbox" | "crt";
export type VimMode = "NORMAL" | "COMMAND" | "VISUAL";
export type SectionId = "home" | "experience" | "projects" | "skills" | "hobbies" | "lab" | "contact";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isMuted: boolean;
  toggleAudio: () => void;
  vimMode: VimMode;
  setVimMode: (mode: VimMode) => void;
  activeSection: SectionId;
  setActiveSection: (sec: SectionId) => void;
  
  // Admin & Dynamic Resume Management
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  activeResumeId: string;
  setActiveResumeId: (id: string) => void;

  // Modals
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  vimPromptOpen: boolean;
  setVimPromptOpen: (open: boolean) => void;
  neofetchOpen: boolean;
  setNeofetchOpen: (open: boolean) => void;
  resumeOpen: boolean;
  setResumeOpen: (open: boolean) => void;
  certificationsOpen: boolean;
  setCertificationsOpen: (open: boolean) => void;
  animeModalOpen: boolean;
  setAnimeModalOpen: (open: boolean) => void;
  keyboardHelpOpen: boolean;
  setKeyboardHelpOpen: (open: boolean) => void;
  matrixRainActive: boolean;
  setMatrixRainActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;

  // Toast / Status notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [vimMode, setVimMode] = useState<VimMode>("NORMAL");
  const [activeSection, setActiveSection] = useState<SectionId>("home");

  const [isAdmin, setIsAdminState] = useState<boolean>(false);
  const [activeResumeId, setActiveResumeIdState] = useState<string>("1PRPbcnMlDVuROMaDTuqLgVOV4BhmcFHr");

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [vimPromptOpen, setVimPromptOpen] = useState(false);
  const [neofetchOpen, setNeofetchOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [certificationsOpen, setCertificationsOpen] = useState(false);
  const [animeModalOpen, setAnimeModalOpen] = useState(false);
  const [keyboardHelpOpen, setKeyboardHelpOpen] = useState(false);
  const [matrixRainActive, setMatrixRainActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load stored settings from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("mini_portfolio_theme") as ThemeMode | null;
    if (savedTheme && ["dark", "gruvbox", "crt"].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
    const savedAudio = localStorage.getItem("mini_portfolio_muted");
    if (savedAudio !== null) {
      const muted = savedAudio === "true";
      setIsMuted(muted);
      audioEngine.setMuted(muted);
    }
    const savedAdmin = localStorage.getItem("bimbok_admin_authenticated");
    if (savedAdmin === "true") {
      setIsAdminState(true);
    }
    const savedResumeId = localStorage.getItem("bimbok_active_resume_id");
    if (savedResumeId) {
      setActiveResumeIdState(savedResumeId);
    }
  }, []);

  const setIsAdmin = (val: boolean) => {
    setIsAdminState(val);
    localStorage.setItem("bimbok_admin_authenticated", String(val));
  };

  const setActiveResumeId = (id: string) => {
    setActiveResumeIdState(id);
    localStorage.setItem("bimbok_active_resume_id", id);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem("mini_portfolio_theme", newTheme);
    audioEngine.playChime();
    
    // Auto toggle matrix rain if CRT theme is picked
    if (newTheme === "crt") {
      setMatrixRainActive(true);
    }
  };

  const toggleAudio = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
    localStorage.setItem("mini_portfolio_muted", String(nextMuted));
    if (!nextMuted) {
      audioEngine.playKeyClick("enter");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Sync html element attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Sync Vim mode when prompts are open
  useEffect(() => {
    if (vimPromptOpen || commandPaletteOpen) {
      setVimMode("COMMAND");
    } else {
      setVimMode("NORMAL");
    }
  }, [vimPromptOpen, commandPaletteOpen]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isMuted,
        toggleAudio,
        vimMode,
        setVimMode,
        activeSection,
        setActiveSection,
        isAdmin,
        setIsAdmin,
        activeResumeId,
        setActiveResumeId,
        commandPaletteOpen,
        setCommandPaletteOpen,
        vimPromptOpen,
        setVimPromptOpen,
        neofetchOpen,
        setNeofetchOpen,
        resumeOpen,
        setResumeOpen,
        certificationsOpen,
        setCertificationsOpen,
        animeModalOpen,
        setAnimeModalOpen,
        keyboardHelpOpen,
        setKeyboardHelpOpen,
        matrixRainActive,
        setMatrixRainActive,
        selectedProject,
        setSelectedProject,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
