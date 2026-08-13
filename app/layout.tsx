import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../lib/theme-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bimbok Mukherjee | Senior Full-Stack & Systems Architect",
  description: "Interactive minimalist developer portfolio site featuring Neovim keybindings, retro CRT phosphor terminal themes, and high-performance WebAssembly systems.",
  keywords: ["Full-Stack Engineer", "Rust", "Next.js", "TypeScript", "Neovim", "Arch Linux", "Systems Architecture"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
