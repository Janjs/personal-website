import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { Highlighter } from "@/components/ui/highlighter";
import { ThemeToggle } from "@/components/theme-toggle";
import { SectionNavigation } from "@/components/section-navigation";
import { JanPronunciation } from "@/components/jan-pronunciation";
import { ProjectsExpandableList } from "@/components/projects-expandable-list";
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
} from "@hugeicons/core-free-icons";

const aboutItems: AboutGlobeItem[] = [
  {
    id: "current-location",
    quote: "Currently based in Utrecht, the Netherlands, working in AI consultancy.",
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
      "The Dutch bank work had me designing and building high-availability backend systems handling 1,000+ QPS across Kotlin, Java, and Azure.",
    location: [52.3676, 4.9041],
    place: "Amsterdam",
    country: "Netherlands",
    flag: "🇳🇱",
  },
  {
    id: "us-medtech",
    quote:
      "The Michigan medtech work centered on building AI chatbot platforms with Next.js, used by 50,000+ internal employees.",
    location: [44.3148, -85.6024],
    spotlightLocation: [44.3148, -85.6024],
    place: "Michigan",
    country: "United States",
    flag: "🇺🇸",
  },
  {
    id: "german-pharma",
    quote:
      "The German pharma work focused on developing Next.js-based agentic systems with LLMs, RAG, and enterprise integrations.",
    location: [50.1109, 8.6821],
    place: "Frankfurt",
    country: "Germany",
    flag: "🇩🇪",
  },
];

const aboutEntries: AboutGlobeEntry[] = [
  {
    id: "upf",
    parts: [
      { text: "BSc Computer Engineering - ", itemId: "upf" },
      { text: "UPF Barcelona,", itemId: "upf", className: "font-semibold" },
      { text: " including a semester at ", itemId: "ajou" },
      { text: "Ajou University", itemId: "ajou", className: "font-semibold" },
    ],
  },
  {
    id: "internship",
    parts: [
      {
        text: "AI video analytics internship: people counting systems at local startup",
        itemId: "internship",
      },
    ],
  },
  {
    id: "trinity",
    parts: [
      { text: "MSc Computer Science (AR/VR) - ", itemId: "trinity" },
      {
        text: "Trinity College Dublin",
        itemId: "trinity",
        className: "font-semibold",
      },
    ],
  },
  {
    id: "consulting",
    parts: [
      { text: "5+ years consulting building ", itemId: "dutch-bank" },
      { text: "AI web apps", itemId: "dutch-bank", className: "font-semibold" },
      { text: " at ", itemId: "dutch-bank" },
      { text: "Dutch Bank,", itemId: "dutch-bank", className: "font-semibold" },
      { text: " " },
      { text: "US Medtech", itemId: "us-medtech", className: "font-semibold" },
      { text: ", and " },
      { text: "German Pharma", itemId: "german-pharma", className: "font-semibold" },
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

export default function Home() {
  const projects = portfolioProjects;

  return (
    <>
      <div className="fixed top-4 right-[calc(1rem-var(--scrollbar-compensation,0px))] z-50 sm:top-6 sm:right-[calc(1.5rem-var(--scrollbar-compensation,0px))]">
        <ThemeToggle />
      </div>
      <SectionNavigation />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 sm:px-8 sm:py-14">
        <section id="intro" className="max-w-2xl scroll-mt-10 space-y-3">
          <p className="text-xl leading-tight sm:text-2xl">
            <span className="inline-flex items-center gap-2">
              <EncryptedText text="Hi, I'm Jan." revealDelayMs={120} />
              <JanPronunciation showName={false} />
            </span>
          </p>
          <p className="pr-16 text-xl leading-tight sm:pr-0 sm:text-2xl">
            Software engineer building{" "}
            <Highlighter action="underline" color="#9fc5ff">
              artificial intelligence
            </Highlighter>{" "}
            and{" "}
            <Highlighter action="underline" color="#a7f3d0">
              spacial computing
            </Highlighter>{" "}
            experiences.
          </p>
        </section>

        <Separator className="my-9" />

        <section id="about" className="scroll-mt-10 space-y-3 fade-up-in fade-up-delay-2">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">About me</h2>
          <AboutGlobeSection items={aboutItems} entries={aboutEntries} />
        </section>

        <Separator className="my-9" />

        <section id="projects" className="scroll-mt-10 space-y-3 fade-up-in fade-up-delay-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Selected projects</h2>
          <ProjectsExpandableList projects={projects} />
        </section>

        <Separator className="my-9" />

        <section id="skills" className="scroll-mt-10 space-y-4 fade-up-in fade-up-delay-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Skills</h2>
          <div className="space-y-3">
            {skills.map(({ category, items, color }) => (
              <div key={category} className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:items-start">
                <h3 className="pt-0.5 text-sm font-medium">{category}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {items.map(({ name, icon }) => (
                    <Badge key={name} className={color}>
                      <HugeiconsIcon icon={icon} size={12} strokeWidth={2} aria-hidden="true" />
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
