import { z } from "zod";

export const studentStages = ["Active", "Completed", "Dropped", "Withdrew"] as const;

export function canManageClasses(roles: readonly string[]) {
  return roles.includes("admin");
}

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Enter a valid date.");

export const renameClassSchema = z.object({
  classId: z.string().uuid(),
  name: z.string().trim().min(1).max(100),
});

export const studentStageSchema = z.object({
  classId: z.string().uuid(),
  studentId: z.string().uuid(),
  stage: z.enum(studentStages),
  changedOn: dateSchema.nullable(),
}).refine((value) => value.stage === "Active" || value.changedOn !== null, {
  message: "A change date is required for Completed, Dropped, or Withdrew.",
  path: ["changedOn"],
}).transform((value) => ({ ...value, changedOn: value.stage === "Active" ? null : value.changedOn }));