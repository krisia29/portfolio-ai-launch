import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Markdown } from "@/components/Markdown";
import { EvidenceCheckpoint } from "@/components/EvidenceCheckpoint";
import type { EvidenceState } from "@/lib/lesson";
import { toast } from "sonner";

type Props = {
  assignmentId: string;
  userId: string | null;
  sectionKey: string;
  text: string | null | undefined;
  readOnly?: boolean;
  className?: string;
};

type ProgressRow = {
  completed_steps: string[];
  screenshots: Record<string, { path: string }>;
  evidence: Record<string, EvidenceState>;
};

function emptyEvidence(): EvidenceState {
  return { files: [], status: "not_started" };
}

const EVIDENCE_TOKEN = "__EVIDENCE__";

// Split markdown by placeholder lines or a "/evidence" token.
// Handles plain text, bold labels, and markdown list items like:
// - **Screenshot placeholder:** capture your screen...
// Returns alternating text/evidence segments while removing the placeholder text.
function splitByEvidence(md: string): string[] {
  const pattern =
    /(^|\n)[ \t]*(?:(?:[-*+]|\d+[.)])\s+)?(?:\*\*\s*)?Screenshot\s+placeholder(?:\s*\*\*)?\s*:?[^\n]*(?=\n|$)|\/evidence\b/gi;
  const parts: string[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(md)) !== null) {
    const start = m.index + (m[1]?.length ?? 0);
    parts.push(md.slice(last, start));
    parts.push(EVIDENCE_TOKEN);
    last = m.index + m[0].length;
  }
  parts.push(md.slice(last));
  return parts;
}

export function MarkdownWithEvidence({
  assignmentId,
  userId,
  sectionKey,
  text,
  readOnly,
  className,
}: Props) {
  const qc = useQueryClient();

  const { data: progress } = useQuery({
    queryKey: ["assignmentProgress", assignmentId, userId],
    enabled: !!userId,
    queryFn: async (): Promise<ProgressRow | null> => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("assignment_progress")
        .select("completed_steps,screenshots,evidence")
        .eq("student_id", userId)
        .eq("assignment_id", assignmentId)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as ProgressRow) ?? null;
    },
  });

  const serverEvidence = progress?.evidence ?? {};
  const [overlay, setOverlay] = useState<Record<string, EvidenceState>>({});
  useEffect(() => {
    setOverlay((prev) => {
      const next: typeof prev = {};
      for (const [k, v] of Object.entries(prev)) {
        if (JSON.stringify(serverEvidence[k]) !== JSON.stringify(v)) next[k] = v;
      }
      return next;
    });
  }, [progress]);

  const upsertProgress = useMutation({
    mutationFn: async (nextEvidence: Record<string, EvidenceState>) => {
      if (!userId) throw new Error("Sign in required");
      const row = {
        student_id: userId,
        assignment_id: assignmentId,
        completed_steps: progress?.completed_steps ?? [],
        screenshots: progress?.screenshots ?? {},
        evidence: nextEvidence,
      };
      const { error } = await supabase
        .from("assignment_progress")
        .upsert(row as any, { onConflict: "student_id,assignment_id" });
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["assignmentProgress", assignmentId, userId],
      }),
    onError: (e: any) => toast.error(e?.message ?? "Failed to save progress"),
  });

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const handleChange = (stepId: string, next: EvidenceState) => {
    setOverlay((prev) => ({ ...prev, [stepId]: next }));
    if (timers.current[stepId]) clearTimeout(timers.current[stepId]);
    timers.current[stepId] = setTimeout(() => {
      const merged = { ...serverEvidence, ...overlay, [stepId]: next };
      upsertProgress.mutate(merged);
    }, 500);
  };

  const segments = useMemo(() => splitByEvidence(text ?? ""), [text]);

  if (!text) return null;

  let evidenceIdx = 0;
  return (
    <div className={className}>
      {segments.map((seg, i) => {
        if (seg === EVIDENCE_TOKEN) {
          const stepId = `${sectionKey}-ev-${evidenceIdx}`;
          const idx = evidenceIdx;
          evidenceIdx += 1;
          const value = overlay[stepId] ?? serverEvidence[stepId] ?? emptyEvidence();
          if (!userId) {
            return (
              <div key={i} className="mt-3 rounded-xl border-2 border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                Sign in to upload evidence for this step.
              </div>
            );
          }
          return (
            <EvidenceCheckpoint
              key={i}
              assignmentId={assignmentId}
              userId={userId}
              stepId={stepId}
              stepIndex={idx}
              config={{
                title: `Upload Evidence`,
                optional: true,
                allowLinks: true,
                allowComments: true,
              }}
              value={value}
              readOnly={readOnly}
              onChange={(next) => handleChange(stepId, next)}
            />
          );
        }
        return <Markdown key={i} text={seg} />;
      })}
    </div>
  );
}
