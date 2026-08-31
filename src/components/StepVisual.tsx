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
  const kind = visual.kind ?? "cards";

  return (
    <figure className="mt-4 rounded-xl border bg-muted/30 p-4">
      {visual.title && (
        <figcaption className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {visual.title}
        </figcaption>
      )}

      {kind === "chevrons" && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {visual.items.map((it, i) => (
            <div
              key={i}
              className="relative rounded-lg border border-primary/25 bg-card p-4 text-center shadow-sm"
            >
              <span className="absolute left-2 top-2 text-[10px] font-semibold text-primary/60">
                {i + 1}
              </span>
              <Icon name={it.icon} className="mx-auto h-7 w-7 text-primary" />
              <div className="mt-2 text-sm font-semibold">{it.title}</div>
              {it.body && (
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{it.body}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {kind === "flow" && (
        <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          {visual.items.map((it, i) => (
            <li key={i} className="flex flex-1 items-center gap-2">
              <div className="flex-1 rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2">
                  <Icon name={it.icon} className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-semibold">{it.title}</span>
                </div>
                {it.body && (
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{it.body}</p>
                )}
              </div>
              {i < visual.items.length - 1 && (
                <span className="hidden shrink-0 text-primary/50 sm:block" aria-hidden>
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      )}

      {kind === "cards" && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {visual.items.map((it, i) => (
            <div key={i} className="rounded-lg border bg-card p-3">
              <Icon name={it.icon} className="h-6 w-6 text-primary" />
              <div className="mt-2 text-sm font-semibold">{it.title}</div>
              {it.body && (
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{it.body}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {kind === "checklist" && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {visual.items.map((it, i) => (
            <li key={i} className="flex items-start gap-2 rounded-lg border bg-card p-3">
              <Icon name={it.icon} className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <div className="text-sm font-medium">{it.title}</div>
                {it.body && (
                  <p className="text-xs leading-snug text-muted-foreground">{it.body}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
