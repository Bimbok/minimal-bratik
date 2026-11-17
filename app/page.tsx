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
import { HobbySection } from "../components/HobbySection";
import { ContactSection } from "../components/ContactSection";
import { IconNavSidebar } from "../components/IconNavSidebar";
import { StatusBar } from "../components/StatusBar";
import { CommandPalette } from "../components/CommandPalette";
import { VimCommandPrompt } from "../components/VimCommandPrompt";
import { NeofetchModal } from "../components/NeofetchModal";
import { ResumeModal } from "../components/ResumeModal";
import { CertificationsModal } from "../components/CertificationsModal";
import { AnimeDetailModal } from "../components/AnimeDetailModal";
import { RiceDetailModal } from "../components/RiceDetailModal";
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
              {/* Semantic Media Indexing for Search Engines & Screen Readers (Hidden visually, indexed by Googlebot-Image & crawlers) */}
              <section className="sr-only" aria-label="Author Profile Photos & Media">
                <h2>Bratik Mukherjee (Bimbok) - Profile Photographs & Media</h2>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/profile/bratik-mukherjee-developer.jpg"
                    alt="Bratik Mukherjee (Bimbok) - Full Stack & Software Developer, System Architect in Kolkata, India"
                    width={941}
                    height={1672}
                    loading="lazy"
                  />
                  <figcaption>Bratik Mukherjee (Bimbok) - Software Developer Portrait Headshot</figcaption>
                </figure>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/profile/bratik-mukherjee-bimbok-speaker.jpg"
                    alt="Bratik Mukherjee giving keynote speech on technology, system architecture, and tech entrepreneurship"
                    width={1672}
                    height={941}
                    loading="lazy"
                  />
                  <figcaption>Bratik Mukherjee (Bimbok) Keynote Speaker on Technology & Entrepreneurship</figcaption>
                </figure>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/profile/bratik-mukherjee-keynote.jpg"
                    alt="Bratik Mukherjee speaking at podium during technical presentation at Techno Main Salt Lake"
                    width={1672}
                    height={941}
                    loading="lazy"
                  />
                  <figcaption>Bratik Mukherjee Stage Keynote Presentation</figcaption>
                </figure>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/profile/bratik-mukherjee-bimbok.jpg"
                    alt="Bratik Mukherjee (Bimbok) portrait in West Bengal, India"
                    width={1088}
                    height={1446}
                    loading="lazy"
                  />
                  <figcaption>Bratik Mukherjee (Bimbok) Outdoor Portrait</figcaption>
                </figure>
              </section>

              <HeroSection />
              <DiscordActivityWidget />
              <ExperienceSection />
              <ProjectsSection />
              <GithubHeatmap />
              <SkillsSection />
              <HobbySection />
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
        <AnimeDetailModal />
        <RiceDetailModal />
        <KeyboardHelpModal />
        <ProjectDetailModal />
        <ToastNotification />
        <FloatingScrollButtons />

      </div>
    </SmoothScrollProvider>
  );
}
