"use client";

import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { useThemeContext } from "../lib/theme-context";
import { PORTFOLIO_DATA, CertificationItem } from "../lib/portfolio-data";
import { audioEngine } from "../lib/audio";
import { Award, X, ExternalLink, Calendar, CheckCircle2, Maximize2 } from "lucide-react";

export const CertificationsModal: React.FC = () => {
  const { certificationsOpen, setCertificationsOpen } = useThemeContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Pause main page Lenis scroll when modal is active
  useEffect(() => {
    const mainLenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (certificationsOpen) {
      if (mainLenis) mainLenis.stop();
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (mainLenis) mainLenis.start();
      document.body.style.overflow = "";
    };
  }, [certificationsOpen]);

  // Instantiate isolated Lenis smooth scroll for internal popup content
  useEffect(() => {
    if (!certificationsOpen || !wrapperRef.current || !contentRef.current) return;

    const modalLenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
      infinite: false,
    });

    let rafId: number;
    function raf(time: number) {
      modalLenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      modalLenis.destroy();
    };
  }, [certificationsOpen]);

  if (!certificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0"
        onClick={() => setCertificationsOpen(false)}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-[#0e0f12] border border-neutral-700 shadow-2xl overflow-hidden flex flex-col z-10 text-neutral-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight font-sans">
                Verified Certifications & Achievements
              </h2>
              <p className="text-[11px] text-neutral-400 font-mono">
                Official credentials, hackathon recognitions & course completions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">
              ESC to exit
            </kbd>
            <button
              onClick={() => {
                audioEngine.playKeyClick("down");
                setCertificationsOpen(false);
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inner Container with dedicated Lenis smooth scroll */}
        <div
          ref={wrapperRef}
          data-lenis-prevent
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6"
        >
          <div ref={contentRef} className="space-y-6">
            {PORTFOLIO_DATA.certifications.map((cert: CertificationItem) => (
              <div
                key={cert.id}
                className="rounded-xl bg-[#121419] border border-neutral-800 p-4 sm:p-5 space-y-4 hover:border-neutral-700 transition-all shadow-md group"
              >
                {/* Top Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      <h3 className="text-sm sm:text-base font-bold text-white font-sans">
                        {cert.title}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium pl-6">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 pl-6 sm:pl-0 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{cert.date}</span>
                  </div>
                </div>

                {/* Certificate Image Preview Card */}
                <div
                  className="relative w-full rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 group/img cursor-pointer"
                  onClick={() => setSelectedImage(cert.imagePath)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cert.imagePath}
                    alt={cert.title}
                    className="w-full h-auto max-h-80 object-contain mx-auto transition-transform duration-300 group-hover/img:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                    <Maximize2 className="w-4 h-4" />
                    <span>Click to Expand Full Screen</span>
                  </div>
                </div>

                {/* Description Details */}
                <div className="space-y-2 text-xs font-sans text-neutral-300 pl-1">
                  {cert.details.map((detail, idx) => (
                    <p key={idx} className="flex items-start gap-2">
                      <span className="text-neutral-500 font-bold">•</span>
                      <span>{detail}</span>
                    </p>
                  ))}
                </div>

                {/* Tags & External Credential Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {cert.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800 text-[10px] font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition-all flex items-center gap-1.5 text-xs font-mono shrink-0"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span>Official documents verified & cataloged</span>
          <button
            onClick={() => setCertificationsOpen(false)}
            className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all font-mono text-[11px]"
          >
            Close
          </button>
        </div>

      </div>

      {/* High-Res Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage}
            alt="Full resolution certificate"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
