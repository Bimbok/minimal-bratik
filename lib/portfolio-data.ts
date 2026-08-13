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
  status: "Live" | "Active" | "Building";
  githubUrl: string;
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
    discordUserId: "1059779383617306634",
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
          name: "Go",
          level: 92,
          experience: "4 Yrs",
          description: "Concurrent microservices, CLI tools (Bimagic), 300% execution speedup.",
          tags: ["Goroutines", "gRPC", "Gin", "Bubbletea"],
        },
        {
          name: "Kotlin",
          level: 88,
          experience: "3 Yrs",
          description: "Native Android development, MVVM architecture, Room Database (SQLite), P2P sharing.",
          tags: ["Android", "MVVM", "Room SQLite", "FCM"],
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
          name: "Tailwind CSS & D3.js",
          level: 98,
          experience: "4 Yrs",
          description: "Interactive algorithm execution visualizations (AlgoScope) and custom design systems.",
          tags: ["D3.js", "PostCSS", "Design Tokens", "Responsive"],
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
          name: "Arch Linux & Hyprland",
          level: 94,
          experience: "5 Yrs",
          description: "Custom Wayland environment, dotfiles management, pipewire audio, and pacman hook automation.",
          tags: ["Wayland", "Systemd", "Kernel", "Dotfiles"],
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
  ] as Project[],

  resumeText: `===================================================================
BRATIK MUKHERJEE - FULL STACK & SOFTWARE DEVELOPER — SYSTEM ARCHITECT
Email: bimbokmkj@gmail.com | Phone: +91 9883593295 | West Bengal, India
GitHub: github.com/Bimbok | LinkedIn: linkedin.com/in/bimbok
===================================================================`,
};
