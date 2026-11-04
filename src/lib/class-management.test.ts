import { test } from "node:test";
import assert from "node:assert/strict";
import { canManageClasses, renameClassSchema, studentStageSchema } from "./class-management";

const ids = { classId: "e4371ca8-4ca4-45b1-a6b7-2392836faba9", studentId: "4eca3a6a-8229-4f1f-8807-1de2bb923061" };
test("only admins may manage class names and stages", () => {
  assert.equal(canManageClasses(["admin"]), true);
  assert.equal(canManageClasses(["teacher"]), false);
  assert.equal(canManageClasses(["student"]), false);
  assert.equal(canManageClasses([]), false);
});
for (const stage of ["Completed", "Dropped", "Withdrew"] as const) {
  test(`${stage} requires and preserves the exact change date`, () => {
    assert.equal(studentStageSchema.safeParse({ ...ids, stage, changedOn: null }).success, false);
    assert.equal(studentStageSchema.parse({ ...ids, stage, changedOn: "2026-11-04" }).changedOn, "2026-11-04");
  });
}
test("Active does not require a stage change date", () => {
  assert.equal(studentStageSchema.parse({ ...ids, stage: "Active", changedOn: null }).changedOn, null);
});
test("only the four requested stages and valid calendar dates are accepted", () => {
  assert.equal(studentStageSchema.safeParse({ ...ids, stage: "Other", changedOn: null }).success, false);
  assert.equal(studentStageSchema.safeParse({ ...ids, stage: "Completed", changedOn: "2026-02-30" }).success, false);
});
test("class names can be renamed without changing their identity", () => {
  assert.deepEqual(renameClassSchema.parse({ classId: ids.classId, name: " Spring 2026 " }), { classId: ids.classId, name: "Spring 2026" });
});