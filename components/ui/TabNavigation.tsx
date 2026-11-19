"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { audioEngine } from "../../lib/audio";
import { cn } from "../../lib/utils";

export interface TabItem<T extends string = string> {
  id: T;
  label?: React.ReactNode;
  icon?: React.ReactNode | ((isActive: boolean) => React.ReactNode);
  count?: number | string;
  badge?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface TabNavigationProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  layoutId?: string;
  size?: "sm" | "md";
  className?: string;
  tabClassName?: string;
  playSound?: boolean;
}

export function TabNavigation<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  layoutId,
  size = "sm",
  className,
  tabClassName,
  playSound = true,
}: TabNavigationProps<T>) {
  const generatedId = useId();
  const activeLayoutId = layoutId || `tab-indicator-${generatedId}`;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
    md: "px-3.5 py-1.5 text-xs sm:text-sm gap-2 rounded-lg",
  };

  const handleClick = (tab: TabItem<T>) => {
    if (tab.disabled || tab.id === activeTab) return;
    if (playSound) {
      audioEngine.playKeyClick("down");
    }
    onChange(tab.id);
  };

  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-xl bg-neutral-950/80 border border-neutral-800/80 backdrop-blur-sm max-w-full overflow-x-auto scrollbar-none font-mono select-none shrink-0",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const resolvedIcon =
          typeof tab.icon === "function" ? tab.icon(isActive) : tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => handleClick(tab)}
            className={cn(
              "group relative inline-flex items-center justify-center font-mono font-medium transition-colors whitespace-nowrap focus:outline-none shrink-0 cursor-pointer",
              sizeClasses[size],
              isActive
                ? "text-black font-bold"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900/60",
              tab.disabled && "opacity-40 cursor-not-allowed pointer-events-none",
              tabClassName,
              tab.className
            )}
          >
            {/* Animated Sliding Pill */}
            {isActive && (
              <motion.div
                layoutId={activeLayoutId}
                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 32,
                  mass: 0.8,
                }}
              />
            )}

            {/* Tab Content */}
            <span
              className={cn(
                "relative z-10 flex items-center gap-1.5 transition-colors duration-150",
                isActive
                  ? "text-black font-bold"
                  : "text-neutral-400 group-hover:text-white"
              )}
            >
              {resolvedIcon}
              {tab.label !== undefined && <span>{tab.label}</span>}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "text-[10px] ml-0.5",
                    isActive
                      ? "text-black/70 font-semibold"
                      : "text-neutral-500"
                  )}
                >
                  ({tab.count})
                </span>
              )}
              {tab.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Export alias for developer convenience
export const TabNav = TabNavigation;
