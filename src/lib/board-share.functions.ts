import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getBoardShareToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ boardId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const staff = (roles ?? []).some((r: any) => r.role === "admin" || r.role === "teacher");
    if (!staff) throw new Error("Only staff can share boards");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: b } = await (supabaseAdmin as any)
      .from("whiteboards")
      .select("share_token")
      .eq("id", data.boardId)
      .maybeSingle();
    return { token: (b?.share_token as string) ?? null };
  });
