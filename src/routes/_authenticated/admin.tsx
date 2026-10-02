import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Github, ExternalLink, User, Sheet, Download, RefreshCw } from "lucide-react";
import { syncProgressSheet } from "@/lib/progress-sheet.functions";
import { grantAdminAccess } from "@/lib/admin-roles.functions";


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
  const navigate = useNavigate();
  const { previewAsStudent } = useAuth();
  const [statusFilter, setStatusFilter] = useState<"submitted" | "approved" | "revision_requested" | "all">("submitted");

  useEffect(() => {
    if (previewAsStudent) navigate({ to: "/dashboard" });
  }, [previewAsStudent, navigate]);

  const { data: subs = [] } = useQuery({
    queryKey: ["adminSubs", statusFilter],
    queryFn: async () => {
      let q = supabase
        .from("submissions")
        .select("*, assignments(title,points,platform,modules(title)), submission_artifacts(*), github_repo_snapshots(*)")
        .order("submitted_at", { ascending: false })
        .limit(100);
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      const rows = data ?? [];
      const ids = [...new Set(rows.map((r: any) => r.student_id))];
      if (ids.length === 0) return rows;
      const aIds = [...new Set(rows.map((r: any) => r.assignment_id))];
      const [{ data: people }, { data: progress }] = await Promise.all([
        supabase.from("profiles").select("id, display_name, github_username, email").in("id", ids),
        supabase
          .from("assignment_progress")
          .select("student_id, assignment_id, evidence")
          .in("student_id", ids)
          .in("assignment_id", aIds),
      ]);
      const byId = new Map((people ?? []).map((p: any) => [p.id, p]));
      const prog = new Map((progress ?? []).map((p: any) => [`${p.student_id}:${p.assignment_id}`, p.evidence]));
      return rows.map((r: any) => ({
        ...r,
        profiles: byId.get(r.student_id) ?? null,
        evidence: prog.get(`${r.student_id}:${r.assignment_id}`) ?? {},
      }));
    },
  });


  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <AccessRequests />
      <ManageAdmins />
      <ProgressSheetPanel />
      <h2 className="text-3xl font-display font-semibold mt-10">Submission review</h2>

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
    if (status === "approved") {
      syncProgressSheet().catch(() => toast.error("Approved, but the progress sheet couldn't be updated."));
    }
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

      <SubmissionEvidence evidence={sub.evidence} />

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

