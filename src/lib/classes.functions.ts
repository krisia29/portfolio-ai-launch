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

const importSchema = z.object({
  classId: z.string().uuid(),
  emails: z.array(z.string().trim().toLowerCase().email()).min(1).max(500),
});

/**
 * Bulk-enroll students in a class by email. Staff-only.
 * Resolves emails to auth users via service role, then inserts class_members
 * as the caller (RLS `class_members_staff_manage` allows it).
 */
export const importStudentsToClass = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => importSchema.parse(data))
  .handler(async ({ data, context }) => {
    // Verify caller is staff (teacher/admin).
    const { data: roleRows } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (roleRows ?? []).map((r) => r.role as string);
    const isStaff = roles.includes("teacher") || roles.includes("admin");
    const isAdmin = roles.includes("admin");
    if (!isStaff) throw new Error("Forbidden");

    // Verify caller owns the class (or is admin).
    const { data: cls, error: clsErr } = await context.supabase
      .from("classes")
      .select("id, teacher_id")
      .eq("id", data.classId)
      .maybeSingle();
    if (clsErr || !cls) throw new Error("Class not found");
    if (!isAdmin && cls.teacher_id !== context.userId) throw new Error("Forbidden");

    const emails = Array.from(new Set(data.emails.map((e) => e.toLowerCase())));

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profs, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .in("email", emails);
    if (profErr) throw new Error(profErr.message);

    const found = new Map<string, string>();
    for (const p of profs ?? []) if (p.email) found.set(p.email.toLowerCase(), p.id);
    const notFound = emails.filter((e) => !found.has(e));

    let added = 0;
    if (found.size > 0) {
      const rows = Array.from(found.values()).map((student_id) => ({
        class_id: data.classId,
        student_id,
      }));
      const { error: insErr, count } = await supabaseAdmin
        .from("class_members")
        .upsert(rows, { onConflict: "class_id,student_id", ignoreDuplicates: true, count: "exact" });
      if (insErr) throw new Error(insErr.message);
      added = count ?? rows.length;
    }

    return { added, notFound };
  });

