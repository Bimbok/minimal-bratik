"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { PORTFOLIO_DATA } from "../lib/portfolio-data";
import { useThemeContext } from "../lib/theme-context";
import { audioEngine } from "../lib/audio";
import { Mail, Send, ShieldCheck, Copy, Check, Phone, UserPlus, PhoneCall, Loader2, CheckCircle2 } from "lucide-react";

export const ContactSection: React.FC = () => {
  const { showToast } = useThemeContext();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const phoneNum = PORTFOLIO_DATA.profile.socials.phone || "+91 9883593295";
  const telLink = "tel:+919883593295";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.profile.socials.email);
    setCopiedEmail(true);
    audioEngine.playKeyClick("enter");
    showToast("Email address copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("+919883593295");
    setCopiedPhone(true);
    audioEngine.playKeyClick("enter");
    showToast("Phone number copied to clipboard!");
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleDownloadVCard = () => {
    const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:Bratik Mukherjee
N:Mukherjee;Bratik;;;
NICKNAME:Bimbok
TITLE:Full Stack & Software Developer — System Architect
EMAIL;TYPE=INTERNET,HOME:bimbokmkj@gmail.com
TEL;TYPE=CELL,VOICE:+919883593295
URL:https://bimbok-portfolio.vercel.app
URL;TYPE=GitHub:https://github.com/Bimbok
URL;TYPE=LinkedIn:https://linkedin.com/in/bimbok
ADR;TYPE=HOME:;;West Bengal;India;;;
NOTE:Full Stack & Software Developer specializing in C++, Go, Python, React, and Linux Systems.
END:VCARD`;

    const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Bratik_Mukherjee.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    audioEngine.playChime();
    showToast("Downloaded Bratik Mukherjee vCard (.vcf)!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    setStatusMessage(null);
    audioEngine.playKeyClick("enter");

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

    try {
      if (publicKey && serviceId && templateId) {
        // Send directly via EmailJS API
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.name,
            from_email: formData.email,
            reply_to: formData.email,
            message: formData.message,
            to_name: "Bratik Mukherjee",
          },
          publicKey
        );

        setIsSending(false);
        setSentSuccess(true);
        setStatusMessage("Message delivered straight to Bratik's inbox via EmailJS! ✓");
        audioEngine.playChime();
        showToast("Message sent successfully via EmailJS!");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSentSuccess(false), 5000);
      } else {
        // Fallback: mailto client if EmailJS keys not yet provided in .env
        const subject = encodeURIComponent(`Portfolio Message from ${formData.name}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
        window.open(`mailto:${PORTFOLIO_DATA.profile.socials.email}?subject=${subject}&body=${body}`, "_blank");

        setIsSending(false);
        setSentSuccess(true);
        setStatusMessage("Opened default email client! (Add EmailJS keys to .env to send silently)");
        audioEngine.playChime();
        showToast("Email client opened!");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSentSuccess(false), 5000);
      }
    } catch (err: unknown) {
      console.error("EmailJS Error:", err);
      setIsSending(false);
      audioEngine.playError();
      showToast("EmailJS error. Opening mail client fallback...");
      const subject = encodeURIComponent(`Portfolio Message from ${formData.name}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
      window.open(`mailto:${PORTFOLIO_DATA.profile.socials.email}?subject=${subject}&body=${body}`, "_blank");
    }
  };

  return (
    <section id="contact" className="space-y-4 pt-6 border-t border-neutral-800/80 font-mono text-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between font-sans flex-wrap gap-2">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-neutral-300" />
          <span>Get in Touch</span>
        </h2>
        <span className="text-[11px] font-mono text-neutral-500">
          {PORTFOLIO_DATA.profile.socials.email}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        
        {/* Left Info & Contact Cards */}
        <div className="space-y-3">
          {/* Email Copy Box */}
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-2">
            <div className="text-[11px] text-neutral-400 font-medium flex items-center justify-between">
              <span>Direct Email Contact</span>
              <span className="text-[10px] text-neutral-500">bimbokmkj@gmail.com</span>
            </div>
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

          {/* Phone & Recruiter Contact Box */}
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/70 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <Phone className="w-3.5 h-3.5 text-white" />
                Phone & Recruiter Contact
              </span>
              <span className="text-[10px] text-neutral-500">+91 9883593295</span>
            </div>

            {/* Direct Phone Number Box - Tapping opens dialer on mobile */}
            <div className="flex items-center justify-between p-2 rounded bg-neutral-950 border border-neutral-800 text-xs">
              <a
                href={telLink}
                className="text-white font-bold hover:underline flex items-center gap-1.5"
                title="Tap to call +91 9883593295"
              >
                <code>{phoneNum}</code>
              </a>
              <button
                onClick={handleCopyPhone}
                className="p-1 text-neutral-400 hover:text-white transition-colors"
                title="Copy Phone Number"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Dual CTA Buttons: Direct Mobile Dialer + Save vCard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5 font-mono text-xs">
              <a
                href={telLink}
                className="py-2 px-3 rounded-lg bg-white text-black font-extrabold hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5 shadow-md text-xs"
                title="Open Phone Dialer directly"
              >
                <PhoneCall className="w-3.5 h-3.5 text-black" />
                <span>Call Phone</span>
              </a>

              <button
                onClick={handleDownloadVCard}
                className="py-2 px-3 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-800 hover:text-white hover:bg-neutral-800 transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
                title="Download vCard (.vcf)"
              >
                <UserPlus className="w-3.5 h-3.5 text-white" />
                <span>Save vCard</span>
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
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMessage || "Message delivered successfully! I will reply shortly."}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <input
                type="text"
                required
                name="from_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Name"
                className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-neutral-600 placeholder:text-neutral-600 font-mono"
              />
              <input
                type="email"
                required
                name="from_email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-neutral-600 placeholder:text-neutral-600 font-mono"
              />
              <textarea
                required
                rows={3}
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message..."
                className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-neutral-600 placeholder:text-neutral-600 resize-none font-mono"
              />
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 rounded-lg bg-white text-black font-extrabold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md shadow-black/40 text-xs disabled:opacity-60 cursor-pointer font-sans"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-black animate-spin" />
                    <span>Dispatching via EmailJS...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-black" />
                    <span>Send Message</span>
                  </>
                )}
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
        </div>
      </div>
    </section>
  );
};
