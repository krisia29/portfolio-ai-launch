import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { canManageClasses, renameClassSchema, studentStageSchema } from "./class-management";

export const renameClass = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => renameClassSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: roles, error: roleError } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (roleError || !canManageClasses((roles ?? []).map((row) => row.role))) throw new Error("Only admins can rename classes.");
    const { data: row, error } = await context.supabase.from("classes").update({ name: data.name }).eq("id", data.classId).select("id").single();
    if (error || !row) throw new Error("Unable to rename this class.");
    return { id: row.id };
  });

export const getClassRoster = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ classId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: roles, error: roleError } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (roleError || !canManageClasses((roles ?? []).map((row) => row.role))) throw new Error("Only admins can manage student stages.");
    const { data: members, error } = await context.supabase.from("class_members").select("student_id, stage, stage_changed_on").eq("class_id", data.classId);
    if (error) throw new Error("Unable to load students.");
    if (!members?.length) return [];
    const { data: profiles, error: profileError } = await context.supabase.from("profiles").select("id, display_name, email").in("id", members.map((member) => member.student_id));
    if (profileError) throw new Error("Unable to load student details.");
    return members.map((member) => {
      const profile = profiles?.find((row) => row.id === member.student_id);
      return { ...member, name: profile?.display_name ?? "", email: profile?.email ?? "" };
    }).sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));
  });

export const updateStudentStage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => studentStageSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: roles, error: roleError } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (roleError || !canManageClasses((roles ?? []).map((row) => row.role))) throw new Error("Only admins can change student stages.");
    const { data: row, error } = await context.supabase.from("class_members").update({ stage: data.stage, stage_changed_on: data.changedOn }).eq("class_id", data.classId).eq("student_id", data.studentId).select("student_id").single();
    if (error || !row) throw new Error("Unable to save the student stage.");
    return { studentId: row.student_id };
  });