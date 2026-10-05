import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Rebuild the admin-only Google Sheet of student submissions. */
export const syncProgressSheet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    const isStaff = (roles ?? []).some((r) => r.role === "teacher" || r.role === "admin");
    if (!isStaff) throw new Error("Only instructors and admins can export student progress.");

    const { syncApprovedProgress } = await import("./progress-sheet.server");
    return await syncApprovedProgress();
  });

/** Called after a student submits, so the report updates right away. Returns nothing. */
export const syncAfterSubmit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { syncApprovedProgress } = await import("./progress-sheet.server");
    await syncApprovedProgress();
    return { ok: true };
  });
