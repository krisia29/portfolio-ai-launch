import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { importStudentsToClass } from "@/lib/classes.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/classes")({
  component: ClassesPage,
});

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

function ClassesPage() {
  const { user, isStaff } = useAuth();
  const qc = useQueryClient();
  const [className, setClassName] = useState("");
  const [period, setPeriod] = useState("");

  const mine = useQuery({
    queryKey: ["myClasses", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (isStaff) {
        const { data, error } = await supabase.from("classes").select("*, class_members(count)").eq("teacher_id", user!.id).order("created_at", { ascending: false });
        if (error) throw error;
        return data ?? [];
      } else {
        const { data, error } = await supabase.from("class_members").select("class_id, classes(*)").eq("student_id", user!.id);
        if (error) throw error;
        return (data ?? []).map((r: any) => r.classes);
      }
    },
  });

  const create = async () => {
    if (!user || !className.trim()) return;
    const code = makeCode();
    const { error } = await supabase.from("classes").insert({ teacher_id: user.id, name: className.trim(), period: period.trim() || null, join_code: code });
    if (error) return toast.error(error.message);
    toast.success("Class created.");
    setClassName(""); setPeriod("");
    qc.invalidateQueries({ queryKey: ["myClasses"] });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-display font-semibold">Classes</h1>

      {!isStaff ? (
        <div className="mt-6 rounded-2xl border bg-card p-6 flex items-start gap-3">
          <Users className="w-5 h-5 mt-0.5 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            Your teacher will add you to a class. Once enrolled, it will appear below.
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border bg-card p-6">
          <h2 className="font-display font-semibold">Create a class</h2>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div>
              <Label>Class name</Label>
              <Input value={className} onChange={(e) => setClassName(e.target.value)} maxLength={100} />
            </div>
            <div>
              <Label>Period</Label>
              <Input value={period} onChange={(e) => setPeriod(e.target.value)} maxLength={40} placeholder="e.g. Period 3" />
            </div>
          </div>
          <Button className="mt-4" onClick={create} disabled={!className.trim()}>Create class</Button>
        </div>
      )}

      <h2 className="mt-8 font-display text-xl font-semibold">Your classes</h2>
      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        {(mine.data ?? []).map((c: any) => (
          <ClassCard key={c.id} cls={c} isStaff={isStaff} />
        ))}
        {(!mine.data || mine.data.length === 0) && <div className="text-sm text-muted-foreground">None yet.</div>}
      </div>
    </div>
  );
}

function ClassCard({ cls, isStaff }: { cls: any; isStaff: boolean }) {
  const qc = useQueryClient();
  const importFn = useServerFn(importStudentsToClass);
  const [emails, setEmails] = useState("");
  const [busy, setBusy] = useState(false);

  const doImport = async () => {
    const list = emails
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);
    if (list.length === 0) return toast.error("Enter at least one email.");
    setBusy(true);
    try {
      const res = await importFn({ data: { classId: cls.id, emails: list } });
      toast.success(
        `Added ${res.added} student${res.added === 1 ? "" : "s"}.` +
          (res.notFound.length ? ` ${res.notFound.length} not found.` : ""),
      );
      if (res.notFound.length) {
        setEmails(res.notFound.join("\n"));
      } else {
        setEmails("");
      }
      qc.invalidateQueries({ queryKey: ["myClasses"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="font-semibold">{cls.name}</div>
      {cls.period && <div className="text-xs text-muted-foreground">{cls.period}</div>}
      {isStaff && (
        <div className="mt-3">
          <Label className="text-xs">Import students by email</Label>
          <Textarea
            className="mt-1 font-mono text-xs"
            rows={3}
            placeholder="student1@school.edu, student2@school.edu"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Students must have signed in at least once.
            </span>
            <Button size="sm" onClick={doImport} disabled={busy || !emails.trim()}>
              {busy ? "Adding…" : "Add students"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
