import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Users } from "lucide-react";

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
  const [joinCode, setJoinCode] = useState("");
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

  const join = async () => {
    if (!user || !joinCode) return;
    const { data: cls, error: e1 } = await supabase.from("classes").select("id").eq("join_code", joinCode.trim().toUpperCase()).maybeSingle();
    if (e1 || !cls) return toast.error("Invalid class code.");
    const { error } = await supabase.from("class_members").insert({ class_id: cls.id, student_id: user.id });
    if (error && !error.message.includes("duplicate")) return toast.error(error.message);
    toast.success("Joined class.");
    setJoinCode("");
    qc.invalidateQueries({ queryKey: ["myClasses"] });
  };

  const create = async () => {
    if (!user || !className.trim()) return;
    const code = makeCode();
    const { error } = await supabase.from("classes").insert({ teacher_id: user.id, name: className.trim(), period: period.trim() || null, join_code: code });
    if (error) return toast.error(error.message);
    toast.success(`Class created. Code: ${code}`);
    setClassName(""); setPeriod("");
    qc.invalidateQueries({ queryKey: ["myClasses"] });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-display font-semibold">Classes</h1>

      {!isStaff ? (
        <div className="mt-6 rounded-2xl border bg-card p-6">
          <h2 className="font-display font-semibold">Join a class</h2>
          <div className="flex gap-2 mt-3">
            <Input placeholder="Class code (e.g. ABC234)" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} maxLength={12} />
            <Button onClick={join} disabled={!joinCode}>Join</Button>
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
          <div key={c.id} className="rounded-xl border bg-card p-4">
            <div className="font-semibold">{c.name}</div>
            {c.period && <div className="text-xs text-muted-foreground">{c.period}</div>}
            {isStaff && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="rounded bg-muted px-2 py-0.5 font-mono">{c.join_code}</span>
                <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(c.join_code); toast.success("Copied"); }}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
        {(!mine.data || mine.data.length === 0) && <div className="text-sm text-muted-foreground">None yet.</div>}
      </div>
    </div>
  );
}
