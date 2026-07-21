import { useMemo, useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Upload,
  ImageIcon,
  ListChecks,
  BookOpen,
  Trophy,
} from "lucide-react";
import type { Lesson } from "@/lib/lesson";

type Props = {
  lesson: Lesson;
  assignmentId: string;
  userId: string | null;
  readOnly?: boolean;
};

type ProgressRow = {
  id: string;
  student_id: string;
  assignment_id: string;
  completed_steps: string[];
  screenshots: Record<string, { path: string }>;
};

const BUCKET = "submission-screenshots";

export function LessonView({ lesson, assignmentId, userId, readOnly }: Props) {
  const qc = useQueryClient();

  const { data: progress } = useQuery({
    queryKey: ["assignmentProgress", assignmentId, userId],
    enabled: !!userId,
    queryFn: async (): Promise<ProgressRow | null> => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("assignment_progress")
        .select("*")
        .eq("student_id", userId)
        .eq("assignment_id", assignmentId)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as ProgressRow) ?? null;
    },
  });

  const completedSet = useMemo(
    () => new Set(progress?.completed_steps ?? []),
    [progress],
  );
  const screenshots = progress?.screenshots ?? {};

  const totalSteps = lesson.steps.length;
  const doneSteps = lesson.steps.filter((s) => completedSet.has(s.id)).length;
  const pct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;

  const upsertProgress = useMutation({
    mutationFn: async (patch: {
      completed_steps?: string[];
      screenshots?: Record<string, { path: string }>;
    }) => {
      if (!userId) throw new Error("Sign in required");
      const next = {
        student_id: userId,
        assignment_id: assignmentId,
        completed_steps: patch.completed_steps ?? progress?.completed_steps ?? [],
        screenshots: patch.screenshots ?? progress?.screenshots ?? {},
      };
      const { error } = await supabase
        .from("assignment_progress")
        .upsert(next, { onConflict: "student_id,assignment_id" });
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["assignmentProgress", assignmentId, userId] }),
    onError: (e: any) => toast.error(e?.message ?? "Failed to save progress"),
  });

  const toggleStep = (stepId: string, checked: boolean) => {
    if (readOnly || !userId) return;
    const set = new Set(completedSet);
    if (checked) set.add(stepId);
    else set.delete(stepId);
    upsertProgress.mutate({ completed_steps: Array.from(set) });
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Progress + meta */}
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              {doneSteps}/{totalSteps} steps complete
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {lesson.estimatedMinutes && (
              <span className="rounded-full border px-2 py-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />~{lesson.estimatedMinutes} min
              </span>
            )}
            {lesson.difficulty && (
              <span className="rounded-full border px-2 py-0.5 capitalize">
                {lesson.difficulty}
              </span>
            )}
          </div>
        </div>
        <Progress value={pct} className="mt-3 h-2" />
      </div>

      {/* Objective + success criteria */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-display font-semibold">
            <Target className="w-4 h-4 text-primary" /> Learning objective
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{lesson.objective}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-display font-semibold">
            <ListChecks className="w-4 h-4 text-primary" /> Success criteria
          </div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
            {lesson.successCriteria.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overview */}
      {lesson.overview && (
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-display font-semibold">
            <BookOpen className="w-4 h-4 text-primary" /> Overview
          </div>
          <Markdown text={lesson.overview} className="mt-2" />
        </div>
      )}

      {/* Steps */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="font-display text-lg font-semibold">Instructions</div>
        <ol className="mt-4 space-y-4">
          {lesson.steps.map((step, idx) => {
            const done = completedSet.has(step.id);
            return (
              <li
                key={step.id}
                className={`rounded-xl border p-4 transition ${
                  done ? "border-success/40 bg-success/5" : "bg-background"
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => toggleStep(step.id, !done)}
                    disabled={readOnly || !userId}
                    className="mt-0.5 shrink-0"
                    aria-label={done ? "Mark step incomplete" : "Mark step complete"}
                  >
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Step {idx + 1}
                      </span>
                      <span className="font-medium">{step.title}</span>
                    </div>
                    {step.body && <Markdown text={step.body} className="mt-1" />}
                    {step.screenshot && userId && (
                      <ScreenshotSlot
                        assignmentId={assignmentId}
                        userId={userId}
                        stepId={step.id}
                        label={step.screenshot.label ?? "Screenshot"}
                        hint={step.screenshot.hint}
                        required={step.screenshot.required}
                        existing={screenshots[step.id]?.path}
                        readOnly={readOnly}
                        onUploaded={(path) =>
                          upsertProgress.mutate({
                            screenshots: { ...screenshots, [step.id]: { path } },
                          })
                        }
                      />
                    )}
                  </div>
                </label>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Submission checklist */}
      {lesson.checklist && lesson.checklist.length > 0 && (
        <div className="rounded-2xl border bg-card p-6">
          <div className="font-display text-lg font-semibold">Submission checklist</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {lesson.checklist.map((c, i) => (
              <li key={i} className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="rounded-2xl border bg-card p-6">
          <div className="font-display text-lg font-semibold">Resources</div>
          <ul className="mt-2 space-y-1 text-sm">
            {lesson.resources.map((r, i) => (
              <li key={i}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ScreenshotSlot(props: {
  assignmentId: string;
  userId: string;
  stepId: string;
  label: string;
  hint?: string;
  required?: boolean;
  existing?: string;
  readOnly?: boolean;
  onUploaded: (path: string) => void;
}) {
  const { assignmentId, userId, stepId, label, hint, required, existing, readOnly, onUploaded } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  const onPick = () => inputRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `${userId}/${assignmentId}/${stepId}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      onUploaded(path);
      toast.success("Screenshot uploaded");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const viewExisting = async () => {
    if (!existing) return;
    const { data } = await supabase.storage.from(BUCKET).createSignedUrl(existing, 300);
    if (data?.signedUrl) setSignedUrl(data.signedUrl);
  };

  return (
    <div className="mt-3 rounded-lg border border-dashed p-3 bg-muted/40" onClick={(e) => e.preventDefault()}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{label}</span>
          {required && <span className="text-xs text-destructive">required</span>}
          {existing && (
            <span className="text-xs text-success flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> uploaded
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {existing && (
            <Button type="button" variant="outline" size="sm" onClick={viewExisting}>
              View
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={readOnly || uploading}
            onClick={onPick}
          >
            <Upload className="w-3 h-3 mr-1" />
            {uploading ? "Uploading…" : existing ? "Replace" : "Upload"}
          </Button>
        </div>
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {signedUrl && (
        <img
          src={signedUrl}
          alt={label}
          className="mt-2 max-h-64 rounded border object-contain bg-background"
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />
    </div>
  );
}
