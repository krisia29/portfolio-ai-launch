import {
  Github,
  FileText,
  MessageSquare,
  Lightbulb,
  Search,
  Sparkles,
  Users,
  Image as ImageIcon,
  Palette,
  Map,
  Workflow,
  Rocket,
  Smartphone,
  Monitor,
  Presentation,
  Share2,
  Download,
  Upload,
  ClipboardList,
  ListChecks,
  Target,
  Compass,
  BookOpen,
  Braces,
  Bot,
  Layers,
  Link2,
  Lock,
  PenLine,
  Type,
  Wand2,
  Eye,
  Folder,
  Save,
  Star,
  ShieldCheck,
  Globe,
  type LucideIcon,
} from "lucide-react";
import type { StepVisual as StepVisualData } from "@/lib/lesson";

const ICONS: Record<string, LucideIcon> = {
  github: Github,
  document: FileText,
  chat: MessageSquare,
  idea: Lightbulb,
  research: Search,
  ai: Sparkles,
  users: Users,
  image: ImageIcon,
  palette: Palette,
  map: Map,
  workflow: Workflow,
  rocket: Rocket,
  mobile: Smartphone,
  desktop: Monitor,
  slides: Presentation,
  share: Share2,
  download: Download,
  upload: Upload,
  clipboard: ClipboardList,
  checklist: ListChecks,
  target: Target,
  compass: Compass,
  book: BookOpen,
  code: Braces,
  bot: Bot,
  layers: Layers,
  link: Link2,
  lock: Lock,
  write: PenLine,
  text: Type,
  magic: Wand2,
  review: Eye,
  folder: Folder,
  save: Save,
  star: Star,
  privacy: ShieldCheck,
  web: Globe,
};

function Icon({ name, className }: { name?: string; className?: string }) {
  const Cmp = (name && ICONS[name]) || Sparkles;
  return <Cmp className={className} strokeWidth={1.5} aria-hidden />;
}

export function StepVisual({ visual }: { visual?: StepVisualData }) {
  if (!visual || !visual.items?.length) return null;
  const kind: string = visual.kind ?? "cards";
  const items = visual.items;

  // One consistent grid for every kind so every box is the same width/height.
  const cols =
    items.length <= 2
      ? "sm:grid-cols-2"
      : items.length === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : items.length === 4
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : "sm:grid-cols-2 lg:grid-cols-3";

  const numbered = kind === "chevrons" || kind === "flow";

  return (
    <figure className="mt-4 rounded-xl border bg-muted/30 p-4">
      {visual.title && (
        <figcaption className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {visual.title}
        </figcaption>
      )}

      <div className={`grid auto-rows-fr gap-3 ${cols}`}>
        {items.map((it, i) => (
          <div
            key={i}
            className="flex h-full flex-col rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon name={it.icon} className="h-4.5 w-4.5" />
              </span>
              {numbered && (
                <span className="ml-auto text-[11px] font-semibold tabular-nums text-primary/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
            </div>
            <div className="mt-3 text-sm font-semibold leading-snug">{it.title}</div>
            {it.body && (
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {it.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </figure>
  );
}

