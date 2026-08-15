"use client";

import React from "react";
import { useGlobalShortcuts } from "../lib/use-global-shortcuts";
import { SmoothScrollProvider } from "../components/SmoothScrollProvider";
import { HeroSection } from "../components/HeroSection";
import { DiscordActivityWidget } from "../components/DiscordActivityWidget";
import { ExperienceSection } from "../components/ExperienceSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { GithubHeatmap } from "../components/GithubHeatmap";
import { SkillsSection } from "../components/SkillsSection";
import { ContactSection } from "../components/ContactSection";
import { IconNavSidebar } from "../components/IconNavSidebar";
import { StatusBar } from "../components/StatusBar";
import { CommandPalette } from "../components/CommandPalette";
import { VimCommandPrompt } from "../components/VimCommandPrompt";
import { NeofetchModal } from "../components/NeofetchModal";
import { ResumeModal } from "../components/ResumeModal";
import { CertificationsModal } from "../components/CertificationsModal";
import { KeyboardHelpModal } from "../components/KeyboardHelpModal";
import { ProjectDetailModal } from "../components/ProjectDetailModal";
import { ToastNotification } from "../components/ToastNotification";
import { FloatingScrollButtons } from "../components/FloatingScrollButtons";
import { MatrixRainCanvas } from "../components/MatrixRainCanvas";

export default function Home() {
  // Register global Vim keybindings & shortcuts
  useGlobalShortcuts();

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[#050505] text-neutral-200 relative pb-20 selection:bg-white selection:text-black">
        
        {/* Background Matrix Rain (if activated) */}
        <MatrixRainCanvas />

        {/* Fixed Vertical Icon Navigation Dock (Pinned on left viewport) */}
        <IconNavSidebar />

        {/* Main Centered Window Container */}
        <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-6 sm:pt-10 pb-8">
          
          {/* Minimal Window Frame with Glassmorphism */}
          <div className="rounded-2xl border border-neutral-800/80 bg-[#0d0e11]/95 shadow-2xl backdrop-blur-xl p-4 sm:p-7 relative overflow-hidden">
            
            {/* Subtle Dotted Background Grid Lines */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Main Content Column */}
            <main className="relative z-10 space-y-8">
              <HeroSection />
              <DiscordActivityWidget />
              <ExperienceSection />
              <ProjectsSection />
              <GithubHeatmap />
              <SkillsSection />
              <ContactSection />
            </main>

          </div>

        </div>

        {/* Sticky Bottom Neovim Status Bar */}
        <StatusBar />

        {/* Modals & Overlays */}
        <CommandPalette />
        <VimCommandPrompt />
        <NeofetchModal />
        <ResumeModal />
        <CertificationsModal />
        <KeyboardHelpModal />
        <ProjectDetailModal />
        <ToastNotification />
        <FloatingScrollButtons />

      </div>
    </SmoothScrollProvider>
  );
}
