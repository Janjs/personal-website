export const profile = {
  name: "Jan J. Serra",
  handle: "jan",
  role: "Software engineer",
  location: "Utrecht, Netherlands",
  origin: "Barcelona",
  summary:
    "Software engineer with 6+ years of experience, combining artificial intelligence with music, sports, cinema, and 3D. Originally from Barcelona. Now in Utrecht, building AI systems.",
};

export const experience = [
  {
    role: "Software Engineering Associate Manager",
    company: "Accenture",
    dates: "December 2025 – Present",
    place: "Utrecht, Netherlands",
    summary:
      "Leading the architecture and delivery of production AI platforms, while working directly with clients to identify and implement automation opportunities.",
  },
  {
    role: "Senior AI Software Engineer",
    company: "Merz Pharma",
    dates: "2026–Present",
    place: "Frankfurt, Germany",
    summary: "Developing Next.js-based agentic systems with LLMs, RAG, and enterprise integrations.",
  },
  {
    role: "AI Platform Engineer",
    company: "Medtronic",
    dates: "2023–2025",
    place: "Michigan, United States",
    summary: "Building AI chatbot platforms with Next.js, used by 50,000+ internal employees.",
  },
  {
    role: "Software Engineer",
    company: "Rabobank",
    dates: "2021–2023",
    place: "Amsterdam, Netherlands",
    summary: "Designing and building high-availability backend systems handling 1,000+ QPS across Kotlin, Java, and Azure.",
  },
  {
    role: "AI video analytics intern",
    company: "Local startup",
    dates: "2018–2019",
    place: "Barcelona, Spain",
    summary: "Integrated AI, IoT, and computer vision, including people-counting systems used in the real world.",
  },
] as const;

export const skillGroups = [
  { category: "Languages", items: ["TypeScript", "Python", "Java", "Kotlin"] },
  { category: "Frontend & backend", items: ["Next.js", "React", "Node.js", "Spring", "React Native", "Flask"] },
  { category: "AI & data", items: ["LLMs", "RAG", "MCP", "Azure OpenAI", "AWS Bedrock", "PyTorch"] },
  { category: "Cloud & infrastructure", items: ["Azure", "Docker", "Cosmos DB", "PostgreSQL", "Azure DevOps"] },
  { category: "Other", items: ["Enterprise Integrations", "3D Processing", "AR/VR", "AI Agentic Platforms"] },
] as const;

export const contactLinks = [
  { label: "GitHub", href: "https://github.com/Janjs" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/janjimenezserra/" },
  { label: "X", href: "https://x.com/Janjijs" },
  { label: "Email", href: "mailto:jan.jime.serra@gmail.com", display: "jan.jime.serra@gmail.com" },
] as const;
