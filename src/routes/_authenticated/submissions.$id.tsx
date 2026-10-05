import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SubmissionEvidence } from "@/components/SubmissionEvidence";
import { ExternalLink, Github } from "lucide-react";

export const Route = createFileRoute("/_authenticated/submissions/$id")({
  head: () => ({
    meta: [
      { title: "Student submission — Tech Pathways Academy" },
      { name: "description", content: "Review a single student's submitted work." },
      { property: "og:title", content: "Student submission — Tech Pathways Academy" },
      { property: "og:description", content: "Review a single student's submitted work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SubmissionPage,
});

function SubmissionPage() {
  const { id } = Route.useParams();
  const { isStaff, loading } = useAuth() as any;
  const { data, isLoading } = useQuery({
    queryKey: ["submission", id],
    enabled: !loading,
    queryFn: async () => {
      const { data: s, error } = await supabase
        .from("submissions")
        .select("*, assignments(title,points,platform,modules(title)), submission_artifacts(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!s) return null;
      const [{ data: p }, { data: prog }] = await Promise.all([
        supabase.from("profiles").select("display_name,email").eq("id", s.student_id).maybeSingle(),
        supabase
          .from("assignment_progress")
          .select("evidence")
          .eq("student_id", s.student_id)
          .eq("assignment_id", s.assignment_id)
          .maybeSingle(),
      ]);
      return { ...s, profile: p, evidence: (prog as any)?.evidence ?? {} } as any;
    },
  });

  if (isLoading || loading) return <div className="p-10 text-sm text-muted-foreground">Loading…</div>;
  if (!data) return <div className="p-10 text-sm text-muted-foreground">This submission isn't available.</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {isStaff && <Link to="/admin" className="text-sm text-primary hover:underline">← Back to review</Link>}
      <div className="mt-3 text-xs text-muted-foreground">
        {data.assignments?.modules?.title} · {data.assignments?.platform}
      </div>
      <h1 className="text-2xl font-display font-semibold">{data.assignments?.title}</h1>
      <div className="text-sm text-muted-foreground mt-1">
        {data.profile?.display_name ?? "Student"} {data.profile?.email ? `· ${data.profile.email}` : ""}
      </div>
      <div className="text-sm mt-2">
        Status: <span className="font-medium">{String(data.status).replace("_", " ")}</span>
        {data.score != null && <> · Score {data.score}/{data.assignments?.points}</>}
        {" · "}Submitted {new Date(data.submitted_at).toLocaleString()}
      </div>
      <div className="mt-3 flex gap-2 flex-wrap text-xs">
        {(data.submission_artifacts ?? []).filter((a: any) => a.url).map((a: any) => (
          <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 hover:bg-muted">
            {a.kind === "github_repo" ? <Github className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />} {a.url}
          </a>
        ))}
      </div>
      <SubmissionEvidence evidence={data.evidence} />
      {data.reflection_md && (
        <div className="mt-4 text-sm">
          <div className="text-xs font-semibold text-muted-foreground">Reflection</div>
          <div className="mt-1 whitespace-pre-wrap">{data.reflection_md}</div>
        </div>
      )}
      {data.feedback_md && (
        <div className="mt-4 text-sm">
          <div className="text-xs font-semibold text-muted-foreground">Feedback</div>
          <div className="mt-1 whitespace-pre-wrap">{data.feedback_md}</div>
        </div>
      )}
    </div>
  );
}
