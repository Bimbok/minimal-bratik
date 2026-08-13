"use client";

import React, { useState, useRef, useEffect } from "react";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { Terminal as TermIcon, Play, RefreshCw, Sparkles, Copy, Check } from "lucide-react";

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
}

export const LabSection: React.FC = () => {
  const { setTheme, setMatrixRainActive, toggleAudio, setResumeOpen, setNeofetchOpen, showToast } = useThemeContext();
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "welcome",
      output: (
        <div className="space-y-1 text-xs">
          <p className="text-[var(--accent-color)] font-bold">
            ⚡ Welcome to agy-sh v2.4 (x86_64-pc-linux-gnu)
          </p>
          <p className="text-[var(--text-muted)]">
            Type <span className="text-[var(--text-primary)] font-semibold">help</span> to list available commands or try <span className="text-[var(--text-primary)] font-semibold">neofetch</span>, <span className="text-[var(--text-primary)] font-semibold">matrix</span>, or <span className="text-[var(--text-primary)] font-semibold">sudo rm -rf /</span>.
          </p>
        </div>
      ),
    },
  ]);

  const [activeTab, setActiveTab] = useState<"terminal" | "utility">("terminal");
  const [encoderInput, setEncoderInput] = useState("Hello World!");
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    audioEngine.playKeyClick("enter");
    let output: React.ReactNode = null;
    const parts = trimmed.split(" ");
    const mainCmd = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase();

    switch (mainCmd) {
      case "help":
        output = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
            <div><span className="text-[var(--accent-color)] font-bold">help</span> - Show this help menu</div>
            <div><span className="text-[var(--accent-color)] font-bold">cat &lt;file&gt;</span> - Read file (resume, bio, skills)</div>
            <div><span className="text-[var(--accent-color)] font-bold">fetch / neofetch</span> - Show system specifications</div>
            <div><span className="text-[var(--accent-color)] font-bold">ls</span> - List directory contents</div>
            <div><span className="text-[var(--accent-color)] font-bold">theme &lt;name&gt;</span> - Switch theme (dark, gruvbox, crt)</div>
            <div><span className="text-[var(--accent-color)] font-bold">matrix</span> - Toggle digital Matrix code rain</div>
            <div><span className="text-[var(--accent-color)] font-bold">sound / mute</span> - Toggle mechanical key audio</div>
            <div><span className="text-[var(--accent-color)] font-bold">whoami</span> - Display active session user</div>
            <div><span className="text-[var(--accent-color)] font-bold">ping</span> - Check network connection latency</div>
            <div><span className="text-[var(--accent-color)] font-bold">clear</span> - Clear terminal buffer</div>
          </div>
        );
        break;

      case "ls":
        output = (
          <div className="flex gap-4 text-xs font-mono">
            <span className="text-emerald-400">bio.md</span>
            <span className="text-blue-400">projects.json</span>
            <span className="text-yellow-400">skills.yml</span>
            <span className="text-purple-400">resume.txt</span>
            <span className="text-red-400">secret.sh</span>
          </div>
        );
        break;

      case "cat":
        if (arg === "resume" || arg === "resume.txt") {
          setResumeOpen(true);
          output = <p className="text-xs text-[var(--accent-color)]">Opening resume viewer modal...</p>;
        } else if (arg === "bio" || arg === "bio.md") {
          output = <p className="text-xs">{PORTFOLIO_DATA.profile.bio}</p>;
        } else if (arg === "skills" || arg === "skills.yml") {
          output = <p className="text-xs text-yellow-400">Languages: TypeScript, Rust, Go, C++. Frameworks: Next.js, React, Node.js</p>;
        } else if (arg === "secret.sh") {
          output = <p className="text-xs text-red-400 font-bold">PERMISSION DENIED: You need level 5 clearance to run secret.sh!</p>;
        } else {
          output = <p className="text-xs text-red-400">File not found: {arg || "(no file specified)"}</p>;
        }
        break;

      case "fetch":
      case "neofetch":
        setNeofetchOpen(true);
        output = <p className="text-xs text-[var(--accent-color)] font-bold">Rendering system specs neofetch...</p>;
        break;

      case "theme":
        if (arg === "dark" || arg === "gruvbox" || arg === "crt") {
          setTheme(arg);
          output = <p className="text-xs text-emerald-400">Theme switched to: {arg}</p>;
        } else {
          output = <p className="text-xs text-red-400">Usage: theme [dark | gruvbox | crt]</p>;
        }
        break;

      case "matrix":
        setMatrixRainActive((prev) => !prev);
        output = <p className="text-xs text-emerald-400">Toggled Matrix Rain sequence!</p>;
        break;

      case "sound":
      case "mute":
        toggleAudio();
        output = <p className="text-xs text-emerald-400">Audio toggled!</p>;
        break;

      case "whoami":
        output = <p className="text-xs font-mono text-emerald-400">bimbok@hyprland-workstation (uid=1000)</p>;
        break;

      case "date":
        output = <p className="text-xs font-mono text-[var(--text-secondary)]">{new Date().toString()}</p>;
        break;

      case "ping":
        output = (
          <div className="text-xs font-mono space-y-0.5 text-emerald-400">
            <p>PING bimbok.dev (127.0.0.1) 56(84) bytes of data.</p>
            <p>64 bytes from localhost (127.0.0.1): icmp_seq=1 ttl=64 time=0.034 ms</p>
            <p>64 bytes from localhost (127.0.0.1): icmp_seq=2 ttl=64 time=0.028 ms</p>
            <p className="text-[var(--text-primary)] font-bold">--- bimbok.dev ping statistics --- 0% packet loss</p>
          </div>
        );
        break;

      case "sudo":
        if (trimmed.includes("rm -rf")) {
          audioEngine.playError();
          output = (
            <div className="p-2 rounded bg-red-950/60 border border-red-500/50 text-red-400 font-mono text-xs space-y-1 animate-bounce">
              <p className="font-bold">⚠️ SYSTEM CRITICAL ERROR: Deleting / root filesystem...</p>
              <p>[████████████████████████] 100% COMPLETE</p>
              <p className="text-yellow-400 font-semibold">Just kidding! Nice try hacker 🚀</p>
            </div>
          );
        } else {
          output = <p className="text-xs text-red-400">sudo: permission denied</p>;
        }
        break;

      case "clear":
        setHistory([]);
        return;

      default:
        audioEngine.playError();
        output = <p className="text-xs text-red-400">command not found: {mainCmd}. Type &apos;help&apos; for commands.</p>;
        break;
    }

    setHistory((prev) => [...prev, { command: trimmed, output }]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(inputVal);
    setInputVal("");
  };

  return (
    <section id="lab" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-color)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-color)] font-medium mb-1">
            <TermIcon className="w-3.5 h-3.5" />
            <span>/lab/playground.sh</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Terminal & Lab Playground
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => {
              audioEngine.playKeyClick("down");
              setActiveTab("terminal");
            }}
            className={`px-3 py-1.5 rounded-md border transition-colors ${
              activeTab === "terminal"
                ? "bg-[var(--badge-bg)] border-[var(--accent-color)] text-[var(--badge-text)] font-bold"
                : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)]"
            }`}
          >
            [CLI Shell]
          </button>
          <button
            onClick={() => {
              audioEngine.playKeyClick("down");
              setActiveTab("utility");
            }}
            className={`px-3 py-1.5 rounded-md border transition-colors ${
              activeTab === "utility"
                ? "bg-[var(--badge-bg)] border-[var(--accent-color)] text-[var(--badge-text)] font-bold"
                : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)]"
            }`}
          >
            [Dev Utils]
          </button>
        </div>
      </div>

      {activeTab === "terminal" ? (
        /* Interactive Shell Terminal */
        <div className="rounded-lg bg-[var(--terminal-bg)] border border-[var(--border-color)] shadow-2xl overflow-hidden font-mono text-xs">
          
          {/* Top Bar */}
          <div className="px-4 py-2 bg-[var(--bg-card)] border-b border-[var(--border-color)] flex items-center justify-between text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              <span className="ml-2 text-[var(--text-secondary)] font-semibold">agy-sh (zsh)</span>
            </div>
            <button
              onClick={() => setHistory([])}
              className="hover:text-[var(--accent-color)] transition-colors text-[10px]"
            >
              [Clear]
            </button>
          </div>

          {/* Terminal History Output */}
          <div className="p-4 space-y-3 min-h-[280px] max-h-[420px] overflow-y-auto">
            {history.map((entry, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="text-[var(--accent-color)] font-bold">user@bimbok:~$</span>
                  <span className="text-[var(--text-primary)]">{entry.command}</span>
                </div>
                <div className="pl-4">{entry.output}</div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Input Form */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-[var(--bg-card)]/50 border-t border-[var(--border-color)] flex items-center gap-2">
            <span className="text-[var(--accent-color)] font-bold pl-2">user@bimbok:~$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type 'help', 'neofetch', 'cat resume', 'matrix'..."
              className="flex-1 bg-transparent text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-muted)] font-mono text-xs"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-[var(--accent-color)] text-[var(--bg-main)] font-bold text-[11px]"
            >
              Run
            </button>
          </form>
        </div>
      ) : (
        /* Dev Utility Playground */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          
          {/* Base64 & Hash Generator */}
          <div className="p-5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
            <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-color)]" />
              <span>Base64 & Hash String Encoder</span>
            </h3>
            <input
              type="text"
              value={encoderInput}
              onChange={(e) => setEncoderInput(e.target.value)}
              className="w-full p-2.5 rounded bg-[var(--terminal-bg)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
            />
            <div className="space-y-2 pt-2 text-[var(--text-secondary)]">
              <div>
                <span className="text-[var(--text-muted)]">Base64:</span>
                <code className="block p-2 mt-1 rounded bg-[var(--bg-main)] text-emerald-400 break-all">
                  {typeof window !== "undefined" ? btoa(encoderInput || "") : ""}
                </code>
              </div>
            </div>
          </div>

          {/* Matrix Trigger Quick Launcher */}
          <div className="p-5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                <TermIcon className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Retro Matrix Digital Rain Trigger</span>
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                Launch hardware-accelerated Matrix canvas code rain effect or test retro CRT green phosphor mode.
              </p>
            </div>
            <button
              onClick={() => {
                audioEngine.playChime();
                setMatrixRainActive((prev) => !prev);
              }}
              className="w-full py-2.5 rounded bg-[var(--badge-bg)] border border-[var(--accent-color)] text-[var(--accent-color)] font-bold hover:brightness-110 transition-all text-center"
            >
              [Toggle Matrix Code Rain]
            </button>
          </div>

        </div>
      )}
    </section>
  );
};
