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
        <p className="text-muted-foreground mt-1">
          Pick any module to start — explore in the order that inspires you.
        </p>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {modules.map((m: any) => (
          <Link
            key={m.id}
            to="/modules/$slug"
            params={{ slug: m.slug }}
            className="group rounded-2xl border bg-card p-5 hover:border-primary/40 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Module {m.order_index}
              </span>
              <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">
                {m.platform}
              </span>
            </div>
            <h2 className="font-display text-xl font-semibold mt-2 group-hover:text-primary">
              {m.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.description}</p>
            <div className="mt-4 text-xs text-muted-foreground">
              {m.assignments?.length ?? 0} assignments
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
