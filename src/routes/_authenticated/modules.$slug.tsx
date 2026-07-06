import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";
import { glossary } from "@/lib/glossary";

export const Route = createFileRoute("/_authenticated/modules/$slug")({
  component: ModuleDetail,
});

function ModuleDetail() {
  const { slug } = Route.useParams();
  const { data: module } = useQuery({
    queryKey: ["module", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*, assignments(*)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (!module) return <div className="mx-auto max-w-4xl px-4 py-10 text-muted-foreground">Loading…</div>;

  const isGlossary = module.slug === "glossary";
  const assignments = (module.assignments ?? []).filter((a: any) => a.status === "published");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/modules" className="text-sm text-primary hover:underline">← All modules</Link>
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Module {module.order_index}</span>
        {module.platform && (
          <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">{module.platform}</span>
        )}
      </div>
      <h1 className="text-3xl font-display font-semibold mt-2">{module.title}</h1>
      {module.description && <p className="text-muted-foreground mt-2">{module.description}</p>}
      {module.official_url && (
        <a href={module.official_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          Official site <ExternalLink className="w-3 h-3" />
        </a>
      )}

      {isGlossary ? (
        <div className="mt-8 space-y-10">
          {glossary.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-display font-semibold">{section.title}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {section.terms.map(({ term, definition, icon: Icon }) => (
                  <div key={term} className="rounded-2xl border bg-card p-4 flex gap-3">
                    <span className="grid place-items-center w-9 h-9 shrink-0 rounded-xl bg-primary/10 text-primary">
                      <Icon className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-semibold">{term}</div>
                      <p className="text-sm text-muted-foreground mt-1">{definition}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <>
          <h2 className="mt-8 text-xl font-display font-semibold">Assignments</h2>
          <div className="mt-4 space-y-3">
            {assignments.map((a: any) => (
              <Link
                key={a.id}
                to="/assignments/$id"
                params={{ id: a.id }}
                className="block rounded-xl border bg-card p-5 hover:border-primary/40 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{a.objectives}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{a.difficulty}</span>
                      <span>·</span>
                      <span>~{a.est_minutes} min</span>
                      <span>·</span>
                      <span>{a.points} pts</span>
                      {a.requires_github && (<><span>·</span><span className="text-primary">GitHub required</span></>)}
                    </div>
                  </div>
                  <span className="text-sm text-primary">Open →</span>
                </div>
              </Link>
            ))}
            {assignments.length === 0 && <div className="text-sm text-muted-foreground">No assignments yet.</div>}
          </div>
        </>
      )}
    </div>
  );
}
