import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Github, Rocket, Award, Sparkles, BookOpen, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

const platforms = [
  "ChatGPT",
  "Claude",
  "Canva AI",
  "NotebookLM",
  "NapkinAI",
  "Gamma",
  "Adobe Firefly",
  "Replit",
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,var(--accent)_0%,transparent_45%),radial-gradient(circle_at_80%_60%,color-mix(in_oklab,var(--primary)_15%,transparent)_0%,transparent_50%)] pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Student AI curriculum + portfolio
          </span>
          <h1 className="mt-6 text-5xl sm:text-6xl font-display font-bold tracking-tight max-w-3xl mx-auto">
            Learn AI by building things you can <span className="text-primary">actually share</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Every assignment produces a real project on GitHub. Graduate with a portfolio that stands up
            to college admissions, scholarships, internships, and employers.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/auth">Start free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/modules">Browse the course</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            All coursework uses free tools. No paid subscriptions required.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Github className="w-5 h-5" />,
              title: "Publish, don't just submit",
              body: "Assignments push you to a public GitHub repo, deploy a live site, and write a real README.",
            },
            {
              icon: <BookOpen className="w-5 h-5" />,
              title: "Ten guided modules",
              body: "From GitHub Fundamentals to Replit deployments, plus a full responsible-AI foundation.",
            },
            {
              icon: <Award className="w-5 h-5" />,
              title: "A portfolio that grows",
              body: "Verified GitHub repos, live URLs, reflections, and badges assemble into a shareable portfolio.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6">
              <div className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                {f.icon}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border bg-card p-8 md:p-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Rocket className="w-4 h-4 text-primary" /> Tools you'll master
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {platforms.map((p) => (
              <span
                key={p}
                className="inline-flex items-center rounded-full border bg-background px-3 py-1.5 text-sm font-medium"
              >
                {p}
              </span>
            ))}
          </div>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> For students
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Track progress, unlock modules, earn badges.</li>
                <li>• Add your GitHub username and get repo verification.</li>
                <li>• Publish a personal portfolio page you can share anywhere.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> For instructors
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Create classes with join codes, review submissions, leave feedback.</li>
                <li>• Duplicate, publish, and archive assignments.</li>
                <li>• Monitor GitHub publishing across your students.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between text-sm text-muted-foreground">
          <span>© Tech Pathways Academy</span>
          <span>Built for AI classrooms.</span>
        </div>
      </footer>
    </div>
  );
}
