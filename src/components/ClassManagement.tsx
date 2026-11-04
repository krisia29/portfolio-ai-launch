import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClassRoster, renameClass, updateStudentStage } from "@/lib/class-management.functions";
import { studentStages, type studentStageSchema } from "@/lib/class-management";
import type { z } from "zod";

type Stage = z.infer<typeof studentStageSchema>["stage"];
type Student = { student_id: string; name: string; email: string; stage: string; stage_changed_on: string | null };

export function ClassManagement({ classId, name }: { classId: string; name: string }) {
  const qc = useQueryClient();
  const rename = useServerFn(renameClass);
  const rosterFn = useServerFn(getClassRoster);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const roster = useQuery({ queryKey: ["classRoster", classId], enabled: open, queryFn: () => rosterFn({ data: { classId } }) });
  const saveName = async () => {
    setBusy(true);
    try {
      await rename({ data: { classId, name: draft } });
      await qc.invalidateQueries({ queryKey: ["myClasses"] });
      setEditing(false);
      toast.success("Class name saved.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to save class name."); }
    finally { setBusy(false); }
  };
  return <div className="mt-2">
    {editing ? <div className="flex flex-wrap items-end gap-2">
      <div className="min-w-0 flex-1"><Label htmlFor={`class-name-${classId}`}>Class name</Label><Input id={`class-name-${classId}`} value={draft} maxLength={100} onChange={(event) => setDraft(event.target.value)} /></div>
      <Button size="sm" onClick={saveName} disabled={busy || !draft.trim()}>Save name</Button>
      <Button size="sm" variant="ghost" disabled={busy} onClick={() => setEditing(false)}>Cancel</Button>
    </div> : <Button size="sm" variant="ghost" onClick={() => { setDraft(name); setEditing(true); }}><Pencil className="mr-2 h-4 w-4" />Edit class name</Button>}
    <Button size="sm" variant="outline" className="mt-2" onClick={() => setOpen(true)}><Users className="mr-2 h-4 w-4" />Manage students</Button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-4xl max-h-[85dvh] overflow-y-auto"><DialogHeader><DialogTitle>{name} — Students</DialogTitle><DialogDescription>Student stages and change dates</DialogDescription></DialogHeader>
      {roster.isLoading ? <p className="text-sm text-muted-foreground">Loading students…</p> : roster.isError ? <div><p role="alert">Unable to load students.</p><Button variant="outline" onClick={() => roster.refetch()}>Try again</Button></div> : roster.data?.length ? <div className="space-y-4">{roster.data.map((student) => <StudentStageRow key={`${student.student_id}-${student.stage}-${student.stage_changed_on}`} student={student} classId={classId} />)}</div> : <p className="text-sm text-muted-foreground">No students enrolled.</p>}
    </DialogContent></Dialog>
  </div>;
}

function StudentStageRow({ student, classId }: { student: Student; classId: string }) {
  const qc = useQueryClient();
  const update = useServerFn(updateStudentStage);
  const initialStage = studentStages.find((stage) => stage === student.stage) ?? "Active";
  const [stage, setStage] = useState<Stage>(initialStage);
  const [date, setDate] = useState(student.stage_changed_on ?? "");
  const [busy, setBusy] = useState(false);
  const changed = stage !== student.stage || (stage === "Active" ? null : date || null) !== student.stage_changed_on;
  const save = async () => {
    setBusy(true);
    try {
      await update({ data: { classId, studentId: student.student_id, stage, changedOn: stage === "Active" ? null : date || null } });
      await qc.invalidateQueries({ queryKey: ["classRoster", classId] });
      toast.success("Student stage saved.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to save student stage."); }
    finally { setBusy(false); }
  };
  return <div className="border-b pb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px_160px_auto] sm:items-end">
    <div className="min-w-0"><div className="font-medium break-words">{student.name || student.email || "Student"}</div><div className="text-xs text-muted-foreground break-all">{student.email}</div></div>
    <div><Label htmlFor={`stage-${student.student_id}`}>Stage</Label><Select value={stage} onValueChange={(value) => { const selected = studentStages.find((option) => option === value); if (selected) { setStage(selected); if (selected === "Active") setDate(""); } }}><SelectTrigger id={`stage-${student.student_id}`}><SelectValue /></SelectTrigger><SelectContent>{studentStages.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>
    <div>{stage !== "Active" && <><Label htmlFor={`date-${student.student_id}`}>Stage change date</Label><Input id={`date-${student.student_id}`} type="date" required value={date} onChange={(event) => setDate(event.target.value)} /></>}</div>
    <Button size="sm" onClick={save} disabled={busy || !changed || (stage !== "Active" && !date)}>{busy ? "Saving…" : "Save stage"}</Button>
  </div>;
}