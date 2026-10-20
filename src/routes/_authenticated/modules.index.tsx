import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { modulesQO } from "@/lib/queries";
import { PlatformLogo } from "@/components/PlatformLogo";

export const Route = createFileRoute("/_authenticated/modules/")({
  component: ModulesPage,
});

function ModulesPage() {
  const { data: modules = [] } = useQuery(modulesQO);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div>
        <h1 className="text-3xl font-display font-semibold">Course modules</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl">
          In this course you'll design and pitch your own AI-powered mobile app from start to finish.
          You'll set up GitHub, plan your idea with ChatGPT and Claude, research it in Gemini Notebook,
          map it visually in NapkinAI, build your brand in Adobe Firefly and Canva AI, prototype the app
          in Replit, launch a marketing site in Lovable, and present it all in Gamma — using only free
          tools, with every step adding a real project to your portfolio.
        </p>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {modules.map((m: any) => {
          const optional =
            (m.assignments?.length ?? 0) > 0 && m.assignments.every((a: any) => (a.points ?? 0) === 0);
          return (
          <Link
            key={m.id}
            to="/modules/$slug"
            params={{ slug: m.slug }}
            className={`group rounded-2xl border bg-card p-5 hover:border-primary/40 transition ${optional ? "border-dashed" : ""}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Module {m.order_index}
              </span>
              <div className="flex items-center gap-2">
                <PlatformLogo platform={m.platform} size={64} />
                <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">
                  {m.platform}
                </span>
              </div>
            </div>
            {optional && (
              <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-wide rounded-full bg-accent text-accent-foreground px-2.5 py-1">
                Optional · Extra credit
              </span>
            )}
            <h2 className="font-display text-xl font-semibold mt-2 group-hover:text-primary">
              {m.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.description}</p>
            {optional && (
              <p className="text-sm font-medium text-foreground mt-2">
                This module is completely optional — not required and not scored.
              </p>
            )}
            <div className="mt-4 text-xs text-muted-foreground">
              {m.assignments?.length ?? 0} assignments
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
