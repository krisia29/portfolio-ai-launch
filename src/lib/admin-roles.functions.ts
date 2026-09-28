import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const grantAdminAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: role } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw new Error("Only admins can grant admin access");

    const { error: e1 } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: data.userId, role: "admin" }, { onConflict: "user_id,role", ignoreDuplicates: true });
    if (e1) throw new Error(e1.message);
    const { error: e2 } = await supabaseAdmin
      .from("profiles")
      .update({
        access_status: "approved",
        access_decided_at: new Date().toISOString(),
        access_decided_by: context.userId,
        requested_role: "admin",
      } as any)
      .eq("id", data.userId);
    if (e2) throw new Error(e2.message);
    return { ok: true };
  });
