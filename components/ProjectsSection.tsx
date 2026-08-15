"use client";

import React, { useState } from "react";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { ArrowUpRight, Pin, Code2, FolderGit2, ChevronDown } from "lucide-react";
import { ProjectGithubHoverCard } from "./ProjectGithubHoverCard";
import { motion, AnimatePresence } from "framer-motion";

export const ProjectsSection: React.FC = () => {
  const { setSelectedProject } = useThemeContext();
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? PORTFOLIO_DATA.projects : PORTFOLIO_DATA.projects.slice(0, 4);

  return (
    <section id="projects" className="space-y-5 pt-6 border-t border-neutral-800/80">
      
      {/* Section Header */}
      <div className="flex items-center justify-between font-sans">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-neutral-300" />
          <span>Projects</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono font-normal">
            {PORTFOLIO_DATA.projects.length} Total
          </span>
        </h2>
        <span className="text-[11px] font-mono text-neutral-500">
          Hover cards to zoom & view live GitHub stats
        </span>
      </div>

      {/* 2-Column Grid with Monochrome Blackish Styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        <AnimatePresence>
          {visibleProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 hover:shadow-xl hover:shadow-black/50 transition-all duration-300 flex flex-col justify-between space-y-3 group overflow-hidden"
            >
              {/* Top Preview Image Container with Full-Color Preview & Glare Effect */}
              <div
                className="h-44 sm:h-52 w-full rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950 relative group/img cursor-pointer"
                onClick={() => {
                  audioEngine.playKeyClick("down");
                  setSelectedProject(project);
                }}
              >
                {project.imagePath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.imagePath}
                    alt={project.title}
                    className="w-full h-full object-cover object-top group-hover/img:scale-110 group-hover/img:brightness-110 transition-transform duration-500 ease-out filter contrast-105"
                  />
                ) : (
                  /* Fallback code canvas for Sizuka / Code projects */
                  <div className="w-full h-full p-4 bg-[#090a0c] text-neutral-300 font-mono text-[11px] flex flex-col justify-between group-hover/img:scale-105 transition-transform duration-500">
                    <div className="flex items-center justify-between text-neutral-500 text-[10px] border-b border-neutral-800 pb-2">
                      <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                        <Code2 className="w-3.5 h-3.5" />
                        {project.title} Console
                      </span>
                      <span>{project.tech[0]} Architecture</span>
                    </div>
                    <div className="space-y-1 text-neutral-400 py-2 leading-relaxed">
                      <div className="text-neutral-300 font-bold">// {project.title} Execution Context</div>
                      <div><span className="text-neutral-400">fn</span> <span className="text-white">init</span>() &#123;</div>
                      <div className="pl-4"><span className="text-neutral-400">val</span> status = <span className="text-neutral-200">&quot;OK&quot;</span>;</div>
                      <div className="pl-4"><span className="text-neutral-300">println</span>(<span className="text-neutral-200">&quot;Ready: &quot;</span> + status);</div>
                      <div>&#125;</div>
                    </div>
                    <div className="text-[10px] text-neutral-500 border-t border-neutral-800 pt-1.5 flex items-center justify-between">
                      <span>$ {project.id} --status</span>
                      <span className="text-neutral-200 font-bold">Status: OK</span>
                    </div>
                  </div>
                )}

                {/* Hover Glare Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover/img:opacity-20 transition-opacity duration-300 pointer-events-none" />

                {/* Pin Icon overlay */}
                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-neutral-700/60 text-neutral-400 group-hover/img:text-white group-hover/img:scale-110 transition-all">
                  <Pin className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Project Details Below Image */}
              <div className="space-y-2 px-1">
                
                {/* Title & Status Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <h3
                    onClick={() => {
                      audioEngine.playKeyClick("down");
                      setSelectedProject(project);
                    }}
                    className="text-base font-bold text-neutral-100 group-hover:text-white transition-colors font-sans cursor-pointer flex items-center gap-2"
                  >
                    {project.logoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.logoUrl}
                        alt={`${project.title} logo`}
                        className="w-5 h-5 rounded-full object-cover border border-neutral-800 shrink-0 group-hover:scale-110 transition-transform"
                      />
                    )}
                    <span>{project.title}</span>
                  </h3>

                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                    <span>{project.status}</span>
                  </div>
                </div>

                {/* Concise Description */}
                <p className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors leading-relaxed font-sans line-clamp-2">
                  {project.tagline}
                </p>

                {/* Bottom Row: Full-Color Tech Icons (Left) & GitHub Stats / View Action (Right) */}
                <div className="flex items-center justify-between text-xs pt-2.5 border-t border-neutral-800/60">
                  {/* Tech icons from skillicons.dev */}
                  <div className="flex items-center gap-1.5">
                    {project.techIcons?.map((icon) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={icon}
                        src={`https://skillicons.dev/icons?i=${icon}&theme=dark`}
                        alt={icon}
                        className="w-4 h-4 object-contain rounded-xs opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
                      />
                    ))}
                  </div>

                  {/* Right: Live GitHub Stats Card & View Link */}
                  <div className="flex items-center gap-2">
                    <ProjectGithubHoverCard repoPath={project.repoPath} />

                    <button
                      onClick={() => {
                        audioEngine.playKeyClick("down");
                        setSelectedProject(project);
                      }}
                      className="text-neutral-300 hover:text-white transition-colors font-medium text-[11px] flex items-center gap-1 font-sans group/btn"
                    >
                      <span>View Project</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
                    </button>
                  </div>

                </div>

              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More / Show Less Interactive Button */}
      {PORTFOLIO_DATA.projects.length > 4 && (
        <div className="flex justify-center pt-3">
          <button
            onClick={() => {
              audioEngine.playKeyClick("down");
              setShowAll((prev) => !prev);
            }}
            className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-[#0e0f13] border border-neutral-800 hover:border-neutral-600 text-neutral-200 hover:text-white font-mono text-xs font-semibold shadow-xl hover:shadow-black/60 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <span>
              {showAll ? "Show Less" : `Show More Projects (+${PORTFOLIO_DATA.projects.length - 4})`}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-neutral-400 group-hover:text-white transition-transform duration-300 ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}
    </section>
  );
};
