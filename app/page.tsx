import { Badge } from "@/components/ui/badge";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { ThemeToggle } from "@/components/theme-toggle";
import { JanPronunciation } from "@/components/jan-pronunciation";
import { ProjectsExpandableList } from "@/components/projects-expandable-list";
import { RoomSection } from "@/components/room-section";
import { AboutPreview, ProjectsPreview, SkillsPreview, WorkspacePreview } from "@/components/mobile-home-previews";
import {
  AboutGlobeSection,
  type AboutGlobeEntry,
  type AboutGlobeItem,
} from "@/components/about-globe-section";
import { portfolioProjects } from "@/lib/projects";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiBrain01Icon,
  AiCloudIcon,
  AiNetworkIcon,
  BrowserIcon,
  CloudServerIcon,
  CodeIcon,
  CodeSquareIcon,
  ContainerIcon,
  CubeIcon,
  DatabaseIcon,
  DatabaseLightningIcon,
  DatabaseSearchIcon,
  FireIcon,
  FlaskConicalIcon,
  JavaIcon,
  Layers01Icon,
  Leaf01Icon,
  McpServerIcon,
  MobileProgramming01Icon,
  PuzzleIcon,
  PythonIcon,
  ReactIcon,
  ServerStack01Icon,
  VirtualRealityVrIcon,
  WorkflowSquare01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";

import { PortfolioShell } from "@/components/portfolio-shell";
import { ColumnHeading } from "@/components/column-heading";
import { ContactPhrase } from "@/components/contact-phrase";
import type { ReactNode } from "react";

const elsewhereLinks = [
  { label: "GitHub", href: "https://github.com/Janjs" },
  { label: "X", href: "https://x.com/Janjijs" },
  { label: "Email", href: "mailto:jan.jime.serra@gmail.com" },
] as const;

const aboutItems: AboutGlobeItem[] = [
  {
    id: "current-location",
    quote: "Product-minded AI engineer in Utrecht, turning enterprise problems into production systems.",
    location: [52.0907, 5.1214],
    place: "Utrecht",
    country: "Netherlands",
    flag: "🇳🇱",
  },
  {
    id: "upf",
    quote:
      "Barcelona is where I'm originally from. UPF gave me the systems foundation behind how I approach product engineering, architecture, and performance.",
    location: [41.3874, 2.1686],
    place: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
  },
  {
    id: "internship",
    quote:
      "During my internship, I integrated AI, IoT, and computer vision in the real world. I traveled to major clubs in Ibiza to install people-counting sensors, then built the full-stack app used to track how many people entered and left.",
    location: [41.3851, 2.1734],
    place: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
  },
  {
    id: "ajou",
    quote:
      "My semester at Ajou University in Suwon gave me a new academic and cultural perspective, and it is still one of the experiences that most expanded how I see the world.",
    location: [37.2636, 127.0286],
    spotlightLocation: [31, 68],
    place: "Seoul",
    country: "South Korea",
    flag: "🇰🇷",
  },
  {
    id: "trinity",
    quote:
      "Studying at Trinity pulled me deep into spatial computing and AR/VR. Learning from mentors and professors connected to industry leaders changed how I think about interaction design.",
    location: [53.3498, -6.2603],
    place: "Dublin",
    country: "Ireland",
    flag: "🇮🇪",
  },
  {
    id: "dutch-bank",
    quote:
      "The Rabobank work had me designing and building high-availability backend systems handling 1,000+ QPS across Kotlin, Java, and Azure.",
    location: [52.3676, 4.9041],
    place: "Amsterdam",
    country: "Netherlands",
    flag: "🇳🇱",
  },
  {
    id: "us-medtech",
    quote:
      "The Medtronic work centered on building AI chatbot platforms with Next.js, used by 50,000+ internal employees.",
    location: [44.3148, -85.6024],
    spotlightLocation: [44.3148, -85.6024],
    place: "Michigan",
    country: "United States",
    flag: "🇺🇸",
  },
  {
    id: "german-pharma",
    quote:
      "The Merz Pharma work focused on developing Next.js-based agentic systems with LLMs, RAG, and enterprise integrations.",
    location: [50.1109, 8.6821],
    place: "Frankfurt",
    country: "Germany",
    flag: "🇩🇪",
  },
];

const aboutEntries: AboutGlobeEntry[] = [
  {
    id: "upf",
    section: "education",
    date: "2016–2019",
    parts: [
      { text: "BSc Computer Engineering", itemId: "upf", className: "font-semibold" },
      { text: " - UPF Barcelona", itemId: "upf" },
    ],
  },
  {
    id: "ajou",
    section: "education",
    date: "2017–2017",
    parts: [
      { text: "including a semester abroad in Ajou University", itemId: "ajou" },
    ],
  },
  {
    id: "trinity",
    section: "education",
    date: "2020–2021",
    parts: [
      { text: "MSc Computer Science (AR/VR)", itemId: "trinity", className: "font-semibold" },
      { text: " - Trinity College Dublin", itemId: "trinity" },
    ],
  },
  {
    id: "internship",
    section: "experience",
    date: "2018–2019",
    parts: [
      {
        text: "AI video analytics internship: people counting systems at a local startup",
        itemId: "internship",
      },
    ],
  },
  {
    id: "consulting",
    section: "experience",
    parts: [
      { text: "Tech consulting in the Netherlands:", itemId: "current-location" },
    ],
    details: [
      {
        itemId: "german-pharma",
        role: "Senior AI Software Engineer",
        company: "Merz Pharma",
        date: "2026–Present",
      },
      { itemId: "us-medtech", role: "AI Platform Engineer", company: "Medtronic", date: "2023–2025" },
      { itemId: "dutch-bank", role: "Software Engineer", company: "Rabobank", date: "2021–2023" },
    ],
  },
];

