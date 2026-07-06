import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function AppHeader() {
  const { user, isStaff, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: "/" });
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="w-4 h-4" />
          </span>
          <span>Tech Pathways Academy</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {user ? (
            <>
              <Link to="/dashboard" className="px-3 py-2 rounded-md hover:bg-muted">Dashboard</Link>
              <Link to="/modules" className="px-3 py-2 rounded-md hover:bg-muted">Modules</Link>
              <Link to="/portfolio" className="px-3 py-2 rounded-md hover:bg-muted">Portfolio</Link>
              <Link to="/classes" className="px-3 py-2 rounded-md hover:bg-muted">Classes</Link>
              {isStaff && (
                <Link to="/admin" className="px-3 py-2 rounded-md hover:bg-muted">Admin</Link>
              )}
              <Link to="/profile" className="px-3 py-2 rounded-md hover:bg-muted">Profile</Link>
              <Button size="sm" variant="ghost" onClick={handleSignOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/auth" className="px-3 py-2 rounded-md hover:bg-muted">Sign in</Link>
              <Button asChild size="sm">
                <Link to="/auth">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
