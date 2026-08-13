"use client";

import { useEffect, useRef } from "react";
import { useThemeContext } from "./theme-context";
import { audioEngine } from "./audio";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useGlobalShortcuts() {
  const {
    setCommandPaletteOpen,
    setVimPromptOpen,
    setKeyboardHelpOpen,
    setMatrixRainActive,
    setTheme,
    theme,
    showToast,
    commandPaletteOpen,
    vimPromptOpen,
    neofetchOpen,
    resumeOpen,
    keyboardHelpOpen,
    selectedProject,
    setSelectedProject,
    setNeofetchOpen,
    setResumeOpen,
  } = useThemeContext();

  const lastGKeyTimeRef = useRef<number>(0);
  const konamiIndexRef = useRef<number>(0);

  // Global mouse click listener for realistic tactile click feedback across all interactive elements
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest(
        "button, a, input, [role='button'], .cursor-pointer, summary, select, textarea"
      );
      if (isInteractive) {
        audioEngine.playMouseClick("down");
      }
    };

    window.addEventListener("mousedown", handleMouseDown, { capture: true });
    return () => window.removeEventListener("mousedown", handleMouseDown, { capture: true });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // Play subtle keyboard click sound for any user key stroke if audio is enabled
      if (!e.metaKey && !e.ctrlKey && e.key.length === 1) {
        audioEngine.playKeyClick(e.key === "Enter" ? "enter" : e.key === "Backspace" ? "backspace" : "down");
      }

      // Check Konami Code
      const expectedKey = KONAMI_CODE[konamiIndexRef.current];
      if (
        e.key.toLowerCase() === expectedKey.toLowerCase() ||
        e.code === expectedKey
      ) {
        konamiIndexRef.current += 1;
        if (konamiIndexRef.current === KONAMI_CODE.length) {
          konamiIndexRef.current = 0;
          setMatrixRainActive(true);
          setTheme(theme === "crt" ? "dark" : "crt");
          audioEngine.playChime();
          showToast("🎮 KONAMI CODE UNLOCKED! Matrix & Retro CRT Mode Enabled.");
          try {
            import("canvas-confetti").then((confetti) => {
              confetti.default({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
            });
          } catch {
            // ignore
          }
          return;
        }
      } else {
        if (e.key === "ArrowUp") {
          konamiIndexRef.current = 1;
        } else {
          konamiIndexRef.current = 0;
        }
      }

      // Escape key closes any open modal or prompt
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
        setVimPromptOpen(false);
        setKeyboardHelpOpen(false);
        setNeofetchOpen(false);
        setResumeOpen(false);
        setSelectedProject(null);
        if (isInput) {
          target.blur();
        }
        return;
      }

      // If user is currently typing in an input field or modal is open, ignore vim shortcuts
      if (isInput) {
        return;
      }

      const anyModalOpen =
        commandPaletteOpen ||
        vimPromptOpen ||
        neofetchOpen ||
        resumeOpen ||
        keyboardHelpOpen ||
        selectedProject !== null;

      // Command Palette: Cmd + K or Ctrl + K or /
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      if (e.key === "/" && !anyModalOpen) {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // Vim Command Prompt: ":"
      if (e.key === ":" && !anyModalOpen) {
        e.preventDefault();
        setVimPromptOpen(true);
        return;
      }

      // Help Modal: "?"
      if (e.key === "?" && !anyModalOpen) {
        e.preventDefault();
        setKeyboardHelpOpen(true);
        return;
      }

      // If any modal is active, do not process page navigation Vim keys
      if (anyModalOpen) return;

      const lenis = (window as unknown as { lenis?: { scrollTo: (target: number | HTMLElement, opts?: object) => void } }).lenis;

      // Vim Navigation: j / k / gg / G with Lenis 60FPS smooth momentum easing
      if (e.key === "j") {
        if (lenis) {
          lenis.scrollTo(window.scrollY + 200, { duration: 1.2 });
        } else {
          window.scrollBy({ top: 200, behavior: "smooth" });
        }
      } else if (e.key === "k") {
        if (lenis) {
          lenis.scrollTo(window.scrollY - 200, { duration: 1.2 });
        } else {
          window.scrollBy({ top: -200, behavior: "smooth" });
        }
      } else if (e.key === "g") {
        const now = Date.now();
        if (now - lastGKeyTimeRef.current < 400) {
          // gg sequence triggered -> scroll to top
          if (lenis) {
            lenis.scrollTo(0, { duration: 1.8 });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          lastGKeyTimeRef.current = 0;
        } else {
          lastGKeyTimeRef.current = now;
        }
      } else if (e.key === "G") {
        // G sequence triggered -> scroll to bottom
        if (lenis) {
          lenis.scrollTo(document.body.scrollHeight, { duration: 1.8 });
        } else {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }
      }

      // Quick tab number jumps (1 to 5)
      if (["1", "2", "3", "4", "5"].includes(e.key)) {
        const sectionIds = ["home", "experience", "projects", "opensource", "skills"];
        const targetId = sectionIds[parseInt(e.key) - 1];
        const elem = document.getElementById(targetId);
        if (elem) {
          if (lenis) {
            lenis.scrollTo(elem, { duration: 1.5, offset: -20 });
          } else {
            elem.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    commandPaletteOpen,
    vimPromptOpen,
    neofetchOpen,
    resumeOpen,
    keyboardHelpOpen,
    selectedProject,
    theme,
    setCommandPaletteOpen,
    setVimPromptOpen,
    setKeyboardHelpOpen,
    setMatrixRainActive,
    setTheme,
    showToast,
    setSelectedProject,
    setNeofetchOpen,
    setResumeOpen,
  ]);
}
