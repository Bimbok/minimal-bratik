"use client";

import React, { useState } from "react";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { Mail, Send, ShieldCheck, Copy, Check } from "lucide-react";

export const ContactSection: React.FC = () => {
  const { showToast } = useThemeContext();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.profile.socials.email);
    setCopiedEmail(true);
    audioEngine.playKeyClick("enter");
    showToast("Email address copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    audioEngine.playKeyClick("enter");

    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      audioEngine.playChime();
      showToast("Message dispatched!");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSentSuccess(false), 4000);
    }, 1000);
  };

  return (
    <section id="contact" className="space-y-4 pt-6 border-t border-neutral-800/80 font-mono text-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between font-sans">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-neutral-300" />
          <span>Get in Touch</span>
        </h2>
        <span className="text-[11px] font-mono text-neutral-500">
          {PORTFOLIO_DATA.profile.socials.email}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        
        {/* Left Info & Email Copy Box */}
        <div className="space-y-3">
          {/* Email Copy Box */}
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-2">
            <div className="text-[11px] text-neutral-400 font-medium">Direct Email Contact</div>
            <div className="flex items-center justify-between p-2 rounded bg-neutral-950 border border-neutral-800 text-xs">
              <code className="text-white font-bold">{PORTFOLIO_DATA.profile.socials.email}</code>
              <button
                onClick={handleCopyEmail}
                className="p-1 text-neutral-400 hover:text-white transition-colors"
                title="Copy Email Address"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* GPG Fingerprint Card */}
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-300" />
                Verified GPG Key
              </span>
            </div>
            <code className="block p-2 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 font-mono text-[10px] break-all">
              {PORTFOLIO_DATA.profile.gpgFingerprint}
            </code>
          </div>
        </div>

        {/* Right Dispatch Form */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-3">
          <div className="text-xs font-bold text-neutral-200 border-b border-neutral-800 pb-2">
            Send a Quick Message
          </div>

          {sentSuccess ? (
            <div className="p-3 rounded bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs">
              ✓ Message logged to buffer! I will reply shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Name"
                className="w-full p-2 rounded bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-neutral-600"
              />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full p-2 rounded bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-neutral-600"
              />
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message..."
                className="w-full p-2 rounded bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-neutral-600 resize-none"
              />
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 rounded bg-white text-black font-extrabold hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-black/40 text-xs"
              >
                <Send className="w-3.5 h-3.5 text-black" />
                <span>{isSending ? "Dispatching..." : "Send Message"}</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Footer copyright */}
      <div className="mt-12 pt-4 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-2">
        <div>
          © {new Date().getFullYear()} Bratik Mukherjee. Built with Next.js 16 & Tailwind CSS.
        </div>
        <div className="flex items-center gap-3">
          <span>Press <kbd className="px-1 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">?</kbd> for Vim Shortcuts</span>
          <span>•</span>
          <span className="text-neutral-400 font-semibold">Ready for production</span>
        </div>
      </div>
    </section>
  );
};
