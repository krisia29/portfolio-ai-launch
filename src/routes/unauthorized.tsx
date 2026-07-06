import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({
    meta: [
      { title: "Access denied — Tech Pathways Academy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="mt-5 text-2xl font-display font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You don't have permission to view this page. If you think this is a mistake, ask your instructor to check your account role.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Back to my dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
