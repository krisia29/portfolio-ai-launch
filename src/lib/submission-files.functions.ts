import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Read-only download, using the existing storage policies as the caller. */
export const downloadSubmissionFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ path: z.string().min(1).max(2048) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: file, error } = await context.supabase.storage
      .from("submission-screenshots")
      .download(data.path);
    if (error || !file) throw new Error("This file could not be opened. Please try again.");
    return new Response(file, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  });