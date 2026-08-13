"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { audioEngine } from "./audio";
import { Project } from "./portfolio-data";

export type ThemeMode = "dark" | "gruvbox" | "crt";
export type VimMode = "NORMAL" | "COMMAND" | "VISUAL";
export type SectionId = "home" | "skills" | "projects" | "lab" | "contact";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isMuted: boolean;
  toggleAudio: () => void;
  vimMode: VimMode;
  setVimMode: (mode: VimMode) => void;
  activeSection: SectionId;
  setActiveSection: (sec: SectionId) => void;
  
  // Modals
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  vimPromptOpen: boolean;
  setVimPromptOpen: (open: boolean) => void;
  neofetchOpen: boolean;
  setNeofetchOpen: (open: boolean) => void;
  resumeOpen: boolean;
  setResumeOpen: (open: boolean) => void;
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

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [vimPromptOpen, setVimPromptOpen] = useState(false);
  const [neofetchOpen, setNeofetchOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [keyboardHelpOpen, setKeyboardHelpOpen] = useState(false);
  const [matrixRainActive, setMatrixRainActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load stored theme or audio settings
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
  }, []);

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
        commandPaletteOpen,
        setCommandPaletteOpen,
        vimPromptOpen,
        setVimPromptOpen,
        neofetchOpen,
        setNeofetchOpen,
        resumeOpen,
        setResumeOpen,
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