const skills = [
  {
    category: "Languages",
    items: [
      { name: "TypeScript", icon: CodeSquareIcon },
      { name: "Python", icon: PythonIcon },
      { name: "Java", icon: JavaIcon },
      { name: "Kotlin", icon: CodeIcon },
    ],
    color: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  },
  {
    category: "Frontend & backend",
    items: [
      { name: "Next.js", icon: BrowserIcon },
      { name: "React", icon: ReactIcon },
      { name: "Node.js", icon: ServerStack01Icon },
      { name: "Spring", icon: Leaf01Icon },
      { name: "React Native", icon: MobileProgramming01Icon },
      { name: "Flask", icon: FlaskConicalIcon },
    ],
    color: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  },
  {
    category: "AI & data",
    items: [
      { name: "LLMs", icon: AiBrain01Icon },
      { name: "RAG", icon: DatabaseSearchIcon },
      { name: "MCP", icon: McpServerIcon },
      { name: "Azure OpenAI", icon: AiCloudIcon },
      { name: "AWS Bedrock", icon: Layers01Icon },
      { name: "PyTorch", icon: FireIcon },
    ],
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  },
  {
    category: "Cloud & infrastructure",
    items: [
      { name: "Azure", icon: CloudServerIcon },
      { name: "Docker", icon: ContainerIcon },
      { name: "Cosmos DB", icon: DatabaseLightningIcon },
      { name: "PostgreSQL", icon: DatabaseIcon },
      { name: "Azure DevOps", icon: WorkflowSquare01Icon },
    ],
    color: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
  {
    category: "Other",
    items: [
      { name: "Enterprise Integrations", icon: PuzzleIcon },
      { name: "3D Processing", icon: CubeIcon },
      { name: "AR/VR", icon: VirtualRealityVrIcon },
      { name: "AI Agentic Platforms", icon: AiNetworkIcon },
    ],
    color: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
  },
];

function Column({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="portfolio-column group/projects" aria-labelledby={`${id}-title`} tabIndex={0}>
      <ColumnHeading id={id} title={title} />
      <div className="column-content">{children}</div>
    </section>
  );
}

function HomeTile({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <div className={`home-tile home-tile-${id}`}>
      <a className="home-tile-link" href={`#${id}`} aria-label={`Open ${title}`}><span className="home-tile-title">{title}</span></a>
      {children}
    </div>
  );
}

function SkillsContent() {
  return <div className="space-y-4">{skills.map(({ category, items, color }) => (
    <div key={category} className="space-y-2">
      <h3 className="text-sm font-medium">{category}</h3>
      <div className="flex flex-wrap gap-1.5">{items.map(({ name, icon }) => (
        <Badge key={name} className={color}><HugeiconsIcon icon={icon} size={12} strokeWidth={2} aria-hidden="true" />{name}</Badge>
      ))}</div>
    </div>
  ))}</div>;
}

export default function Home() {
  return (
    <PortfolioShell sidebar={
      <div className="sidebar-intro" id="intro">
        <h1><a href="#intro"><EncryptedText text="Jan Serra" revealDelayMs={120} /></a><JanPronunciation showName={false} /></h1>
        <p>Software engineer with 6+ years of experience, combining artificial intelligence with the things I&apos;m into: music, sports, and 3D.</p>
        <p>Originally from Barcelona. Now in Utrecht, building AI systems.</p>
      </div>
    } footer={<ThemeToggle />}>
      <section id="home" className="mobile-home" aria-labelledby="home-title">
        <div className="mobile-home-intro">
          <h1 id="home-title" className="sr-only">Home</h1>
          <p>Software engineer with 6+ years of experience, combining artificial intelligence with the things I&apos;m into: music, sports, and 3D.</p>
        </div>
        <nav className="mobile-home-grid" aria-label="Explore the portfolio">
          <HomeTile id="about" title="About me"><AboutPreview items={aboutItems} /></HomeTile>
          <HomeTile id="projects" title="Selected projects"><ProjectsPreview projects={portfolioProjects} /></HomeTile>
          <HomeTile id="workspace" title="Workspace"><WorkspacePreview /></HomeTile>
          <HomeTile id="skills" title="Skills"><SkillsPreview /></HomeTile>
        </nav>
        <ContactPhrase className="home-contact-phrase" />
      </section>
      <Column id="about" title="About me">
        <AboutGlobeSection items={aboutItems} entries={aboutEntries} />
      </Column>
      <Column id="projects" title="Selected projects">
        <ProjectsExpandableList projects={portfolioProjects} />
      </Column>
      <Column id="workspace" title="Workspace">
        <RoomSection />
      </Column>
      <Column id="skills" title="Skills">
        <SkillsContent />
      </Column>
      <Column id="elsewhere" title="Elsewhere">
        <ul className="divide-y divide-border">
          {elsewhereLinks.map(({ label, href }) => (
            <li key={label}>
              <a href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel={href.startsWith("mailto:") ? undefined : "noreferrer"} className="flex items-center justify-between gap-4 py-5 hover:text-muted-foreground transition-colors">
                <span><span className="block text-base font-medium">{label}</span><span className="mt-1 block text-sm text-muted-foreground">{label === "Email" ? "jan.jime.serra@gmail.com" : label === "GitHub" ? "Projects and open source" : "@Janjs"}</span></span>
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </Column>
    </PortfolioShell>
  );
}
