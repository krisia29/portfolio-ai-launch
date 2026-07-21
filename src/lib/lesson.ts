// Structured lesson schema. When an assignment has a `lesson` JSON, the UI
// auto-renders lesson pages, progress, checkboxes, screenshot uploads, etc.

export type LessonStep = {
  id: string;
  title: string;
  body?: string; // markdown
  screenshot?: {
    required?: boolean;
    label?: string;
    hint?: string;
  };
};

export type LessonResource = {
  label: string;
  url: string;
};

export type Lesson = {
  version?: 1;
  objective: string;
  successCriteria: string[];
  overview?: string; // markdown
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
