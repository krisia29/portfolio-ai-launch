import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "./_authenticated/portfolio";
import { Github } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/u/$username")({
  loader: async ({ params }) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, display_name, nickname, avatar_url, github_username, github_profile_url, portfolio_public")
      .ilike("github_username", params.username)
      .eq("portfolio_public", true)
      .maybeSingle();
    if (!profile) throw notFound();
    const { data: projects } = await supabase
      .from("submissions")
      .select("*, assignments(title,platform,skills,modules(title,slug)), submission_artifacts(*), github_repo_snapshots(*)")
      .eq("student_id", profile.id)
      .eq("status", "approved")
      .order("submitted_at", { ascending: false });
    return { profile, projects: projects ?? [] };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Portfolio not found" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.profile.display_name ?? loaderData.profile.github_username}'s AI Portfolio`;
    return {
      meta: [
        { title },
        { name: "description", content: "AI Portfolio built with Tech Pathways Academy." },
        { property: "og:title", content: title },
        { property: "og:description", content: "AI Portfolio built with Tech Pathways Academy." },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: PublicPortfolio,
});

function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-display font-semibold">Portfolio not available</h1>
        <p className="text-muted-foreground mt-2">This portfolio isn't public, or the username doesn't exist.</p>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">← Home</Link>
      </div>
    </div>
  );
}

function PublicPortfolio() {
  const { profile, projects } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center gap-4">
          {profile.avatar_url && <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full border" />}
          <div>
            <h1 className="text-3xl font-display font-semibold">{profile.display_name ?? profile.github_username}</h1>
            <p className="text-muted-foreground">AI Portfolio</p>
            {profile.github_username && (
              <a
                href={`https://github.com/${profile.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Github className="w-3.5 h-3.5" /> @{profile.github_username}
              </a>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {projects.map((p: any) => <ProjectCard key={p.id} project={p} />)}
          {projects.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              No approved projects yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
