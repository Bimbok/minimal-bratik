"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GithubUserData {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  blog: string | null;
  bio: string | null;
}

export const GithubHoverCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<GithubUserData | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("https://api.github.com/users/Bimbok")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: GithubUserData | null) => {
        if (data && isMounted) {
          setUserData(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const profile = userData || {
    login: "Bimbok",
    avatar_url: "https://avatars.githubusercontent.com/u/132834022?v=4",
    html_url: "https://github.com/Bimbok",
    name: "Bratik Mukherjee",
    location: "West Bengal, India",
    public_repos: 39,
    followers: 20,
    following: 12,
    blog: "https://bimbok-portfolio.vercel.app/",
    bio: null,
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Anchor Button with Original SkillIcon */}
      <a
        href={profile.html_url}
        target="_blank"
        rel="noreferrer"
        className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-all flex items-center gap-2 text-xs font-mono group"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://skillicons.dev/icons?i=github&theme=dark"
          alt="GitHub"
          className="w-4 h-4 object-contain shrink-0"
        />
        <span className="font-semibold">GitHub</span>
      </a>

      {/* Real-data Tooltip Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-0 mb-3 w-80 z-50 p-4 rounded-xl bg-[#0e0f12] border border-neutral-700 shadow-2xl backdrop-blur-xl font-mono text-xs text-neutral-200 space-y-3 pointer-events-auto"
          >
            {/* Header / Avatar */}
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatar_url}
                  alt={profile.login}
                  className="w-12 h-12 rounded-lg border border-neutral-700 object-cover bg-neutral-900"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-neutral-900" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm truncate text-white">
                    {profile.name || profile.login}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                </div>
                <div className="text-[11px] text-neutral-400 truncate font-semibold">
                  @{profile.login}
                </div>
                {profile.location && (
                  <div className="flex items-center gap-1 text-[10px] text-neutral-500 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Bio if present */}
            {profile.bio && (
              <p className="text-[11px] text-neutral-300 leading-relaxed p-2 rounded bg-neutral-950 border border-neutral-800">
                {profile.bio}
              </p>
            )}

            {/* Real GitHub API Metrics */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-neutral-800 text-center text-[10px]">
              <div className="p-1.5 rounded bg-neutral-950">
                <div className="text-[9px] text-neutral-500">Public Repos</div>
                <div className="font-bold text-white mt-0.5">{profile.public_repos}</div>
              </div>
              <div className="p-1.5 rounded bg-neutral-950">
                <div className="text-[9px] text-neutral-500">Followers</div>
                <div className="font-bold text-white mt-0.5">{profile.followers}</div>
              </div>
              <div className="p-1.5 rounded bg-neutral-950">
                <div className="text-[9px] text-neutral-500">Following</div>
                <div className="font-bold text-white mt-0.5">{profile.following}</div>
              </div>
            </div>

            {/* Direct Profile Action */}
            <a
              href={profile.html_url}
              target="_blank"
              rel="noreferrer"
              className="w-full py-1.5 rounded bg-white text-black font-extrabold text-[11px] flex items-center justify-center gap-1.5 hover:bg-neutral-200 transition-all text-center block shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://skillicons.dev/icons?i=github&theme=dark"
                alt="GitHub"
                className="w-3.5 h-3.5 object-contain shrink-0"
              />
              <span>View github.com/{profile.login}</span>
            </a>

            {/* Pointer tail */}
            <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#0e0f12] border-b border-r border-neutral-700 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
