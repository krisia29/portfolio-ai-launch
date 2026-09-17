import { useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { bulkAssignStudents } from "@/lib/classes.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, FileSpreadsheet } from "lucide-react";

type ParsedRow = { email: string; className?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function splitCells(line: string): string[] {
  return line.split(/[,;\t]/).map((c) => c.trim().replace(/^"|"$/g, ""));
}

/** Parse a pasted list or CSV export into { email, className } rows. */
export function parseStudentList(text: string): { rows: ParsedRow[]; invalid: string[] } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let emailIdx = 0;
  let classIdx = -1;
  let start = 0;

  if (lines.length > 0) {
    const header = splitCells(lines[0]).map((c) => c.toLowerCase());
    const hasEmailHeader = header.some((c) => c.includes("email"));
    if (hasEmailHeader) {
      emailIdx = header.findIndex((c) => c.includes("email"));
      classIdx = header.findIndex((c) => c.includes("class") || c.includes("period"));
      start = 1;
    }
  }

  const rows: ParsedRow[] = [];
  const invalid: string[] = [];
  const seen = new Set<string>();

  for (let i = start; i < lines.length; i++) {
    const cells = splitCells(lines[i]);
    let email = (cells[emailIdx] ?? "").toLowerCase();
    if (!EMAIL_RE.test(email)) {
      // fall back to any cell that looks like an email
      const guess = cells.find((c) => EMAIL_RE.test(c.toLowerCase()));
      if (!guess) {
        invalid.push(lines[i]);
        continue;
      }
      email = guess.toLowerCase();
    }
    const className = classIdx >= 0 ? (cells[classIdx] || undefined) : undefined;
    const key = `${email}|${className ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({ email, className });
  }

  return { rows, invalid };
}

export function BulkStudentUpload({
  classes,
}: {
  classes: { id: string; name: string }[];
}) {
  const qc = useQueryClient();
  const assign = useServerFn(bulkAssignStudents);
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [classId, setClassId] = useState<string>(classes[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const parsed = useMemo(() => parseStudentList(text), [text]);

  const readFile = async (file: File) => {
    const content = await file.text();
    setText((prev) => (prev.trim() ? `${prev.trim()}\n${content}` : content));
  };

  const submit = async () => {
    if (parsed.rows.length === 0) return toast.error("No student emails found.");
    if (!classId && !parsed.rows.every((r) => r.className)) {
      return toast.error("Choose a class for the list.");
    }
    setBusy(true);
    try {
      const res = await assign({
        data: { defaultClassId: classId || undefined, rows: parsed.rows },
      });
      const total = res.results.reduce((n, r) => n + r.enrolled + r.invited, 0);
      const invited = res.results.reduce((n, r) => n + r.invited, 0);
      toast.success(
        `${total} student${total === 1 ? "" : "s"} assigned` +
          (invited ? ` — ${invited} will join automatically at first sign-in.` : "."),
      );
      if (res.unknownClasses.length) {
        toast.error(`Class not found: ${res.unknownClasses.join(", ")}`);
      }
      setText("");
      qc.invalidateQueries({ queryKey: ["myClasses"] });
      qc.invalidateQueries({ queryKey: ["classInvites"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="font-display font-semibold">Bulk-upload students</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload a spreadsheet export (CSV) or paste a list of student emails. Add a
        second column named <span className="font-mono">class</span> to assign
        different students to different classes.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void readFile(file);
        }}
        className={`mt-4 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <FileSpreadsheet className="mx-auto h-6 w-6 text-muted-foreground" />
        <div className="mt-2 text-sm">
          Drag a CSV file here, or{" "}
          <button
            type="button"
            className="underline underline-offset-2"
            onClick={() => fileRef.current?.click()}
          >
            choose a file
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt,text/csv,text/plain"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void readFile(file);
            e.target.value = "";
          }}
        />
      </div>

      <div className="mt-4">
        <Label className="text-xs">Student list</Label>
        <Textarea
          className="mt-1 font-mono text-xs"
          rows={6}
          placeholder={"email,class\nstudent1@school.org,Fall 2026\nstudent2@school.org,Fall 2026"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Assign to class</Label>
          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Used for rows that don&apos;t name their own class.
          </p>
        </div>
        <div className="flex flex-col justify-end">
          <div className="text-xs text-muted-foreground">
            {parsed.rows.length} email{parsed.rows.length === 1 ? "" : "s"} ready
            {parsed.invalid.length ? ` · ${parsed.invalid.length} line(s) skipped` : ""}
          </div>
          <Button className="mt-2" onClick={submit} disabled={busy || parsed.rows.length === 0}>
            <Upload className="mr-2 h-4 w-4" />
            {busy ? "Uploading…" : "Assign students"}
          </Button>
        </div>
      </div>

      {parsed.rows.length > 0 && (
        <div className="mt-4 max-h-40 overflow-auto rounded-lg border">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-3 py-1.5 text-left font-medium">Email</th>
                <th className="px-3 py-1.5 text-left font-medium">Class</th>
              </tr>
            </thead>
            <tbody>
              {parsed.rows.slice(0, 50).map((r) => (
                <tr key={`${r.email}-${r.className ?? ""}`} className="border-t">
                  <td className="px-3 py-1.5 font-mono">{r.email}</td>
                  <td className="px-3 py-1.5">
                    {r.className ?? classes.find((c) => c.id === classId)?.name ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {parsed.rows.length > 50 && (
            <div className="border-t px-3 py-1.5 text-[11px] text-muted-foreground">
              +{parsed.rows.length - 50} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}
