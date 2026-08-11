import { useQuery } from "@tanstack/react-query";
import { Clock, ShieldX } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { meProfileQO } from "@/lib/queries";
import { Button } from "@/components/ui/button";

/**
 * Students must be approved by an instructor before they can use the course.
 * Staff (teacher/admin) always pass, including while previewing as a student.
 */
export function AccessGate({ children }: { children: React.ReactNode }) {
  const { user, loading, actualIsStaff, signOut } = useAuth();
  const profile = useQuery(meProfileQO(user?.id ?? null));

  if (loading || !user) return <>{children}</>;
  if (actualIsStaff) return <>{children}</>;
  if (profile.isLoading || !profile.data) return <>{children}</>;

  const status = (profile.data as any).access_status as string | undefined;
  if (!status || status === "approved") return <>{children}</>;

  const denied = status === "denied";

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-2xl border bg-card p-8 text-center">
        <span className="mx-auto grid place-items-center w-12 h-12 rounded-2xl bg-primary/10 text-primary">
          {denied ? <ShieldX className="w-6 h-6 text-destructive" /> : <Clock className="w-6 h-6" />}
        </span>
        <h1 className="mt-4 text-2xl font-display font-semibold">
          {denied ? "Access not approved" : "Access request pending"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {denied
            ? "Your request to join as a student wasn't approved. Please contact your instructor if you think this is a mistake."
            : "Thanks for signing up! Your instructor needs to approve your request before you can start the coursework. You'll get access as soon as it's approved — try signing back in later."}
        </p>
        <Button variant="outline" className="mt-6" onClick={signOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
