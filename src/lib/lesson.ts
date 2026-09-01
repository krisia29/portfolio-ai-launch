// Structured lesson schema. When an assignment has a `lesson` JSON, the UI
// auto-renders lesson pages, progress, checkboxes, evidence checkpoints, etc.

export type EvidenceConfig = {
  title?: string;
  required?: boolean;
  optional?: boolean;
  acceptedFiles?: string[]; // e.g. ["png","jpg","pdf","docx","pptx","zip"]
  allowLinks?: boolean;
  allowFiles?: boolean; // default true; false hides the upload dropzone
  linkRequired?: boolean; // require a project URL to mark complete
  allowComments?: boolean; // reflection
  reflectionPrompt?: string;
  reflectionRequired?: boolean;
  maxFiles?: number;
  maxSizeMb?: number;
};

export type StepVisualItem = {
  icon?: string; // key from StepVisual's ICONS map
  title: string;
  body?: string;
};

export type StepVisual = {
  kind?: "chevrons" | "flow" | "cards" | "checklist";
  title?: string;
  items: StepVisualItem[];
};

export type LessonStep = {
  id: string;
  title: string;
  body?: string; // markdown; may include an inline "/evidence" token to place checkpoint
  // Optional illustrated card graphic rendered under the step body.
  visual?: StepVisual;
  // Legacy single-screenshot slot (kept for backward compatibility).
  screenshot?: {
    required?: boolean;
    label?: string;
    hint?: string;
  };
  // New Evidence Checkpoint. Presence of this field renders the checkpoint under the step.
  evidence?: EvidenceConfig;
};


export type LessonResource = { label: string; url: string };

export type Lesson = {
  version?: 1;
  objective: string;
  successCriteria?: string[];
  overview?: string;
  estimatedMinutes?: number;
  estimatedTime?: string;
  platform?: string;
  steps: LessonStep[];
  checklist?: string[];
  resources?: LessonResource[];
};

// Some lessons were authored with `objectives: string[]` instead of
// `objective: string`. Normalize so those lessons still render.
export function normalizeLesson(value: unknown): Lesson | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, any>;
  if (!Array.isArray(v.steps)) return null;
  let objective: string | undefined =
    typeof v.objective === "string" ? v.objective : undefined;
  if (!objective) {
    if (Array.isArray(v.objectives)) {
      objective = v.objectives.filter((o: unknown) => typeof o === "string").join(" ");
    } else if (typeof v.objectives === "string") {
      objective = v.objectives;
    }
  }
  if (!objective) return null;
  return { ...(v as object), objective } as Lesson;
}

export function isLesson(value: unknown): value is Lesson {
  return normalizeLesson(value) !== null;
}

// Per-step evidence state saved into assignment_progress.evidence JSON
export type EvidenceFile = {
  path: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
};

export type EvidenceStatus =
  | "not_started"
  | "in_progress"
  | "complete"
  | "needs_revision";

export type EvidenceState = {
  files: EvidenceFile[];
  link?: string;
  reflection?: string;
  status: EvidenceStatus;
};

export const DEFAULT_ACCEPTED = ["png", "jpg", "jpeg", "pdf", "docx", "pptx", "zip"];
export const DEFAULT_MAX_FILES = 5;
export const DEFAULT_MAX_SIZE_MB = 50;

// Display an estimated-time range (matches the lesson header format).
export function minutesRange(minutes?: number | null): string | null {
  if (!minutes) return null;
  if (minutes <= 45) return "30–45 minutes";
  if (minutes <= 60) return "45–60 minutes";
  if (minutes <= 75) return "60–75 minutes";
  return "75–90 minutes";
}
