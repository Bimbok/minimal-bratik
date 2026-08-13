"use client";

import React from "react";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { GithubHoverCard } from "./GithubHoverCard";
import { Mail, FileText, Command, Sun, FolderGit2 } from "lucide-react";

export const HeroSection: React.FC = () => {
  const { setResumeOpen, setCommandPaletteOpen, theme, setTheme } = useThemeContext();

  const handleExploreProjects = () => {
    audioEngine.playKeyClick("down");
    const elem = document.getElementById("projects");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="space-y-6">
      
      {/* Top Rectangular Banner Image (Solo Leveling Wallpaper) with Un-cut Top & Seamless Bottom Gradient Blend */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-neutral-800/80 shadow-2xl bg-[#08090b] group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/banner.png"
          alt="Solo Leveling Banner"
          className="w-full h-full object-cover object-top opacity-90 filter grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
        />
        {/* Multi-stage Gradient Blend for Seamless Lower Portion Melting */}
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#08090b] via-[#08090b]/75 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Profile Info Header */}
      <div className="relative px-2 sm:px-4 -mt-20 sm:-mt-24 space-y-4 font-mono z-10">
        
        {/* Avatar & Top Right Commands */}
        <div className="flex items-end justify-between gap-4">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://avatars.githubusercontent.com/u/132834022?v=4"
              alt={PORTFOLIO_DATA.profile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-[#08090b] shadow-2xl object-cover bg-neutral-900"
            />
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#08090b]" />
          </div>

          {/* Quick command buttons inside hero */}
          <div className="flex items-center gap-2 text-xs pb-1">
            <button
              onClick={() => {
                audioEngine.playKeyClick("down");
                setCommandPaletteOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
              title="Command Menu (Cmd + K)"
            >
              <Command className="w-3.5 h-3.5 text-neutral-300" />
              <span>⌘K</span>
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "gruvbox" : theme === "gruvbox" ? "crt" : "dark")}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Toggle Theme"
            >
              <Sun className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Name & Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              {PORTFOLIO_DATA.profile.name}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-800 font-medium">
              B.Tech IT
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            {PORTFOLIO_DATA.profile.role}
          </p>
        </div>

        {/* Bio Paragraph & Bullet Points */}
        <div className="space-y-2 text-xs font-sans leading-relaxed text-neutral-300">
          <p className="font-medium text-neutral-200">
            {PORTFOLIO_DATA.profile.headline}
          </p>

          <ul className="space-y-1.5 text-neutral-400 font-mono text-[11px] pt-1">
            {PORTFOLIO_DATA.profile.bioBullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-neutral-500 font-bold">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap gap-2.5 pt-2 text-xs">
          <button
            onClick={handleExploreProjects}
            className="px-3.5 py-2 rounded-lg bg-white text-black font-extrabold hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-md"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Explore Projects</span>
          </button>

          <a
            href={`mailto:${PORTFOLIO_DATA.profile.socials.email}`}
            className="px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800 transition-all flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-neutral-400" />
            <span>Send an email</span>
          </a>
        </div>

        {/* Socials Row with Original Brand Icons */}
        <div className="space-y-2 pt-3 border-t border-neutral-800/60 text-xs">
          <div className="text-[11px] text-neutral-500 font-medium">Here are my <span className="text-neutral-200 font-bold">socials</span></div>
          <div className="flex flex-wrap items-center gap-2">
            
            {/* GitHub Hover Card with Original Icon */}
            <div className="w-auto">
              <GithubHoverCard />
            </div>

            {/* Twitter/X Link with Original SkillIcon */}
            <a
              href={PORTFOLIO_DATA.profile.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-all flex items-center gap-2 text-xs font-mono"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://skillicons.dev/icons?i=twitter&theme=dark"
                alt="Twitter"
                className="w-4 h-4 object-contain shrink-0"
              />
              <span>Twitter</span>
            </a>

            {/* LinkedIn Link with Original SkillIcon */}
            <a
              href={PORTFOLIO_DATA.profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-all flex items-center gap-2 text-xs font-mono"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://skillicons.dev/icons?i=linkedin&theme=dark"
                alt="LinkedIn"
                className="w-4 h-4 object-contain shrink-0"
              />
              <span>LinkedIn</span>
            </a>

            {/* Resume Action */}
            <button
              onClick={() => {
                audioEngine.playKeyClick("down");
                setResumeOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-all flex items-center gap-2 text-xs font-mono"
            >
              <FileText className="w-4 h-4 text-neutral-300 shrink-0" />
              <span>Resume</span>
            </button>

          </div>
        </div>

      </div>

    </section>
  );
};
