"use client";

import React from "react";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { ArrowUpRight, Pin, Code2, FolderGit2 } from "lucide-react";
import { ProjectGithubHoverCard } from "./ProjectGithubHoverCard";
import { motion } from "framer-motion";

export const ProjectsSection: React.FC = () => {
  const { setSelectedProject } = useThemeContext();

  return (
    <section id="projects" className="space-y-4 pt-6 border-t border-neutral-800/80">
      
      {/* Section Header */}
      <div className="flex items-center justify-between font-sans">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-neutral-300" />
          <span>Projects</span>
        </h2>
        <span className="text-[11px] font-mono text-neutral-500">
          Hover cards to zoom & view live GitHub stats
        </span>
      </div>

      {/* 2-Column Grid with Monochrome Blackish Styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {PORTFOLIO_DATA.projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                /* Fallback code canvas for Sizuka */
                <div className="w-full h-full p-4 bg-[#090a0c] text-neutral-300 font-mono text-[11px] flex flex-col justify-between group-hover/img:scale-105 transition-transform duration-500">
                  <div className="flex items-center justify-between text-neutral-500 text-[10px] border-b border-neutral-800 pb-2">
                    <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                      <Code2 className="w-3.5 h-3.5" />
                      Sizuka REPL Shell
                    </span>
                    <span>Java AST Interpreter</span>
                  </div>
                  <div className="space-y-1 text-neutral-400 py-2 leading-relaxed">
                    <div className="text-neutral-300 font-bold">// Sizuka Language AST Evaluator</div>
                    <div><span className="text-neutral-400">fn</span> <span className="text-white">main</span>() &#123;</div>
                    <div className="pl-4"><span className="text-neutral-400">val</span> lang = <span className="text-neutral-200">&quot;Sizuka&quot;</span>;</div>
                    <div className="pl-4"><span className="text-neutral-300">println</span>(<span className="text-neutral-200">&quot;Syntax Parsed: &quot;</span> + lang);</div>
                    <div>&#125;</div>
                  </div>
                  <div className="text-[10px] text-neutral-500 border-t border-neutral-800 pt-1.5 flex items-center justify-between">
                    <span>$ sizuka --run main.sz</span>
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
                  className="text-base font-bold text-neutral-100 group-hover:text-white transition-colors font-sans cursor-pointer"
                >
                  {project.title}
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
      </div>
    </section>
  );
};
