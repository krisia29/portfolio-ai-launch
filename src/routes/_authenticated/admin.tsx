import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Github, ExternalLink, User } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const isStaff = (roles ?? []).some((r) => r.role === "teacher" || r.role === "admin");
    if (!isStaff) throw redirect({ to: "/unauthorized" });
  },
  component: AdminPage,
});

function AdminPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<"submitted" | "approved" | "revision_requested" | "all">("submitted");

  const { data: subs = [] } = useQuery({
    queryKey: ["adminSubs", statusFilter],
    queryFn: async () => {
      let q = supabase
        .from("submissions")
        .select("*, assignments(title,points,platform,modules(title)), profiles!submissions_student_id_fkey(display_name,github_username,email), submission_artifacts(*), github_repo_snapshots(*)")
        .order("submitted_at", { ascending: false })
        .limit(100);
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-display font-semibold">Submission review</h1>
      <div className="mt-4 flex gap-2 text-sm">
        {(["submitted", "revision_requested", "approved", "all"] as const).map((s) => (
          <button
            key={s}
            className={`px-3 py-1.5 rounded-full border ${statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
            onClick={() => setStatusFilter(s)}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {subs.map((s: any) => (
          <ReviewCard key={s.id} sub={s} onChanged={() => qc.invalidateQueries({ queryKey: ["adminSubs"] })} />
        ))}
        {subs.length === 0 && (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            Nothing here.
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ sub, onChanged }: { sub: any; onChanged: () => void }) {
  const [feedback, setFeedback] = useState(sub.feedback_md ?? "");
  const [score, setScore] = useState<number | string>(sub.score ?? sub.assignments?.points ?? 10);
  const [busy, setBusy] = useState(false);

  const act = async (status: "approved" | "revision_requested") => {
    setBusy(true);
    const { error } = await supabase.from("submissions").update({
      status,
      feedback_md: feedback || null,
      score: status === "approved" ? Number(score) || 0 : null,
      reviewed_at: new Date().toISOString(),
    }).eq("id", sub.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(status === "approved" ? "Approved" : "Revision requested");
    onChanged();
  };

  const repo = sub.submission_artifacts?.find((a: any) => a.kind === "github_repo");
  const live = sub.submission_artifacts?.find((a: any) => a.kind === "github_pages" || a.kind === "live_url" || a.kind === "replit");

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs text-muted-foreground">{sub.assignments?.modules?.title} · {sub.assignments?.platform}</div>
          <div className="font-semibold">{sub.assignments?.title}</div>
          <div className="text-sm text-muted-foreground mt-1 inline-flex items-center gap-1">
            <User className="w-3 h-3" />
            {sub.profiles?.display_name ?? sub.profiles?.email ?? "Student"}
            {sub.profiles?.github_username && <span className="text-xs">· @{sub.profiles.github_username}</span>}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">{new Date(sub.submitted_at).toLocaleString()}</div>
      </div>

      {sub.github_repo_snapshots && (
        <div className="mt-3 text-sm rounded-lg border bg-muted/40 p-3">
          <div className="font-medium">{sub.github_repo_snapshots.repo_owner}/{sub.github_repo_snapshots.repo_name}</div>
          {sub.github_repo_snapshots.description && <div className="text-xs text-muted-foreground">{sub.github_repo_snapshots.description}</div>}
          <div className="text-xs mt-1">
            {sub.github_repo_snapshots.primary_language ?? "—"} · Public: {sub.github_repo_snapshots.is_public ? "yes" : "no"} · README: {sub.github_repo_snapshots.has_readme ? "yes" : "no"} · Updated {sub.github_repo_snapshots.last_pushed_at ? new Date(sub.github_repo_snapshots.last_pushed_at).toLocaleDateString() : "—"}
          </div>
        </div>
      )}

      <div className="mt-3 flex gap-2 flex-wrap text-xs">
        {repo?.url && <a href={repo.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 hover:bg-muted"><Github className="w-3 h-3" /> Repo</a>}
        {live?.url && <a href={live.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 hover:bg-muted"><ExternalLink className="w-3 h-3" /> Live</a>}
      </div>

      {sub.reflection_md && (
        <div className="mt-3 text-sm">
          <div className="text-xs font-semibold text-muted-foreground">Reflection</div>
          <div className="mt-1 whitespace-pre-wrap">{sub.reflection_md}</div>
        </div>
      )}

      <div className="mt-4 grid sm:grid-cols-[1fr_auto] gap-3">
        <Textarea placeholder="Feedback for the student" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} />
        <div className="flex sm:flex-col gap-2 items-stretch">
          <Input type="number" className="sm:w-24" value={score} onChange={(e) => setScore(e.target.value)} placeholder="Score" />
          <Button size="sm" onClick={() => act("approved")} disabled={busy}>Approve</Button>
          <Button size="sm" variant="outline" onClick={() => act("revision_requested")} disabled={busy}>Request revision</Button>
        </div>
      </div>
    </div>
  );
}
