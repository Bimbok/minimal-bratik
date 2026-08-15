export interface Project {
  id: string;
  title: string;
  repoPath: string;
  tagline: string;
  description: string;
  imagePath?: string;
  architecture: string[];
  tech: string[];
  techIcons?: string[];
  logoUrl?: string;
  status: "Live" | "Active" | "Building";
  githubUrl: string;
  secondaryGithubUrl?: string;
  secondaryRepoLabel?: string;
  docsUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface ExperienceItem {
  id: string;
  title: string;
  role: string;
  company: string;
  dates: string;
  location: string;
  description: string[];
  tech: string[];
  logoUrl: string;
  type?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  imagePath: string;
  details: string[];
  tags: string[];
}

export interface SkillCategory {
  category: "Languages" | "Frameworks" | "Tools & Linux";
  icon: string;
  skills: {
    name: string;
    level: number;
    experience: string;
    description: string;
    tags: string[];
    featuredCommand?: string;
  }[];
}

export interface SystemSpecs {
  user: string;
  hostname: string;
  os: string;
  host: string;
  kernel: string;
  uptime: string;
  packages: string;
  shell: string;
  wm: string;
  terminal: string;
  cpu: string;
  memory: string;
}

export const PORTFOLIO_DATA = {
  profile: {
    name: "Bratik Mukherjee",
    handle: "bimbok",
    role: "Full Stack & Software Developer — System Architect",
    badge: "Active | Building Scalable Web Platforms, Mobile Apps & Systems",
    headline: "Results-driven Full-Stack and Systems Architect. I build scalable web platforms, CLI tools, and native mobile apps.",
    bioBullets: [
      "B.Tech in IT at Techno Main Salt Lake (Avg. CGPA: 8.046/10.0).",
      "Co-Founder & Developer at AlgoScope, GSSoC 2026 Project Admin & AWS Hackathon Top 15% Finalist.",
      "Proficient in C/C++, React.js, Node.js, Go, Kotlin, Python, and PostgreSQL.",
    ],
    bio: "Passionate about system-level programming, database optimization, and high-performance developer tooling.",
    location: "West Bengal, India",
    sshCommand: "ssh connect@bimbok.dev",
    gpgFingerprint: "2B4F 89A1 990C E1E4 F7A9 8B90 4F2E 119A C401 773B",
    calUrl: "https://cal.com/bimbok",
    discordUserId: "1282246489430818827",
    discordUsername: "bimbokmkj",
    socials: {
      github: "https://github.com/Bimbok",
      linkedin: "https://linkedin.com/in/bimbok",
      twitter: "https://x.com/Bim__Bok",
      email: "bimbokmkj@gmail.com",
      phone: "+91 9883593295",
    },
    stats: [
      { label: "CGPA", value: "8.05 / 10" },
      { label: "Git Commits", value: "2,090+" },
      { label: "Global PRs Reviewed", value: "50+" },
      { label: "Forks Managed", value: "144+" },
    ],
  },

  experiences: [
    {
      id: "algoscope-exp",
      title: "AlgoScope",
      role: "Co-Founder & Full-Stack Developer",
      company: "AlgoScope HQ / Open Source",
      dates: "Oct 2025 – Present",
      location: "West Bengal, India",
      type: "Co-Founder",
      logoUrl: "https://avatars.githubusercontent.com/u/226963205?v=4",
      description: [
        "Programmed an interactive educational platform supporting 12+ searching and sorting algorithms, including Merge Sort, Quick Sort, BFS, and DFS.",
        "Engineered interactive graph visualizations using D3.js to display complex algorithmic execution pathways, improving user engagement time by 30%.",
        "Modeled relational database schema in PostgreSQL for efficient data queries and storage.",
      ],
      tech: ["React.js", "D3.js", "PostgreSQL", "JavaScript", "Tailwind CSS"],
    },
    {
      id: "gssoc-exp",
      title: "GirlScript Summer of Code 2026",
      role: "Project Admin & Lead Maintainer",
      company: "GirlScript / AlgoScope",
      dates: "2026 – Present",
      location: "Remote",
      type: "GSSoC 2026",
      logoUrl: "https://avatars.githubusercontent.com/u/39153675?v=4",
      description: [
        "Managed 98+ global contributors, 50+ streamlining Pull Request (PR) reviews, with 46+ stars issue triaging.",
        "Configured GitHub Actions CI/CD pipelines to scale the open-source repository to 144+ forks.",
      ],
      tech: ["Git", "GitHub Actions", "Open Source", "CI/CD"],
    },
    {
      id: "aws-hackathon-exp",
      title: "AI for Bharat Hackathon By AWS",
      role: "Team Lead (Team Zero Se Restart)",
      company: "creAItr / AWS",
      dates: "Oct 2025 – Present",
      location: "India",
      type: "AWS Top 15%",
      logoUrl: "https://avatars.githubusercontent.com/u/2232217?v=4",
      description: [
        "Spearheaded the creation of CreAItr, an AI-driven platform facilitating content generation and workflow automation for 100+ simulated users.",
        "Deployed full-stack application and advanced to Round 2, placing in top 15% among 500+ competing teams.",
      ],
      tech: ["Python", "Flask", "LLM", "ChromaDB", "AI"],
    },
    {
      id: "systems-dev-exp",
      title: "Systems Architect & Native App Developer",
      role: "Core Systems Developer",
      company: "Fyzenor, bDoci & Bimagic",
      dates: "2024 – 2026",
      location: "West Bengal, India",
      type: "Systems",
      logoUrl: "https://avatars.githubusercontent.com/u/132834022?v=4",
      description: [
        "Developed high-performance terminal file manager (Fyzenor) leveraging C++ and system-level APIs to handle 10,000+ files seamlessly with 40% latency reduction.",
        "Architected offline Kotlin/MVVM knowledge base application (bDoci) with Room SQLite & Base64 P2P data sharing.",
        "Migrated Bash-based automation tool to Go (Bimagic), accelerating script execution speed by over 300% across multiple OS environments.",
      ],
      tech: ["C++", "Kotlin", "Go", "SQLite", "Android MVVM"],
    },
  ] as ExperienceItem[],

  certifications: [
    {
      id: "sih-2025",
      title: "Smart India Hackathon '25 — Certificate of Participation",
      issuer: "Ministry of Education (MoE's Innovation Cell, Govt of India) & AICTE",
      date: "September 13, 2025",
      imagePath: "/certificates/sih_2025_certificate.png",
      details: [
        "Participated in Internal Hackathon'25 organized by Techno Main Salt Lake under MoE Innovation Cell & AICTE guidelines.",
        "Built and presented innovative technical project prototype evaluated by academic and industry judges.",
      ],
      tags: ["Hackathon", "MoE Innovation Cell", "AICTE", "System Architecture"],
    },
    {
      id: "udemy-datascience-2025",
      title: "Data Science Mastery 2025: Excel, Python & Tableau",
      issuer: "Udemy / Meritshot Academy",
      date: "April 1, 2025",
      credentialId: "UC-ab4602b8-67b1-4f5b-abad-9a2d261f17ae",
      credentialUrl: "https://ude.my/UC-ab4602b8-67b1-4f5b-abad-9a2d261f17ae",
      imagePath: "/certificates/udemy_datascience_certificate.png",
      details: [
        "Completed 21.5 hours of comprehensive coursework covering Python data analysis, Tableau visualization, and advanced statistics.",
        "Mastered hands-on data cleaning, regression models, exploratory data analysis (EDA), and interactive dashboards.",
      ],
      tags: ["Python", "Data Science", "Tableau", "Excel", "Statistics"],
    },
  ] as CertificationItem[],

  systemSpecs: {
    user: "bratik",
    hostname: "hyprland-workstation",
    os: "Arch Linux x86_64",
    host: "ThinkPad X1 Carbon Gen 11",
    kernel: "Linux 6.12.8-arch1-1",
    uptime: "14 days, 6 hours, 42 mins",
    packages: "1420 (pacman), 18 (flatpak)",
    shell: "zsh 5.9 (x86_64-pc-linux-gnu)",
    wm: "Hyprland (Wayland)",
    terminal: "kitty / tmux 3.4",
    cpu: "13th Gen Intel i7-1370P (20) @ 5.200GHz",
    memory: "24.8GiB / 31.7GiB",
  } as SystemSpecs,

  skills: [
    {
      category: "Languages",
      icon: "Code2",
      skills: [
        {
          name: "TypeScript",
          level: 98,
          experience: "6 Yrs",
          description: "Strict typing, AST transformations, complex generics, and full-stack API contracts.",
          tags: ["Node.js", "React", "Next.js", "Compiler API"],
        },
        {
          name: "C++",
          level: 90,
          experience: "5 Yrs",
          description: "Modern C/C++, RAII, TUI ncurses interfaces, and file system primitives handling 10,000+ files.",
          tags: ["C++17", "CMake", "GDB", "Ncurses"],
        },
        {
          name: "C",
          level: 92,
          experience: "5 Yrs",
          description: "Systems programming, POSIX process management, custom shells (MyShell), IPC pipelines & AST parsers.",
          tags: ["POSIX", "fork/exec", "Signals", "Memory"],
        },
        {
          name: "Go",
          level: 92,
          experience: "4 Yrs",
          description: "Concurrent microservices, CLI tools (Bimagic), multi-threading, and sub-second execution speeds.",
          tags: ["Goroutines", "Channels", "CLI", "Cross-Platform"],
        },
        {
          name: "Kotlin",
          level: 88,
          experience: "3 Yrs",
          description: "Native Android development, MVVM architecture, Room Database (SQLite), ViewBinding, and offline sync.",
          tags: ["Android Studio", "MVVM", "Room SQLite", "Material"],
        },
        {
          name: "Java",
          level: 86,
          experience: "4 Yrs",
          description: "Custom interpreted language design (Sizuka), lexer tokenizers, AST evaluators, and interactive REPLs.",
          tags: ["Compiler Design", "AST", "REPL", "OOP"],
        },
        {
          name: "Python",
          level: 90,
          experience: "6 Yrs",
          description: "Data pipelines, AsyncIO, Flask backend, LLM integration, and ChromaDB vector search.",
          tags: ["Flask", "LLM", "ChromaDB", "PyTorch"],
        },
      ],
    },
    {
      category: "Frameworks",
      icon: "Layers",
      skills: [
        {
          name: "Next.js & React 19",
          level: 96,
          experience: "5 Yrs",
          description: "App Router, Server Actions, RSC, Streaming SSR, and optimized client hydration.",
          tags: ["App Router", "RSC", "Turbopack", "Hydration"],
        },
        {
          name: "Node.js & Express",
          level: 95,
          experience: "7 Yrs",
          description: "Event loop tuning, worker threads, stream pipelines, and custom HTTP middleware.",
          tags: ["Event Loop", "Streams", "V8", "REST"],
        },
        {
          name: "MongoDB & PostgreSQL",
          level: 92,
          experience: "4 Yrs",
          description: "Atlas clusters, dynamic document modeling (bDoci), relational schema indexing & aggregation pipelines.",
          tags: ["MongoDB", "PostgreSQL", "Mongoose", "Indexing"],
        },
        {
          name: "Tailwind CSS & D3.js",
          level: 98,
          experience: "4 Yrs",
          description: "Interactive algorithm execution visualizations (AlgoScope) and custom design systems.",
          tags: ["D3.js", "PostCSS", "Design Tokens", "Responsive"],
        },
        {
          name: "Framer Motion & Three.js",
          level: 90,
          experience: "4 Yrs",
          description: "Interactive 3D WebGL scenes (Ping), fluid spring physics transitions (Softy), and micro-interactions.",
          tags: ["Three.js", "Framer Motion", "WebGL", "Anime.js"],
        },
      ],
    },
    {
      category: "Tools & Linux",
      icon: "Terminal",
      skills: [
        {
          name: "Neovim & Lua",
          level: 96,
          experience: "6 Yrs",
          description: "Custom keymaps, Lazy.nvim setup, LSP client configuration, and Tree-sitter parsers.",
          tags: ["Lua", "LSP", "Treesitter", "Telescope"],
        },
        {
          name: "Obsidian & PKM",
          level: 95,
          experience: "4 Yrs",
          description: "Personal Knowledge Management, Zettelkasten note-taking, markdown linking & graph view.",
          tags: ["Obsidian", "Markdown", "Zettelkasten", "PKM"],
        },
        {
          name: "Arch Linux & Hyprland",
          level: 94,
          experience: "5 Yrs",
          description: "Custom Wayland environment, dotfiles management, pipewire audio, and pacman hook automation.",
          tags: ["Wayland", "Systemd", "Kernel", "Dotfiles"],
        },
        {
          name: "Git & GitHub Automation",
          level: 95,
          experience: "6 Yrs",
          description: "Advanced Git workflows, multi-threaded CLI automation (Bimagic), interactive rebasing & OSS admin.",
          tags: ["Git", "GitHub Actions", "CI/CD", "OSS Admin"],
        },
        {
          name: "CMake & Linux Toolchains",
          level: 90,
          experience: "5 Yrs",
          description: "C/C++ compilation pipelines (Fyzenor, MyShell), GDB debugging, Makefiles, and POSIX system calls.",
          tags: ["CMake", "GDB", "Clang", "Toolchains"],
        },
        {
          name: "Docker & Kubernetes",
          level: 88,
          experience: "4 Yrs",
          description: "Multi-stage Alpine builds, docker-compose setups, K8s manifests, and Helm charts.",
          tags: ["Containers", "Helm", "K3s", "OCI"],
        },
      ],
    },
  ] as SkillCategory[],

  projects: [
    {
      id: "fyzenor",
      title: "Fyzenor",
      repoPath: "Bimbok/fyzenor",
      tagline: "C++ Based Filemanager for Linux handling 10,000+ files seamlessly",
      description: "Developed a high-performance terminal file manager leveraging C++ and system-level APIs to handle 10,000+ files seamlessly with 40% reduced rendering latency.",
      imagePath: "/projects/fyzenor.png",
      logoUrl: "/fyzenor.png",
      architecture: [
        "Modern C++17 filesystem library integration",
        "Asynchronous multi-pane ncurses TUI event loop",
        "Sub-millisecond file tree traversal & preview rendering",
        "Customizable color themes and vim motion keybindings",
      ],
      tech: ["C++", "C++17", "TUI", "Ncurses", "CMake"],
      techIcons: ["cpp", "linux"],
      status: "Live",
      githubUrl: "https://github.com/Bimbok/fyzenor",
      liveUrl: "https://fyzenor.vercel.app",
      featured: true,
    },
    {
      id: "algoscope",
      title: "AlgoScope",
      repoPath: "algoscope-hq/AlgoScope",
      tagline: "Algorithms, made visible — 12+ searching & sorting algorithm visualizer",
      description: "Co-founded interactive educational platform supporting 12+ algorithms, D3.js execution graph pathways (+30% engagement), and PostgreSQL schema.",
      imagePath: "/projects/algoscope.png",
      logoUrl: "https://avatars.githubusercontent.com/u/226963205?v=4",
      architecture: [
        "React state-driven canvas & D3.js execution graph rendering pipeline",
        "Custom algorithm step generator with pause/resume execution",
        "98+ global contributors, 50+ PR reviews, 144+ GitHub forks",
        "PostgreSQL relational database schema modeling",
      ],
      tech: ["JavaScript", "React", "D3.js", "PostgreSQL", "Tailwind CSS"],
      techIcons: ["js", "react", "tailwind"],
      status: "Live",
      githubUrl: "https://github.com/algoscope-hq/AlgoScope",
      liveUrl: "https://algo-scope-virid.vercel.app",
      featured: true,
    },
    {
      id: "sizuka",
      title: "Sizuka",
      repoPath: "Bimbok/sizuka",
      tagline: "A custom programming language built in Java with unique syntax & REPL",
      description: "A custom interpreted programming language built in Java featuring custom lexer, AST evaluator, dynamic typing, and interactive terminal REPL.",
      architecture: [
        "Hand-written Lexer tokenizer and Abstract Syntax Tree (AST) generator",
        "Scoped symbol table environment for variable binding & closure resolution",
        "Interactive REPL with syntax error diagnostics",
      ],
      tech: ["Java", "Compiler", "Interpreter", "AST", "REPL"],
      techIcons: ["java"],
      status: "Active",
      githubUrl: "https://github.com/Bimbok/sizuka",
      featured: true,
    },
    {
      id: "creaitr",
      title: "creAItr.",
      repoPath: "aasaan-hainn/creAItr.",
      tagline: "AWS Hackathon Top 15% Finalist — AI platform for digital creators & educators",
      description: "AI-driven platform facilitating content generation and workflow automation for 100+ simulated users, placing in top 15% among 500+ teams in AWS Hackathon.",
      imagePath: "/projects/creaitr.png",
      logoUrl: "/creAItr.png",
      architecture: [
        "Flask & Python backend with LLM API orchestration",
        "ChromaDB vector database integration for semantic retrieval",
        "Next-gen creator suite with intelligent content analytics",
      ],
      tech: ["Python", "Flask", "LLM", "ChromaDB", "JavaScript", "AI"],
      techIcons: ["py", "js"],
      status: "Live",
      githubUrl: "https://github.com/aasaan-hainn/creAItr.",
      liveUrl: "https://creaitr.arghyadevs.me",
      featured: true,
    },
    {
      id: "bimagic",
      title: "Bimagic",
      repoPath: "bimagic/bimagic-go",
      tagline: "Go-powered Git automation CLI wizard, Shell engine & interactive docs suite",
      description: "High-performance Git workflow automation CLI tool. Rebuilt in Go for sub-second execution with cross-platform binary distributions, complemented by the original POSIX Shell implementation and dedicated Docusaurus technical documentation portal.",
      imagePath: "/projects/bimagic.png",
      logoUrl: "https://avatars.githubusercontent.com/u/283110310?v=4",
      architecture: [
        "Multi-threaded Go architecture with sub-millisecond Git operation dispatch",
        "Interactive keyboard-driven CLI menu system with ANSI color formatting",
        "Dual engine: Go binary for cross-platform performance & fallback POSIX Shell script",
        "Comprehensive Docusaurus v3 documentation hub deployed on Vercel",
      ],
      tech: ["Go", "Bash", "Shell", "Git", "Docusaurus", "CLI"],
      techIcons: ["go", "bash", "git"],
      status: "Live",
      githubUrl: "https://github.com/bimagic/bimagic-go",
      secondaryGithubUrl: "https://github.com/bimagic/bimagic",
      secondaryRepoLabel: "Shell Version",
      docsUrl: "https://bimagic.vercel.app",
      liveUrl: "https://bimagic.vercel.app",
      featured: false,
    },
    {
      id: "bdoci",
      title: "bDoci (App & Hub)",
      repoPath: "Bimbok/bDoci-app",
      tagline: "Native Android documentation app in Kotlin + dynamic MongoDB web portal",
      description: "A complete developer documentation ecosystem featuring a native Android Kotlin application with offline SQLite caching, ViewBinding, and dynamic Markdown rendering, integrated with a MongoDB-powered documentation web portal.",
      imagePath: "/projects/bdoci.jpg",
      logoUrl: "https://raw.githubusercontent.com/Bimbok/bDoci-app/master/app/src/main/res/drawable/logo.png",
      architecture: [
        "Native Android client built with Kotlin, ViewBinding, and Material Components",
        "Offline-first document caching with local persistence and background sync",
        "Full-stack Express.js REST API & MongoDB Atlas database cluster",
        "Dynamic full-text search, code syntax highlighting, and dual-theme web UI",
      ],
      tech: ["Kotlin", "Android", "MongoDB", "Express.js", "Node.js", "REST API"],
      techIcons: ["kotlin", "androidstudio", "nodejs", "mongodb"],
      status: "Live",
      githubUrl: "https://github.com/Bimbok/bDoci-app",
      secondaryGithubUrl: "https://github.com/Bimbok/documentationHub",
      secondaryRepoLabel: "Web Hub Repo",
      liveUrl: "https://bimbokdocs.vercel.app",
      featured: false,
    },
    {
      id: "myshell",
      title: "MyShell",
      repoPath: "Bimbok/myshell",
      tagline: "Feature-rich Unix CLI interpreter in C with Tab completion & arithmetic evaluator",
      description: "Custom Unix-like command-line interpreter written in C. Features complete process control (fork/execvp), multi-stage piping, I/O redirection, signal trapping, history navigation, Tab autocompletion, and an integrated recursive-descent math evaluator.",
      imagePath: "/projects/myshell.png",
      logoUrl: "https://skillicons.dev/icons?i=c&theme=dark",
      architecture: [
        "POSIX process lifecycle management via fork(), execvp(), and waitpid()",
        "Multi-stage command pipeline and non-blocking I/O redirection (<, >, >>)",
        "Custom Tab autocompletion engine scanning system PATH and directory binaries",
        "Built-in recursive descent arithmetic evaluator parsing mathematical expressions directly",
      ],
      tech: ["C", "Unix", "POSIX", "Linux", "Systems", "CLI"],
      techIcons: ["c", "linux"],
      status: "Active",
      githubUrl: "https://github.com/Bimbok/myshell",
      featured: false,
    },
    {
      id: "ping",
      title: "Ping",
      repoPath: "aasaan-hainn/Ping",
      tagline: "Real-time communication and networking platform for gamers & developers",
      description: "A high-concurrency real-time messaging and social network for gamers and developers, featuring instant WebSockets messaging, 3D interactive graphics with Three.js, and MongoDB persistence.",
      imagePath: "/projects/ping.png",
      logoUrl: "/ping-logo.png",
      architecture: [
        "Full-duplex WebSocket communication pipeline powered by Socket.IO",
        "React 18 & Vite SPA architecture with Tailwind CSS and Material UI",
        "Interactive Three.js 3D canvas backgrounds and Anime.js micro-animations",
        "Scalable Express.js backend with MongoDB cluster for chat threads and user profiles",
      ],
      tech: ["React", "Socket.IO", "Node.js", "Express", "MongoDB", "Three.js"],
      techIcons: ["react", "nodejs", "mongodb", "tailwind"],
      status: "Live",
      githubUrl: "https://github.com/aasaan-hainn/Ping",
      liveUrl: "https://ping-murex.vercel.app",
      featured: false,
    },
    {
      id: "avis",
      title: "AVIS",
      repoPath: "kodo-kaze/avis",
      tagline: "AI-driven stakeholder insight and telemetry intelligence platform",
      description: "High-performance intelligence workspace for analyzing customer, investor, and team feedback with real-time sentiment scoring, thematic cluster modeling, and glassmorphic telemetry dashboards.",
      imagePath: "/projects/avis.png",
      logoUrl: "https://raw.githubusercontent.com/kodo-kaze/avis/main/public/logo.png",
      architecture: [
        "Synapse-AI intelligence engine for automated sentiment analysis and thematic categorization",
        "Next.js and TypeScript modular full-stack architecture with server actions",
        "Obsidian glassmorphic interface with reactive telemetry chart visualizations",
        "Automated stakeholder reporting pipeline with real-time export capabilities",
      ],
      tech: ["TypeScript", "Next.js", "React", "AI", "Tailwind CSS", "Analytics"],
      techIcons: ["ts", "nextjs", "react", "tailwind"],
      status: "Live",
      githubUrl: "https://github.com/kodo-kaze/avis",
      liveUrl: "https://avis-hq.vercel.app",
      featured: false,
    },
    {
      id: "softy",
      title: "Softy",
      repoPath: "Bimbok/Softy",
      tagline: "Glassmorphic knowledge exploration platform with Markdown, LaTeX & admin suite",
      description: "A modern, visually stunning web application for sharing and exploring topics, fun facts, and technical articles. Built with Next.js 15, featuring glassmorphism UI, full-screen video backdrops, Markdown & KaTeX LaTeX mathematical rendering, and a secure MongoDB Atlas admin dashboard.",
      imagePath: "/projects/softy.png",
      logoUrl: "/softy.svg",
      architecture: [
        "Next.js 15 App Router architecture with React 19 and Framer Motion micro-animations",
        "Mathematical equation rendering engine powered by KaTeX and Markdown AST parsing",
        "Secure password-protected admin dashboard with real-time topic publication workflows",
        "MongoDB Atlas database cluster modeling articles, collections, and metadata",
      ],
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "MongoDB", "KaTeX"],
      techIcons: ["nextjs", "react", "ts", "tailwind", "mongodb"],
      status: "Live",
      githubUrl: "https://github.com/Bimbok/Softy",
      featured: false,
    },
  ] as Project[],

  resumeDriveFiles: [
    {
      id: "1PRPbcnMlDVuROMaDTuqLgVOV4BhmcFHr",
      name: "v5.3 - Fullstack Engineer (Personal)",
      tag: "v5 Fullstack",
      fileTitle: "Bratik_Mukherjee_v5_fullstack_personal.pdf",
    },
    {
      id: "1Ur9MzIff8CflELUV0Vy0ZTIO7FSawNLn",
      name: "v5.2 - Backend Engineer (Personal)",
      tag: "v5 Backend",
      fileTitle: "Bratik_Mukherjee_v5_Backend_Engineer_personal.pdf",
    },
    {
      id: "1NuNE2-qYO0rwXC5zgtahv0SP3L85D50n",
      name: "v5.1 - Frontend Engineer (Personal)",
      tag: "v5 Frontend",
      fileTitle: "Bratik_Mukherjee_v5_frontend_personal.pdf",
    },
    {
      id: "1erKJpKa-twmge63KqwkNIBwbN0qlSrim",
      name: "v5.0 - Data Engineer (Personal)",
      tag: "v5 Data Eng",
      fileTitle: "Bratik_Mukherjee_v5_Data_Engineer_personal.pdf",
    },
    {
      id: "1j3Yr6qxC0tgUjH_ic-MgjUki9AhbvN7-",
      name: "v5.0 - Gameberry Systems (Personal)",
      tag: "v5 Gameberry",
      fileTitle: "Bratik_Mukherjee_v5_Gameberry_personal.pdf",
    },
    {
      id: "1JLD6NOms2y1yPMhHHUrwDBr-LVv5C7Ik",
      name: "v5.0 - Visual Photo Resume (Personal)",
      tag: "v5 Visual",
      fileTitle: "Bratik_Mukherjee_v5_image_personal.pdf",
    },
    {
      id: "1mt_w8KPAfe0l-kb7r8Y7_9LM3hSJotkx",
      name: "v5.0 - College Edition (Photo)",
      tag: "v5 College",
      fileTitle: "Bratik_Mukherjee_v5_image_college.pdf",
    },
    {
      id: "1Gf_oaCumZybqLcL5DHJ-a_pp5Rqo18_V",
      name: "v4.0 - College Data Analytics",
      tag: "v4 Data Analytics",
      fileTitle: "Bratik_Mukherjee_v4_college_data_analytics.pdf",
    },
    {
      id: "1c72XvepCBUx9ePhSgM-NaFPiMm4Zttb-",
      name: "v4.0 - Personal Data Analytics",
      tag: "v4 Personal",
      fileTitle: "Bratik_Mukherjee_v4_persoal_data_analytics.pdf",
    },
    {
      id: "1DfTXgHDBPaRnmmI_rlb4_HvdEgOP3-jl",
      name: "v3.0 - Personal Systems",
      tag: "v3 Personal",
      fileTitle: "Bratik_Mukherjee_v3_personal.pdf",
    },
    {
      id: "1sh9cEbkFnVL0y7kSULVPK4zTKRDAiQJZ",
      name: "v3.0 - College Academic",
      tag: "v3 College",
      fileTitle: "Bratik_Mukherjee_v3_college.pdf",
    },
    {
      id: "1EwrnMX9RF1UCO5V8nXv549N5ko9vydpn",
      name: "v2.0 - Core Fullstack",
      tag: "v2 Legacy",
      fileTitle: "Bratik_Mukherjee_v2.pdf",
    },
    {
      id: "1OLjiuT5jBTkM8xo6AgmVYnIIGlbTfaf4",
      name: "v1.0 - Foundation Resume",
      tag: "v1 Initial",
      fileTitle: "Bratik_Mukherjee_v1_image.pdf",
    },
  ],

  resumeText: `===================================================================
BRATIK MUKHERJEE - FULL STACK & SOFTWARE DEVELOPER — SYSTEM ARCHITECT
Email: bimbokmkj@gmail.com | Phone: +91 9883593295 | West Bengal, India
GitHub: github.com/Bimbok | LinkedIn: linkedin.com/in/bimbok
===================================================================`,
};