function SubmissionEvidence({ evidence }: { evidence: any }) {
  const entries = Object.entries(evidence ?? {}) as [string, any][];
  const items = entries.filter(([, v]) => v && (v.link || v.files?.length || v.reflection || v.text));
  const openFile = async (path: string) => {
    const { data, error } = await supabase.storage.from("submission-screenshots").createSignedUrl(path, 300);
    if (error || !data?.signedUrl) return toast.error("Could not open file");
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="mt-4 rounded-lg border bg-muted/40 p-3 text-sm">
      <div className="text-xs font-semibold text-muted-foreground">Submitted work</div>
      {items.length === 0 ? (
        <div className="mt-1 text-muted-foreground">No links, files or answers were attached.</div>
      ) : (
        <div className="mt-2 space-y-3">
          {items.map(([step, v]) => (
            <div key={step}>
              <div className="text-xs text-muted-foreground capitalize">{step.replace(/[-_]/g, " ")}</div>
              {v.link && (
                <a href={v.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all inline-flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 shrink-0" /> {v.link}
                </a>
              )}
              {v.files?.map((f: any) => (
                <button key={f.path} onClick={() => openFile(f.path)} className="block text-primary hover:underline text-left">
                  {f.name}
                </button>
              ))}
              {(v.reflection || v.text) && <div className="whitespace-pre-wrap mt-1">{v.reflection || v.text}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AccessRequests() {
  const qc = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const { data: requests = [] } = useQuery({
    queryKey: ["accessRequests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, email, access_status, access_requested_at, requested_role" as any)
        .eq("access_status", "pending")
        .order("access_requested_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const decide = async (id: string, status: "approved" | "denied", asAdmin = false) => {
    setBusyId(id);
    try {
      if (asAdmin && status === "approved") {
        await grantAdminAccess({ data: { userId: id } });
        toast.success("Admin access granted.");
        qc.invalidateQueries({ queryKey: ["accessRequests"] });
        return;
      }
      const { data: me } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("profiles")
        .update({
          access_status: status,
          access_decided_at: new Date().toISOString(),
          access_decided_by: me.user?.id ?? null,
        })
        .eq("id", id);
      if (error) throw error;
      toast.success(status === "approved" ? "Student approved." : "Request denied.");
      qc.invalidateQueries({ queryKey: ["accessRequests"] });
      qc.invalidateQueries({ queryKey: ["adminStudentRoster"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update request");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section>
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-display font-semibold">Student access requests</h1>
        {requests.length > 0 && (
          <span className="rounded-full bg-warning/15 text-warning-foreground border border-warning/30 px-2 py-0.5 text-xs">
            {requests.length} pending
          </span>
        )}
      </div>
      <div className="mt-4 space-y-3">
        {requests.map((r: any) => (
          <div key={r.id} className="rounded-2xl border bg-card p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-medium inline-flex items-center gap-2">
                {r.display_name ?? "Unnamed student"}
                {r.requested_role === "admin" && (
                  <span className="rounded-full border border-primary/40 bg-primary/10 text-primary px-2 py-0.5 text-xs">Admin request</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {r.email} · requested {new Date(r.access_requested_at).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" disabled={busyId === r.id} onClick={() => decide(r.id, "approved")}>
                Approve as student
              </Button>
              <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => decide(r.id, "approved", true)}>
                Approve as admin
              </Button>
              <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => decide(r.id, "denied")}>
                Deny
              </Button>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No pending access requests.
          </div>
        )}
      </div>
    </section>
  );
}

function ManageAdmins() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ["manageAdmins"],
    queryFn: async () => {
      const [{ data: people }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("id, display_name, email, access_status").order("display_name"),
        supabase.from("user_roles").select("user_id, role").eq("role", "admin"),
      ]);
      const admins = new Set((roles ?? []).map((r: any) => r.user_id));
      return (people ?? []).map((p: any) => ({ ...p, isAdmin: admins.has(p.id) }));
    },
  });
  const q = search.trim().toLowerCase();
  const rows = (data ?? []).filter(
    (p: any) => !q || (p.display_name ?? "").toLowerCase().includes(q) || (p.email ?? "").toLowerCase().includes(q),
  );

  const makeAdmin = async (id: string, name: string) => {
    if (!confirm(`Give ${name} full admin access?`)) return;
    setBusyId(id);
    let error: any = null;
    try { await grantAdminAccess({ data: { userId: id } }); } catch (e) { error = e; }
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success(`${name} is now an admin.`);
    qc.invalidateQueries({ queryKey: ["manageAdmins"] });
    qc.invalidateQueries({ queryKey: ["accessRequests"] });
  };

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-display font-semibold">Manage admins</h2>
      <p className="text-sm text-muted-foreground mt-1">Give an existing user admin access.</p>
      <Input className="mt-3 max-w-sm" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="mt-3 rounded-2xl border bg-card divide-y max-h-96 overflow-y-auto">
        {rows.map((p: any) => (
          <div key={p.id} className="p-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium text-sm">{p.display_name ?? "Unnamed"}</div>
              <div className="text-xs text-muted-foreground">{p.email}</div>
            </div>
            {p.isAdmin ? (
              <span className="rounded-full border border-primary/40 bg-primary/10 text-primary px-2 py-0.5 text-xs">Admin</span>
            ) : (
              <Button size="sm" variant="outline" disabled={busyId === p.id} onClick={() => makeAdmin(p.id, p.display_name ?? p.email ?? "this user")}>
                Make admin
              </Button>
            )}
          </div>
        ))}
        {rows.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No users found.</div>}
      </div>
    </section>
  );
}

function ProgressSheetPanel() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; downloadUrl: string; rowCount: number } | null>(null);

  const sync = async () => {
    setBusy(true);
    try {
      const r = (await syncProgressSheet()) as any;
      setResult(r);
      toast.success(`Synced ${r.rowCount} approved submission${r.rowCount === 1 ? "" : "s"} to Google Sheets.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not sync the progress sheet");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-10 rounded-2xl border bg-card p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-display font-semibold inline-flex items-center gap-2">
            <Sheet className="w-5 h-5 text-primary" /> Student progress export
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Every approved submission is written to a private Google Sheet — one row per student per assignment, with
            scores, dates and project links. Staff only; students never see it.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={sync} disabled={busy}>
            <RefreshCw className={`w-4 h-4 mr-1 ${busy ? "animate-spin" : ""}`} />
            {busy ? "Syncing…" : "Sync now"}
          </Button>
          {result && (
            <>
              <Button size="sm" variant="outline" asChild>
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" /> Open
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={result.downloadUrl}>
                  <Download className="w-4 h-4 mr-1" /> Download
                </a>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
