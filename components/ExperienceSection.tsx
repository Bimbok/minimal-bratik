"use client";

import React, { useState } from "react";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { audioEngine } from "../lib/audio";
import { ChevronDown, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ExperienceSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("algoscope-exp");

  const techIconMap: Record<string, string> = {
    "React.js": "react",
    "D3.js": "js",
    "PostgreSQL": "postgres",
    "JavaScript": "js",
    "Tailwind CSS": "tailwind",
    "Git": "git",
    "GitHub Actions": "githubactions",
    "Open Source": "github",
    "CI/CD": "githubactions",
    "Python": "py",
    "Flask": "flask",
    "LLM": "py",
    "ChromaDB": "py",
    "AI": "py",
    "C++": "cpp",
    "Kotlin": "kotlin",
    "Go": "go",
    "SQLite": "sqlite",
    "Android MVVM": "android",
  };

  const toggleAccordion = (id: string) => {
    audioEngine.playKeyClick("down");
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="experience" className="space-y-4 pt-4 border-t border-neutral-800/80">
      {/* Section Title */}
      <div className="flex items-center justify-between font-sans">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Experiences
        </h2>
        <span className="text-[11px] font-mono text-neutral-500">
          Work & Mentorship
        </span>
      </div>

      {/* Accordion List */}
      <div className="space-y-2.5">
        {PORTFOLIO_DATA.experiences.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-xl bg-neutral-900/60 border border-neutral-800/70 hover:border-neutral-700/80 transition-colors overflow-hidden font-mono"
            >
              {/* Header Row */}
              <button
                onClick={() => toggleAccordion(item.id)}
                className="w-full p-3.5 flex items-center justify-between gap-3 text-left focus:outline-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Real Official Brand Logo Image */}
                  <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800/80 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.logoUrl}
                      alt={item.company}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Role & Company */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-neutral-100 truncate font-sans">
                        {item.title}
                      </h3>
                      {item.type && (
                        <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-medium">
                          {item.type}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400 truncate">
                      {item.role} • <span className="text-neutral-500">{item.company}</span>
                    </div>
                  </div>
                </div>

                {/* Right Date & Chevron */}
                <div className="flex items-center gap-3 text-right shrink-0">
                  <div className="text-xs text-neutral-400">
                    <div className="font-medium text-neutral-200">{item.dates}</div>
                    <div className="text-[10px] text-neutral-500 flex items-center justify-end gap-1">
                      <MapPin className="w-2.5 h-2.5 text-neutral-400" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Accordion Details Content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-neutral-800/50 space-y-3">
                      <ul className="space-y-1.5 text-xs text-neutral-300 list-disc list-inside leading-relaxed font-sans">
                        {item.description.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>

                      {/* Tech Tags with Full-Color SkillIcons.dev icons */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tech.map((t) => {
                          const iconKey = techIconMap[t] || "ts";
                          return (
                            <span
                              key={t}
                              className="px-2 py-1 rounded-lg text-[10px] bg-neutral-950 border border-neutral-800 text-neutral-300 flex items-center gap-1.5 font-mono"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`https://skillicons.dev/icons?i=${iconKey}&theme=dark`}
                                alt={t}
                                className="w-3.5 h-3.5 object-contain"
                              />
                              <span>{t}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>
    </section>
  );
};
