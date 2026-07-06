import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/api/public/verify-github")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => ({}));
        const parsed = z.object({ url: z.string().url().max(500) }).safeParse(body);
        if (!parsed.success) {
          return Response.json({ ok: false, errors: ["Please provide a valid URL."] }, { status: 400 });
        }
        const m = parsed.data.url.match(/^https?:\/\/github\.com\/([^\/\s]+)\/([^\/\s#?]+?)(?:\.git)?\/?(?:[?#].*)?$/i);
        if (!m) {
          return Response.json({ ok: false, errors: ["URL must look like https://github.com/owner/repo"] });
        }
        const [, owner, name] = m;
        try {
          const repoRes = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
            headers: { Accept: "application/vnd.github+json", "User-Agent": "tech-pathways-academy" },
          });
          if (repoRes.status === 404) {
            return Response.json({ ok: false, errors: ["Repository not found or is private."] });
          }
          if (!repoRes.ok) {
            return Response.json({ ok: false, errors: [`GitHub API error (${repoRes.status}). Try again shortly.`] });
          }
          const repo = await repoRes.json() as any;
          if (repo.private) {
            return Response.json({ ok: false, errors: ["Repository is private. Make it public before submitting."] });
          }
          const errors: string[] = [];
          if (repo.size === 0) errors.push("Repository is empty. Add at least a README.");

          const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${name}/readme`, {
            headers: { Accept: "application/vnd.github+json", "User-Agent": "tech-pathways-academy" },
          });
          const hasReadme = readmeRes.ok;
          if (!hasReadme) errors.push("No README.md found. Add a README describing your project.");

          return Response.json({
            ok: errors.length === 0,
            errors,
            repo: {
              owner: repo.owner?.login,
              name: repo.name,
              description: repo.description,
              html_url: repo.html_url,
              language: repo.language,
              stars: repo.stargazers_count,
              pushed_at: repo.pushed_at,
              is_public: !repo.private,
              has_readme: hasReadme,
              is_empty: repo.size === 0,
            },
          });
        } catch (e) {
          return Response.json({ ok: false, errors: ["Could not reach GitHub. Try again shortly."] }, { status: 502 });
        }
      },
    },
  },
});
