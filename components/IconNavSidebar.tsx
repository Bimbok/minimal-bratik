"use client";

import React, { useState, useEffect } from "react";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { User, Briefcase, FolderGit2, Activity, Cpu, Mail } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export const IconNavSidebar: React.FC = () => {
  const { setActiveSection } = useThemeContext();
  const [activeId, setActiveId] = useState<string>("home");

  const navItems: NavItem[] = [
    { id: "home", label: "Overview", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "opensource", label: "Open Source", icon: Activity },
    { id: "skills", label: "Skills", icon: Cpu },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  // Observe active section scroll position dynamically
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["home", "experience", "projects", "opensource", "skills", "contact"];
      for (const id of sectionIds) {
        const elem = document.getElementById(id);
        if (elem) {
          const rect = elem.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 100) {
            setActiveId(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setActiveId(id);
    audioEngine.playKeyClick("down");
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="hidden xl:flex flex-col items-center gap-2 fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 font-mono text-xs p-2 rounded-2xl bg-[#0b0c0e]/95 border border-neutral-800/80 shadow-2xl backdrop-blur-md">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeId === item.id;
        return (
          <div key={item.id} className="relative group">
            <button
              onClick={() => handleNavClick(item.id)}
              className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center focus:outline-none ${
                isActive
                  ? "bg-neutral-800 text-white border-neutral-700 shadow-md scale-105"
                  : "bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-800/80"
              }`}
              aria-label={item.label}
            >
              <Icon className="w-4 h-4" />
            </button>

            {/* Hover Tooltip Popup (Right Side) */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 transform translate-x-1 group-hover:translate-x-0 z-50">
              <div className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 font-semibold text-[11px] whitespace-nowrap shadow-2xl flex items-center gap-1.5">
                <span className="text-neutral-400">•</span>
                <span>{item.label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </aside>
  );
};
