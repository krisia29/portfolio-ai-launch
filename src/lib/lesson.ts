// Structured lesson schema. When an assignment has a `lesson` JSON, the UI
// auto-renders lesson pages, progress, checkboxes, evidence checkpoints, etc.

export type EvidenceConfig = {
  title?: string;
  required?: boolean;
  optional?: boolean;
  acceptedFiles?: string[]; // e.g. ["png","jpg","pdf","docx","pptx","zip"]
  allowLinks?: boolean;
  allowComments?: boolean; // reflection
  reflectionPrompt?: string;
  reflectionRequired?: boolean;
  maxFiles?: number;
  maxSizeMb?: number;
};

export type LessonStep = {
  id: string;
  title: string;
  body?: string; // markdown; may include an inline "/evidence" token to place checkpoint
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
  successCriteria: string[];
  overview?: string;
  estimatedMinutes?: number;
  difficulty?: "beginner" | "intermediate" | "advanced" | string;
  steps: LessonStep[];
  checklist?: string[];
  resources?: LessonResource[];
};

export function isLesson(value: unknown): value is Lesson {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.objective === "string" &&
    Array.isArray(v.successCriteria) &&
    Array.isArray(v.steps)
  );
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
