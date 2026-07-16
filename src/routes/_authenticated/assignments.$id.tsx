import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Github, ExternalLink, CheckCircle2, XCircle, RefreshCw, ShieldAlert } from "lucide-react";
import { Markdown } from "@/components/Markdown";

export const Route = createFileRoute("/_authenticated/assignments/$id")({
  component: AssignmentPage,
});

function AssignmentPage() {
  const { id } = Route.useParams();
  const { user, previewAsStudent } = useAuth();
  const qc = useQueryClient();

  const { data: assignment } = useQuery({
    queryKey: ["assignment", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("assignments").select("*, modules(title,slug)").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: submission } = useQuery({
    queryKey: ["mySubmission", id, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*, submission_artifacts(*), github_repo_snapshots(*)")
        .eq("assignment_id", id)
        .eq("student_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [reflection, setReflection] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [verification, setVerification] = useState<null | {
    ok: boolean;
    errors: string[];
    repo?: any;
  }>(null);

  const verify = async () => {
    setVerifying(true);
    setVerification(null);
    try {
      const res = await fetch("/api/public/verify-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: repoUrl }),
      });
      const body = await res.json();
      setVerification(body);
      if (!body.ok) toast.error("Repo failed validation. See details below.");
      else toast.success("Repo verified.");
    } catch (e) {
      toast.error("Verification failed. Check the URL and try again.");
    } finally {
      setVerifying(false);
    }
  };

  const submit = async () => {
    if (!user || !assignment) return;
    if (previewAsStudent) {
      return toast.error("Preview mode — submissions are disabled while viewing as a student.");
    }
    if (assignment.requires_github && (!verification || !verification.ok)) {
      return toast.error("Verify your GitHub repo before submitting.");
    }
    setSubmitting(true);
    try {
      const { data: sub, error } = await supabase
        .from("submissions")
        .upsert(
          {
            assignment_id: assignment.id,
            student_id: user.id,
            reflection_md: reflection,
            status: "submitted",
            submitted_at: new Date().toISOString(),
          },
          { onConflict: "assignment_id,student_id" },
        )
        .select()
        .single();
      if (error) throw error;

      const artifacts: any[] = [];
      if (repoUrl) artifacts.push({ submission_id: sub.id, kind: "github_repo", url: repoUrl });
      if (liveUrl) {
        const kind = /\.github\.io/.test(liveUrl) ? "github_pages" : /replit/.test(liveUrl) ? "replit" : "live_url";
        artifacts.push({ submission_id: sub.id, kind, url: liveUrl });
      }
      if (artifacts.length) {
        await supabase.from("submission_artifacts").delete().eq("submission_id", sub.id);
        const { error: aErr } = await supabase.from("submission_artifacts").insert(artifacts);
        if (aErr) throw aErr;
      }

      if (verification?.ok && verification.repo) {
        await supabase.from("github_repo_snapshots").upsert({
          submission_id: sub.id,
          repo_owner: verification.repo.owner,
          repo_name: verification.repo.name,
          description: verification.repo.description,
          primary_language: verification.repo.language,
          is_public: verification.repo.is_public,
          has_readme: verification.repo.has_readme,
          is_empty: verification.repo.is_empty,
          last_pushed_at: verification.repo.pushed_at,
          html_url: verification.repo.html_url,
          stars: verification.repo.stars ?? 0,
          verification_errors: [],
        });
      }

      toast.success("Submitted for review!");
      qc.invalidateQueries({ queryKey: ["mySubmission", id] });
      qc.invalidateQueries({ queryKey: ["mySubmissions"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (!assignment) return <div className="mx-auto max-w-4xl px-4 py-10 text-muted-foreground">Loading…</div>;

  const alreadyApproved = submission?.status === "approved";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/modules/$slug" params={{ slug: assignment.modules?.slug }} className="text-sm text-primary hover:underline">
        ← {assignment.modules?.title}
      </Link>
      <h1 className="text-3xl font-display font-semibold mt-2">{assignment.title}</h1>
      <p className="text-muted-foreground mt-2">{assignment.objectives}</p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border px-2 py-0.5">{assignment.platform}</span>
        <span className="rounded-full border px-2 py-0.5">{assignment.difficulty}</span>
        <span className="rounded-full border px-2 py-0.5">~{assignment.est_minutes} min</span>
        <span className="rounded-full border px-2 py-0.5">{assignment.points} pts</span>
        {assignment.requires_github && (
          <span className="rounded-full border border-primary/40 text-primary px-2 py-0.5">GitHub required</span>
        )}
      </div>

      <section className="mt-8 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Instructions</h2>
        <MarkdownBlock text={assignment.instructions_md} />
      </section>

      <section className="mt-4 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Deliverables</h2>
        <MarkdownBlock text={assignment.deliverables_md} />
      </section>

      {assignment.github_instructions_md && (
        <section className="mt-4 rounded-2xl border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Publishing to GitHub</h2>
          <MarkdownBlock text={assignment.github_instructions_md} />
        </section>
      )}

      {assignment.readme_template_md && (
        <section className="mt-4 rounded-2xl border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">README starter</h2>
          <p className="text-sm text-muted-foreground mt-1">Copy this into your repo's README.md.</p>
          <pre className="mt-3 bg-muted p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">{assignment.readme_template_md}</pre>
        </section>
      )}

      <section className="mt-4 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">README checklist</h2>
        <ul className="mt-2 text-sm text-muted-foreground grid sm:grid-cols-2 gap-y-1">
          {["Project title", "Project description", "AI tools used", "Skills learned", "Screenshots", "Installation / usage", "Reflection"].map(
            (i) => (
              <li key={i}>• {i}</li>
            ),
          )}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Your submission</h2>
        {alreadyApproved ? (
          <div className="mt-3 rounded-lg border border-success/40 bg-success/10 p-4 text-sm">
            <div className="font-medium text-success flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Approved</div>
            {submission?.score != null && <div className="mt-1">Score: {submission.score}/{assignment.points}</div>}
            {submission?.feedback_md && <div className="mt-2 whitespace-pre-wrap">{submission.feedback_md}</div>}
          </div>
        ) : (
          <>
            {submission?.status === "revision_requested" && (
              <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
                <div className="font-medium text-destructive">Revision requested</div>
                {submission?.feedback_md && <div className="mt-1 whitespace-pre-wrap">{submission.feedback_md}</div>}
              </div>
            )}
            {submission?.status === "submitted" && (
              <div className="mt-3 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">Submitted. Waiting for instructor review.</div>
            )}

            {assignment.requires_github && (
              <div className="mt-4">
                <Label htmlFor="repo">GitHub repository URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input id="repo" placeholder="https://github.com/username/repo" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
                  <Button type="button" variant="outline" onClick={verify} disabled={!repoUrl || verifying}>
                    {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
                    <span className="ml-1">Verify</span>
                  </Button>
                </div>
                {verification && (
                  <div className={`mt-3 rounded-lg border p-3 text-sm ${verification.ok ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10"}`}>
                    {verification.ok ? (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                        <div>
                          <div className="font-medium">{verification.repo?.owner}/{verification.repo?.name}</div>
                          <div className="text-xs text-muted-foreground">{verification.repo?.description}</div>
                          <div className="text-xs mt-1">
                            Language: {verification.repo?.language ?? "—"} · Updated {verification.repo?.pushed_at ? new Date(verification.repo.pushed_at).toLocaleDateString() : "—"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-destructive mt-0.5" />
                        <div>
                          <div className="font-medium">Repository failed validation</div>
                          <ul className="mt-1 list-disc pl-5 text-xs">
                            {verification.errors.map((e) => <li key={e}>{e}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4">
              <Label htmlFor="live">Live URL (GitHub Pages, Replit, or other) — optional</Label>
              <Input id="live" placeholder="https://yourname.github.io/project" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
            </div>

            <div className="mt-4">
              <Label htmlFor="reflection">Reflection</Label>
              <Textarea id="reflection" rows={5} value={reflection} onChange={(e) => setReflection(e.target.value)} maxLength={3000} placeholder="What did you learn? What would you do differently?" />
              {Array.isArray(assignment.reflection_questions) && assignment.reflection_questions.length > 0 && (
                <ul className="mt-2 text-xs text-muted-foreground list-disc pl-5">
                  {(assignment.reflection_questions as unknown as string[]).map((q: string) => <li key={q}>{q}</li>)}
                </ul>
              )}
            </div>

            <Button className="mt-5" onClick={submit} disabled={submitting || previewAsStudent} title={previewAsStudent ? "Disabled in preview mode" : undefined}>
              {previewAsStudent ? "Preview mode — submit disabled" : submitting ? "Submitting…" : "Submit for review"}
            </Button>
          </>
        )}
      </section>
    </div>
  );
}

function MarkdownBlock({ text }: { text: string | null | undefined }) {
  return <Markdown text={text} className="mt-2" />;
}
