"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { audioEngine } from "../lib/audio";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingScrollButtons: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePageUp = () => {
    audioEngine.playKeyClick("down");
    const lenis = (window as unknown as { lenis?: { scrollTo: (target: number, opts?: object) => void } }).lenis;
    const pageAmount = window.innerHeight * 0.85;
    if (lenis) {
      lenis.scrollTo(Math.max(0, window.scrollY - pageAmount), { duration: 1.2 });
    } else {
      window.scrollBy({ top: -pageAmount, behavior: "smooth" });
    }
  };

  const handlePageDown = () => {
    audioEngine.playKeyClick("down");
    const lenis = (window as unknown as { lenis?: { scrollTo: (target: number, opts?: object) => void } }).lenis;
    const pageAmount = window.innerHeight * 0.85;
    if (lenis) {
      lenis.scrollTo(window.scrollY + pageAmount, { duration: 1.2 });
    } else {
      window.scrollBy({ top: pageAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-3.5 sm:right-6 bottom-16 sm:bottom-18 z-40 flex flex-col gap-1.5 font-mono select-none">
      <AnimatePresence>
        {scrollY > 300 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePageUp}
            className="p-2.5 rounded-xl bg-[#0b0c0e]/95 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800/90 hover:border-neutral-700 shadow-xl shadow-black/60 backdrop-blur-xl transition-all flex items-center justify-center group cursor-pointer"
            title="Page Up (Smooth Scroll) • [PageUp / Shift+Space]"
            aria-label="Page Up"
          >
            <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, y: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePageDown}
        className="p-2.5 rounded-xl bg-[#0b0c0e]/95 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800/90 hover:border-neutral-700 shadow-xl shadow-black/60 backdrop-blur-xl transition-all flex items-center justify-center group cursor-pointer"
        title="Page Down (Smooth Scroll) • [PageDown / Space]"
        aria-label="Page Down"
      >
        <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-y-0.5" />
      </motion.button>
    </div>
  );
};
