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
  metadataBase: new URL("https://bimbok-portfolio.vercel.app"),
  title: {
    default: "Bratik Mukherjee (Bimbok) | Full Stack & Software Developer — System Architect",
    template: "%s | Bratik Mukherjee (Bimbok)",
  },
  description:
    "Bratik Mukherjee (also known as Bimbok Mukherjee) is a Full-Stack Developer & Systems Architect based in Kolkata, India. Co-Founder of AlgoScope, GSSoC 2026 Lead Maintainer, and AWS Hackathon Top 15% Finalist. Specializing in C/C++, Next.js, React, Node.js, Go, Kotlin, Python, and PostgreSQL.",
  keywords: [
    "Bratik Mukherjee",
    "Bimbok Mukherjee",
    "Bimbok",
    "Bimbok Portfolio",
    "Bratik Mukherjee Portfolio",
    "Bratik Mukherjee Developer",
    "Bimbok Developer",
    "Full Stack Developer Kolkata",
    "Software Developer India",
    "System Architect",
    "AlgoScope Co-Founder",
    "GSSoC 2026 Maintainer",
    "AWS Hackathon Finalist",
    "Techno Main Salt Lake",
    "React.js Developer",
    "Next.js Systems Architect",
    "C++ Linux File Manager",
    "Go Bimagic CLI",
    "Kotlin Android MVVM",
    "Python ChromaDB AI",
    "PostgreSQL Database Architect",
    "Arch Linux Hyprland",
  ],
  authors: [{ name: "Bratik Mukherjee (Bimbok)", url: "https://github.com/Bimbok" }],
  creator: "Bratik Mukherjee (Bimbok)",
  publisher: "Bratik Mukherjee",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "https://avatars.githubusercontent.com/u/132834022?v=4", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "https://avatars.githubusercontent.com/u/132834022?v=4",
    apple: "https://avatars.githubusercontent.com/u/132834022?v=4",
  },
  openGraph: {
    title: "Bratik Mukherjee (Bimbok) | Full Stack & Software Developer — System Architect",
    description:
      "Official portfolio of Bratik Mukherjee (Bimbok Mukherjee). Co-Founder of AlgoScope, GSSoC 2026 Maintainer, AWS Hackathon Finalist. Systems & Web Architect specialized in Next.js, C/C++, Go, Kotlin & PostgreSQL.",
    url: "https://bimbok-portfolio.vercel.app",
    siteName: "Bratik Mukherjee (Bimbok) Portfolio",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/132834022?v=4",
        width: 460,
        height: 460,
        alt: "Bratik Mukherjee (Bimbok) Profile Picture",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bratik Mukherjee (Bimbok) | Full Stack & Software Developer — System Architect",
    description:
      "Bratik Mukherjee (Bimbok) - Full-Stack Developer & Systems Architect. Co-Founder of AlgoScope, GSSoC 2026 Lead Maintainer, AWS Hackathon Finalist.",
    creator: "@Bim__Bok",
    images: ["https://avatars.githubusercontent.com/u/132834022?v=4"],
  },
  alternates: {
    canonical: "https://bimbok-portfolio.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bratik Mukherjee",
    alternateName: ["Bimbok Mukherjee", "Bimbok"],
    givenName: "Bratik",
    familyName: "Mukherjee",
    jobTitle: "Full Stack & Software Developer — System Architect",
    url: "https://bimbok-portfolio.vercel.app",
    image: "https://avatars.githubusercontent.com/u/132834022?v=4",
    email: "bimbokmkj@gmail.com",
    telephone: "+919883593295",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kolkata",
      addressRegion: "West Bengal",
      addressCountry: "India",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Techno Main Salt Lake",
    },
    worksFor: {
      "@type": "Organization",
      name: "AlgoScope",
    },
    sameAs: [
      "https://github.com/Bimbok",
      "https://linkedin.com/in/bimbok",
      "https://x.com/Bim__Bok",
    ],
    knowsAbout: [
      "Software Development",
      "System Architecture",
      "React.js",
      "Next.js",
      "TypeScript",
      "C++",
      "Go",
      "Kotlin",
      "Python",
      "PostgreSQL",
      "Linux",
      "D3.js",
    ],
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="https://avatars.githubusercontent.com/u/132834022?v=4" />
        <link rel="apple-touch-icon" href="https://avatars.githubusercontent.com/u/132834022?v=4" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
