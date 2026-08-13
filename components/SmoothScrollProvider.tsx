"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      wheelMultiplier: 0.65,
      touchMultiplier: 1.2,
      infinite: false,
    });

    // Make lenis globally accessible for smooth keybinding & button scrolling
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      (window as unknown as { lenis: Lenis | null }).lenis = null;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
