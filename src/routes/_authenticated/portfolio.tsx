import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { meProfileQO } from "@/lib/queries";
import { Github, ExternalLink, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/portfolio")({
  component: PortfolioPage,
});

function PortfolioPage() {
  const { user } = useAuth();
  const profile = useQuery(meProfileQO(user?.id ?? null));

  const { data: projects = [] } = useQuery({
    queryKey: ["myApprovedProjects", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*, assignments(title,platform,skills,modules(title,slug)), submission_artifacts(*), github_repo_snapshots(*)")
        .eq("student_id", user!.id)
        .eq("status", "approved")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-display font-semibold">Your AI Portfolio</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profile.data?.portfolio_public ? (
              <>Public at <Link to="/u/$username" params={{ username: profile.data?.github_username ?? user!.id }} className="text-primary hover:underline">/u/{profile.data?.github_username ?? "your-username"}</Link></>
            ) : (
              <>Private — flip on public portfolio in <Link to="/profile" className="text-primary hover:underline">Profile</Link> to share.</>
            )}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {projects.map((p: any) => <ProjectCard key={p.id} project={p} />)}
        {projects.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            No approved projects yet. Submit an assignment to start building your portfolio.
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: any }) {
  const snap = project.github_repo_snapshots;
  const live = project.submission_artifacts?.find((a: any) => a.kind === "github_pages" || a.kind === "live_url" || a.kind === "replit");
  const repo = project.submission_artifacts?.find((a: any) => a.kind === "github_repo");
  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col">
      <div className="text-xs text-muted-foreground">{project.assignments?.platform} · {project.assignments?.modules?.title}</div>
      <h3 className="font-display font-semibold text-lg mt-1">{project.assignments?.title}</h3>
      {snap && (
        <div className="mt-2 text-sm">
          <div className="font-medium">{snap.repo_owner}/{snap.repo_name}</div>
          {snap.description && <div className="text-muted-foreground text-xs">{snap.description}</div>}
        </div>
      )}
      {project.assignments?.skills?.length ? (
        <div className="mt-3 flex flex-wrap gap-1">
          {project.assignments.skills.map((s: string) => <span key={s} className="text-[10px] rounded-full border px-2 py-0.5">{s}</span>)}
        </div>
      ) : null}
      <div className="mt-auto pt-4 flex gap-2">
        {repo?.url && <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-xs inline-flex items-center gap-1 rounded-full border px-2.5 py-1 hover:bg-muted"><Github className="w-3 h-3" /> Repo</a>}
        {live?.url && <a href={live.url} target="_blank" rel="noopener noreferrer" className="text-xs inline-flex items-center gap-1 rounded-full border px-2.5 py-1 hover:bg-muted"><ExternalLink className="w-3 h-3" /> Live</a>}
        {project.featured && <span className="text-xs inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-2.5 py-1"><Star className="w-3 h-3" /> Featured</span>}
      </div>
    </div>
  );
}
