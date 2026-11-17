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
  metadataBase: new URL("https://bratikmkj.vercel.app"),
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
    "Bratik Mukherjee Photos",
    "Bratik Mukherjee Images",
    "Bratik Mukherjee Keynote",
    "Bratik Mukherjee Speaker",
    "Bimbok Photos",
    "Bimbok Images",
    "Bimbok Face",
    "Bratik Mukherjee Face",
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
    url: "https://bratikmkj.vercel.app",
    siteName: "Bratik Mukherjee (Bimbok) Portfolio",
    images: [
      {
        url: "/images/profile/bratik-mukherjee-developer.jpg",
        width: 941,
        height: 1672,
        alt: "Bratik Mukherjee (Bimbok) - Full Stack Developer & Systems Architect",
      },
      {
        url: "/images/profile/bratik-mukherjee-bimbok-speaker.jpg",
        width: 1672,
        height: 941,
        alt: "Bratik Mukherjee (Bimbok) Keynote Speaker on Technology & Entrepreneurship",
      },
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Bratik Mukherjee (Bimbok) Portfolio Banner",
      },
      {
        url: "/images/profile/bratik-mukherjee-keynote.jpg",
        width: 1672,
        height: 941,
        alt: "Bratik Mukherjee Presenting Software Engineering Principles",
      },
      {
        url: "/images/profile/bratik-mukherjee-bimbok.jpg",
        width: 1088,
        height: 1446,
        alt: "Bratik Mukherjee (Bimbok) Portrait in West Bengal",
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
    creator: "@bimbokmkj",
    images: [
      "/images/profile/bratik-mukherjee-developer.jpg",
      "/images/profile/bratik-mukherjee-bimbok-speaker.jpg",
      "/banner.png",
    ],
  },
  alternates: {
    canonical: "https://bratikmkj.vercel.app",
  },
  verification: {
    google: "gFurputTJW0d-GTnJHv-VcLR0X_g7NSB-N2VV71rMno",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": "https://bratikmkj.vercel.app/#webpage",
        url: "https://bratikmkj.vercel.app",
        name: "Bratik Mukherjee (Bimbok) | Full Stack & Software Developer — System Architect",
        description:
          "Official portfolio of Bratik Mukherjee (Bimbok Mukherjee), Co-Founder at AlgoScope and Systems Architect based in Kolkata, India.",
        mainEntity: { "@id": "https://bratikmkj.vercel.app/#person" },
      },
      {
        "@type": "Person",
        "@id": "https://bratikmkj.vercel.app/#person",
        name: "Bratik Mukherjee",
        alternateName: ["Bimbok Mukherjee", "Bimbok", "bim_bok"],
        givenName: "Bratik",
        familyName: "Mukherjee",
        jobTitle: "Full Stack & Software Developer — System Architect",
        description:
          "Results-driven Full-Stack Developer & Systems Architect based in Kolkata, India. Co-Founder of AlgoScope, GSSoC 2026 Maintainer, AWS Hackathon Finalist.",
        url: "https://bratikmkj.vercel.app",
        image: [
          {
            "@type": "ImageObject",
            "@id": "https://bratikmkj.vercel.app/images/profile/bratik-mukherjee-developer.jpg",
            url: "https://bratikmkj.vercel.app/images/profile/bratik-mukherjee-developer.jpg",
            contentUrl: "https://bratikmkj.vercel.app/images/profile/bratik-mukherjee-developer.jpg",
            caption: "Bratik Mukherjee (Bimbok) - Full Stack Developer & Systems Architect",
            description:
              "Official portrait headshot of Bratik Mukherjee (also known as Bimbok), Software Developer and Co-Founder of AlgoScope.",
            name: "Bratik Mukherjee (Bimbok) Developer Portrait",
          },
          {
            "@type": "ImageObject",
            "@id": "https://bratikmkj.vercel.app/images/profile/bratik-mukherjee-bimbok-speaker.jpg",
            url: "https://bratikmkj.vercel.app/images/profile/bratik-mukherjee-bimbok-speaker.jpg",
            contentUrl: "https://bratikmkj.vercel.app/images/profile/bratik-mukherjee-bimbok-speaker.jpg",
            caption: "Bratik Mukherjee (Bimbok) delivering keynote speech on technology and entrepreneurship",
            description:
              "Bratik Mukherjee speaking at technical keynote event discussing engineering, systems architecture, and entrepreneurship.",
            name: "Bratik Mukherjee Keynote Speaker",
          },
          {
            "@type": "ImageObject",
            "@id": "https://bratikmkj.vercel.app/images/profile/bratik-mukherjee-keynote.jpg",
            url: "https://bratikmkj.vercel.app/images/profile/bratik-mukherjee-keynote.jpg",
            contentUrl: "https://bratikmkj.vercel.app/images/profile/bratik-mukherjee-keynote.jpg",
            caption: "Bratik Mukherjee addressing audience during university presentation",
            description:
              "Bratik Mukherjee presenting software engineering principles at university symposium at Techno Main Salt Lake.",
            name: "Bratik Mukherjee Stage Presentation",
          },
          {
            "@type": "ImageObject",
            "@id": "https://bratikmkj.vercel.app/images/profile/bratik-mukherjee-bimbok.jpg",
            url: "https://bratikmkj.vercel.app/images/profile/bratik-mukherjee-bimbok.jpg",
            contentUrl: "https://bratikmkj.vercel.app/images/profile/bratik-mukherjee-bimbok.jpg",
            caption: "Bratik Mukherjee (Bimbok) portrait in West Bengal",
            description:
              "Photo of Bratik Mukherjee, Full Stack Developer and Systems Architect based in Kolkata, India.",
            name: "Bratik Mukherjee (Bimbok) Outdoor Portrait",
          },
          {
            "@type": "ImageObject",
            "@id": "https://avatars.githubusercontent.com/u/132834022?v=4",
            url: "https://avatars.githubusercontent.com/u/132834022?v=4",
            caption: "Bratik Mukherjee GitHub Avatar (Bimbok)",
            name: "Bratik Mukherjee GitHub Avatar",
          },
        ],
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
          "https://x.com/bimbokmkj",
          "https://bsky.app/profile/bimbok.bsky.social",
          "https://www.instagram.com/bimbokmkj/",
          "https://youtube.com/@bimbokmkj",
          "https://www.reddit.com/user/bim_bok/",
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
      },
    ],
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="gFurputTJW0d-GTnJHv-VcLR0X_g7NSB-N2VV71rMno" />
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
