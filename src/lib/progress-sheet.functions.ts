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
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    if (!isAdmin) throw new Error("Only admins can generate the progress report.");

    const { syncApprovedProgress } = await import("./progress-sheet.server");
    return await syncApprovedProgress();
  });

/** Called after a student submits, so the report updates right away. Returns nothing. */
export const syncAfterSubmit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Only run for a caller who actually just submitted work.
    const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recent } = await context.supabase
      .from("submissions")
      .select("id")
      .eq("student_id", context.userId)
      .eq("status", "submitted")
      .gte("submitted_at", since)
      .limit(1);
    if (!recent?.length) return { ok: false };
    const { syncApprovedProgress } = await import("./progress-sheet.server");
    await syncApprovedProgress();
    return { ok: true };
  });
