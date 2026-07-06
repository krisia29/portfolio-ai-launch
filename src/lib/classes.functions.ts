import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const codeSchema = z.object({ code: z.string().trim().min(1).max(32) });

/**
 * Join a class by its join code.
 *
 * Runs server-side under the caller's Supabase session so that RLS still
 * applies to the class_members insert. Uses the service role only to look up
 * the class by code — we intentionally don't grant "SELECT everything" on
 * classes to authenticated users, since that would leak every join code and
 * roster to any signed-in student.
 */
export const joinClassByCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => codeSchema.parse(data))
  .handler(async ({ data, context }) => {
    const normalized = data.code.trim().toUpperCase();

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: cls, error: lookupError } = await supabaseAdmin
      .from("classes")
      .select("id, archived")
      .eq("join_code", normalized)
      .maybeSingle();
    if (lookupError) throw new Error("Lookup failed");
    if (!cls || cls.archived) throw new Error("Invalid class code.");

    // Insert as the authenticated user so RLS on class_members applies.
    const { error: insertError } = await context.supabase
      .from("class_members")
      .insert({ class_id: cls.id, student_id: context.userId });
    if (insertError && !insertError.message.toLowerCase().includes("duplicate")) {
      throw new Error(insertError.message);
    }
    return { classId: cls.id };
  });
