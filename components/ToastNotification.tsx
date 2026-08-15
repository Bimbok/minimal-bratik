"use client";

import React from "react";
import { useThemeContext } from "../lib/theme-context";
import { motion, AnimatePresence } from "framer-motion";

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useThemeContext();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-16 right-4 z-50 pointer-events-none font-mono text-xs"
        >
          <div className="px-4 py-2.5 rounded-xl bg-[#0c0d10]/95 border border-neutral-700/80 text-neutral-200 shadow-2xl shadow-black/90 backdrop-blur-xl flex items-center gap-2.5 ring-1 ring-white/5">
            <span className="text-neutral-400 font-bold text-[11px] select-none">&gt;_</span>
            <span className="font-semibold text-white tracking-tight">{toastMessage}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
