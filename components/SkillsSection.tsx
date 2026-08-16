"use client";

import React, { useState } from "react";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { audioEngine } from "../lib/audio";
import { Marquee } from "./ui/marquee";
import { Cpu, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillItemWithCategory {
  name: string;
  level: number;
  experience: string;
  description: string;
  tags: string[];
  featuredCommand?: string;
  iconKey: string;
  category: string;
}

export const SkillsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Skill icons mapping from skillicons.dev
  const skillIconMap: Record<string, string> = {
    TypeScript: "ts",
    "C++": "cpp",
    C: "c",
    Go: "go",
    Rust: "rust",
    Kotlin: "kotlin",
    Java: "java",
    Python: "py",
    "Next.js & React 19": "nextjs",
    "Node.js & Express": "nodejs",
    "MongoDB & PostgreSQL": "mongodb",
    "Tailwind CSS & D3.js": "tailwind",
    "Framer Motion & Three.js": "threejs",
    "Neovim & Lua": "vim",
    "Obsidian & PKM": "obsidian",
    "Arch Linux & Hyprland": "arch",
    "Git & GitHub Automation": "git",
    "CMake & Linux Toolchains": "cmake",
    "Docker & Kubernetes": "docker",
    "Bash & POSIX Shell": "bash",
    "LLM & Applied AI (LLaMA 3.1)": "py",
    "WebSockets & Real-Time Telemetry": "react",
    "Microservices & Security Architecture": "linux",
  };

  const allSkills: SkillItemWithCategory[] = PORTFOLIO_DATA.skills.flatMap((cat) =>
    cat.skills.map((skill) => ({
      ...skill,
      category: cat.category,
      iconKey: skillIconMap[skill.name] || "ts",
    }))
  );

  const row1 = allSkills.slice(0, Math.ceil(allSkills.length / 2));
  const row2 = allSkills.slice(Math.ceil(allSkills.length / 2));

  const filteredSkills = allSkills.filter((skill) => {
    const matchesTab = activeCategory === "All" || skill.category === activeCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <section id="skills" className="space-y-4 pt-6 border-t border-neutral-800/80">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-neutral-300" />
          <span>Skills & Environment</span>
        </h2>

        {/* Search */}
        <div className="relative min-w-[180px] font-mono text-xs">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-[11px] focus:outline-none focus:border-neutral-600 placeholder:text-neutral-600"
          />
        </div>
      </div>

      {/* Infinite Scrolling Marquee Container */}
      <div className="relative rounded-2xl bg-neutral-900/40 border border-neutral-800/60 p-2 overflow-hidden">
        
        {/* Left & Right Gradient Blur Masks for Seamless Marquee Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0e0f12] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0e0f12] to-transparent z-10 pointer-events-none" />

        {!searchQuery ? (
          <div className="space-y-2">
            {/* Row 1: Forward Marquee */}
            <Marquee pauseOnHover repeat={4} className="[--duration:30s]">
              {row1.map((skill) => (
                <SkillCardItem
                  key={skill.name}
                  skill={skill}
                  isHovered={hoveredSkill === skill.name}
                  onHover={setHoveredSkill}
                />
              ))}
            </Marquee>

            {/* Row 2: Reverse Marquee */}
            <Marquee reverse pauseOnHover repeat={4} className="[--duration:30s]">
              {row2.map((skill) => (
                <SkillCardItem
                  key={skill.name}
                  skill={skill}
                  isHovered={hoveredSkill === skill.name}
                  onHover={setHoveredSkill}
                />
              ))}
            </Marquee>
          </div>
        ) : (
          /* Search Filter Grid Fallback */
          <div className="flex flex-wrap gap-2 p-3">
            {filteredSkills.map((skill) => (
              <SkillCardItem
                key={skill.name}
                skill={skill}
                isHovered={hoveredSkill === skill.name}
                onHover={setHoveredSkill}
              />
            ))}
          </div>
        )}
      </div>

    </section>
  );
};

// Skill Card Item Component with Full-Color SkillIcons.dev Image & Monochrome Card
const SkillCardItem: React.FC<{
  skill: SkillItemWithCategory;
  isHovered: boolean;
  onHover: (name: string | null) => void;
}> = ({ skill, isHovered, onHover }) => {
  return (
    <div
      onMouseEnter={() => onHover(skill.name)}
      onMouseLeave={() => onHover(null)}
      className="relative shrink-0"
    >
      <button
        onClick={() => audioEngine.playKeyClick("down")}
        className={`px-3 py-2 rounded-xl border transition-all duration-200 flex items-center gap-2.5 text-xs font-mono focus:outline-none ${
          isHovered
            ? "bg-neutral-800 text-white border-neutral-700 shadow-md scale-105"
            : "bg-neutral-900/90 border-neutral-800/80 text-neutral-200 hover:border-neutral-700"
        }`}
      >
        {/* Full-Color SkillIcons.dev Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://skillicons.dev/icons?i=${skill.iconKey}&theme=dark`}
          alt={skill.name}
          className="w-5 h-5 object-contain shrink-0 rounded-sm"
          loading="lazy"
        />

        <span className="font-semibold text-xs whitespace-nowrap">{skill.name}</span>
        
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400 border border-neutral-800 font-mono">
          {skill.experience}
        </span>
      </button>

      {/* Hover Tooltip Popup */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full left-0 mb-2 w-64 p-3 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl z-50 text-[11px] font-mono text-neutral-300 space-y-1.5 pointer-events-none"
          >
            <div className="flex items-center justify-between font-bold text-white font-sans">
              <span className="flex items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://skillicons.dev/icons?i=${skill.iconKey}&theme=dark`}
                  alt={skill.name}
                  className="w-4 h-4 object-contain"
                />
                {skill.name}
              </span>
              <span className="text-white font-mono text-[10px]">{skill.level}%</span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-snug">
              {skill.description}
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {skill.tags.map((t) => (
                <span
                  key={t}
                  className="px-1.5 py-0.5 rounded text-[9px] bg-neutral-950 text-neutral-400 border border-neutral-800"
                >
                  #{t}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
