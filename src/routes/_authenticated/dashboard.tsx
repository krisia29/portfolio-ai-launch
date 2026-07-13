import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { modulesQO, mySubmissionsQO, myClassesQO, meProfileQO } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";
import { Github, GraduationCap, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user, isStaff, isAdmin, loading } = useAuth();
  if (loading || !user) {
    return <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">Loading…</div>;
  }
  return isStaff ? <StaffDash userId={user.id} isAdmin={isAdmin} /> : <StudentDash userId={user.id} />;
}


function StatCard({ label, value, hint, icon }: { label: string; value: string | number; hint?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon}
      </div>
      <div className="mt-2 text-3xl font-display font-semibold">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

function StudentDash({ userId }: { userId: string }) {
  const modules = useQuery(modulesQO);
  const subs = useQuery(mySubmissionsQO(userId));
  const classes = useQuery(myClassesQO(userId));
  const profile = useQuery(meProfileQO(userId));

  const totalAssignments = (modules.data ?? []).reduce((n, m: any) => n + (m.assignments?.filter((a: any) => a.status === "published").length ?? 0), 0);
  const approved = (subs.data ?? []).filter((s: any) => s.status === "approved").length;
  const submitted = (subs.data ?? []).length;
  const reposApproved = (subs.data ?? []).filter((s: any) => s.status === "approved" && s.github_repo_snapshots?.repo_name).length;
  const liveSites = (subs.data ?? []).filter((s: any) => s.submission_artifacts?.some((a: any) => a.kind === "github_pages" || a.kind === "live_url" || a.kind === "replit")).length;
  const progressPct = totalAssignments ? Math.round((approved / totalAssignments) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h1 className="text-3xl font-display font-semibold">
          Welcome{profile.data?.display_name ? `, ${profile.data.display_name}` : ""}
        </h1>
        <Link to="/modules" className="text-sm text-primary hover:underline">Continue learning →</Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard label="Progress" value={`${progressPct}%`} hint={`${approved}/${totalAssignments} approved`} icon={<GraduationCap className="w-4 h-4 text-primary" />} />
        <StatCard label="Submissions" value={submitted} hint={`${approved} approved`} icon={<CheckCircle2 className="w-4 h-4 text-success" />} />
        <StatCard label="GitHub repos" value={reposApproved} hint="Verified in portfolio" icon={<Github className="w-4 h-4" />} />
        <StatCard label="Live sites / apps" value={liveSites} hint="Deployed projects" icon={<Sparkles className="w-4 h-4 text-primary" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recent submissions</h2>
            <Link to="/portfolio" className="text-sm text-primary hover:underline">Portfolio →</Link>
          </div>
          <div className="mt-4 divide-y">
            {(subs.data ?? []).slice(0, 6).map((s: any) => (
              <div key={s.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{s.assignments?.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.assignments?.platform} · Submitted {new Date(s.submitted_at).toLocaleDateString()}
                  </div>
                </div>
                <StatusPill status={s.status} />
              </div>
            ))}
            {(!subs.data || subs.data.length === 0) && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No submissions yet. <Link to="/modules" className="text-primary hover:underline">Start your first assignment</Link>.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Your classes</h2>
          <div className="mt-3 space-y-2">
            {(classes.data ?? []).map((c: any) => (
              <div key={c.class_id} className="rounded-lg border p-3">
                <div className="font-medium">{c.classes?.name}</div>
                <div className="text-xs text-muted-foreground">{c.classes?.period ?? ""}</div>
              </div>
            ))}
            {(!classes.data || classes.data.length === 0) && (
              <div className="text-sm text-muted-foreground">Join a class with a code from your teacher.</div>
            )}
          </div>
          <Link to="/classes" className="mt-3 inline-block text-sm text-primary hover:underline">Manage classes →</Link>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    submitted: "bg-warning/15 text-warning-foreground border-warning/30",
    approved: "bg-success/15 text-success border-success/30",
    revision_requested: "bg-destructive/10 text-destructive border-destructive/30",
    draft: "bg-muted text-muted-foreground border-border",
  };
  return <span className={`px-2 py-0.5 text-xs rounded-full border ${map[status] ?? map.draft}`}>{status.replace("_", " ")}</span>;
}

function StaffDash({ userId: _userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const [studentsOpen, setStudentsOpen] = useState(false);
  const stats = useQuery({
    queryKey: ["staffStats"],
    queryFn: async () => {
      const [{ count: students }, { count: pending }, { count: approved }, { count: classes }] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("submissions").select("id", { count: "exact", head: true }).eq("status", "submitted"),
        supabase.from("submissions").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("classes").select("id", { count: "exact", head: true }),
      ]);
      return { students: students ?? 0, pending: pending ?? 0, approved: approved ?? 0, classes: classes ?? 0 };
    },
  });

  const studentsValue = stats.data?.students ?? "—";
  const studentsCard = (
    <StatCard
      label="Students"
      value={studentsValue}
      hint={isAdmin ? "Click to view roster" : undefined}
    />
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-display font-semibold">Instructor dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {isAdmin ? (
          <button
            type="button"
            onClick={() => setStudentsOpen(true)}
            className="text-left rounded-2xl transition hover:ring-2 hover:ring-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="View student roster"
          >
            {studentsCard}
          </button>
        ) : (
          studentsCard
        )}
        <StatCard label="Pending reviews" value={stats.data?.pending ?? "—"} icon={<Clock className="w-4 h-4 text-warning" />} />
        <StatCard label="Approved" value={stats.data?.approved ?? "—"} icon={<CheckCircle2 className="w-4 h-4 text-success" />} />
        <StatCard label="Classes" value={stats.data?.classes ?? "—"} />
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/admin" className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">Review submissions</Link>
        <Link to="/classes" className="rounded-lg border px-4 py-2 text-sm font-medium">Manage classes</Link>
        <Link to="/modules" className="rounded-lg border px-4 py-2 text-sm font-medium">Course content</Link>
      </div>
      {isAdmin && <StudentRosterDialog open={studentsOpen} onOpenChange={setStudentsOpen} />}
    </div>
  );
}

function StudentRosterDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState("");
  const roster = useQuery({
    queryKey: ["adminStudentRoster"],
    enabled: open,
    queryFn: async () => {
      // Only students: exclude anyone with a staff role.
      const { data: staffRoles, error: rolesErr } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("role", ["teacher", "admin"]);
      if (rolesErr) throw rolesErr;
      const staffIds = new Set((staffRoles ?? []).map((r: any) => r.user_id));

      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, email")
        .order("display_name", { ascending: true });
      if (error) throw error;
      return (data ?? []).filter((p: any) => !staffIds.has(p.id));
    },
  });

  const term = q.trim().toLowerCase();
  const filtered = (roster.data ?? []).filter((p: any) => {
    if (!term) return true;
    return (
      (p.display_name ?? "").toLowerCase().includes(term) ||
      (p.email ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student roster</DialogTitle>
          <DialogDescription>
            All enrolled students, including those who haven't submitted yet.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Search by name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mt-2"
        />
        <div className="mt-3 max-h-[60vh] overflow-y-auto rounded-lg border divide-y">
          {roster.isLoading && (
            <div className="p-4 text-sm text-muted-foreground">Loading…</div>
          )}
          {roster.error && (
            <div className="p-4 text-sm text-destructive">Failed to load roster.</div>
          )}
          {!roster.isLoading && !roster.error && filtered.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">No students found.</div>
          )}
          {filtered.map((p: any) => (
            <div key={p.id} className="p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{p.display_name ?? "Unnamed student"}</div>
                <div className="text-xs text-muted-foreground truncate">{p.email ?? "—"}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {filtered.length} student{filtered.length === 1 ? "" : "s"}
        </div>
      </DialogContent>
    </Dialog>
  );
}

