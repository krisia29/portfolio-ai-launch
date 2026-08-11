import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { PreviewModeBanner } from "@/components/PreviewModeBanner";
import { AccessGate } from "@/components/AccessGate";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <PreviewModeBanner />
      <AccessGate>
        <Outlet />
      </AccessGate>
    </div>
  ),
});
