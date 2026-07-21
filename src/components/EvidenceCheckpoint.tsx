import { useCallback, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Paperclip,
  Upload,
  Link as LinkIcon,
  X,
  FileText,
  FileImage,
  FileArchive,
  File as FileIcon,
  Loader2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  DEFAULT_ACCEPTED,
  DEFAULT_MAX_FILES,
  DEFAULT_MAX_SIZE_MB,
  type EvidenceConfig,
  type EvidenceFile,
  type EvidenceState,
  type EvidenceStatus,
} from "@/lib/lesson";

const BUCKET = "submission-screenshots";

type Props = {
  assignmentId: string;
  userId: string;
  stepId: string;
  stepIndex: number;
  config: EvidenceConfig;
  value: EvidenceState;
  readOnly?: boolean;
  onChange: (next: EvidenceState) => void;
};

function fileExt(name: string) {
  return (name.split(".").pop() || "").toLowerCase();
}

function iconFor(type: string, name: string) {
  if (type.startsWith("image/")) return FileImage;
  const ext = fileExt(name);
  if (ext === "zip") return FileArchive;
  if (["pdf", "docx", "pptx", "txt", "md"].includes(ext)) return FileText;
  return FileIcon;
}

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function computeStatus(
  cfg: EvidenceConfig,
  s: EvidenceState,
  current: EvidenceStatus,
): EvidenceStatus {
  if (current === "needs_revision") return current;
  const hasFile = s.files.length > 0;
  const hasLink = !!s.link?.trim();
  const hasReflection = !!s.reflection?.trim();
  const reflectionOk = cfg.reflectionRequired ? hasReflection : true;
  if (!hasFile && !hasLink && !hasReflection) return "not_started";
  if ((hasFile || hasLink) && reflectionOk) return "complete";
  return "in_progress";
}

export function StatusPill({ status }: { status: EvidenceStatus }) {
  const map: Record<EvidenceStatus, { label: string; cls: string; Icon: any }> = {
    not_started: {
      label: "Not started",
      cls: "bg-muted text-muted-foreground border-border",
      Icon: Circle,
    },
    in_progress: {
      label: "In progress",
      cls: "bg-warning/10 text-warning border-warning/30",
      Icon: Clock,
    },
    complete: {
      label: "Complete",
      cls: "bg-success/10 text-success border-success/30",
      Icon: CheckCircle2,
    },
    needs_revision: {
      label: "Needs revision",
      cls: "bg-destructive/10 text-destructive border-destructive/30",
      Icon: AlertCircle,
    },
  };
  const { label, cls, Icon } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${cls}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export function EvidenceCheckpoint({
  assignmentId,
  userId,
  stepId,
  stepIndex,
  config,
  value,
  readOnly,
  onChange,
}: Props) {
  const accepted = (config.acceptedFiles ?? DEFAULT_ACCEPTED).map((e) =>
    e.toLowerCase(),
  );
  const maxFiles = config.maxFiles ?? DEFAULT_MAX_FILES;
  const maxSizeMb = config.maxSizeMb ?? DEFAULT_MAX_SIZE_MB;
  const allowLinks = config.allowLinks ?? true;
  const allowComments = config.allowComments ?? true;
  const title = config.title ?? `Upload Evidence for Step ${stepIndex + 1}`;

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState<
    Record<string, { name: string; progress: number }>
  >({});
  const [reflectionOpen, setReflectionOpen] = useState(
    !!config.reflectionRequired || !!value.reflection,
  );
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const acceptAttr = useMemo(
    () =>
      accepted
        .map((e) => (e === "jpg" || e === "jpeg" ? "image/jpeg" : `.${e}`))
        .join(","),
    [accepted],
  );

  const patch = useCallback(
    (partial: Partial<EvidenceState>) => {
      const next: EvidenceState = { ...value, ...partial };
      next.status = computeStatus(config, next, next.status);
      onChange(next);
    },
    [value, config, onChange],
  );

  const loadPreview = useCallback(async (f: EvidenceFile) => {
    if (!f.type.startsWith("image/")) return;
    if (previews[f.path]) return;
    const { data } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(f.path, 600);
    if (data?.signedUrl) setPreviews((p) => ({ ...p, [f.path]: data.signedUrl }));
  }, [previews]);

  const openFile = async (f: EvidenceFile) => {
    const { data } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(f.path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    if (readOnly) return;
    const files = Array.from(fileList);
    if (value.files.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files per checkpoint`);
      return;
    }
    const added: EvidenceFile[] = [];
    for (const file of files) {
      const ext = fileExt(file.name);
      if (accepted.length && !accepted.includes(ext)) {
        toast.error(`${file.name}: .${ext} not allowed`);
        continue;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        toast.error(`${file.name}: exceeds ${maxSizeMb} MB`);
        continue;
      }
      const key = `${file.name}-${Date.now()}-${Math.random()}`;
      setUploads((u) => ({ ...u, [key]: { name: file.name, progress: 10 } }));
      try {
        const safeName = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `${userId}/${assignmentId}/${stepId}/${Date.now()}-${safeName}`;
        setUploads((u) => ({ ...u, [key]: { name: file.name, progress: 40 } }));
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: false, contentType: file.type });
        if (error) throw error;
        setUploads((u) => ({ ...u, [key]: { name: file.name, progress: 100 } }));
        added.push({
          path,
          name: file.name,
          size: file.size,
          type: file.type || `application/${ext}`,
          uploadedAt: new Date().toISOString(),
        });
      } catch (err: any) {
        toast.error(err?.message ?? `Failed to upload ${file.name}`);
      } finally {
        setTimeout(() => {
          setUploads((u) => {
            const { [key]: _, ...rest } = u;
            return rest;
          });
        }, 600);
      }
    }
    if (added.length) {
      patch({ files: [...value.files, ...added] });
      toast.success(`Uploaded ${added.length} file${added.length > 1 ? "s" : ""}`);
    }
  };

  const removeFile = async (f: EvidenceFile) => {
    if (readOnly) return;
    await supabase.storage.from(BUCKET).remove([f.path]).catch(() => {});
    patch({ files: value.files.filter((x) => x.path !== f.path) });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="mt-3 rounded-xl border-2 border-dashed border-border bg-background/60 p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">{title}</span>
          {config.required && (
            <span className="text-xs rounded-full border border-destructive/30 bg-destructive/10 text-destructive px-2 py-0.5">
              required
            </span>
          )}
          {config.optional && (
            <span className="text-xs rounded-full border border-border bg-muted text-muted-foreground px-2 py-0.5">
              optional
            </span>
          )}
        </div>
        <StatusPill status={value.status} />
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!readOnly) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !readOnly && inputRef.current?.click()}
        className={`mt-3 rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/40"
        } ${readOnly ? "opacity-60 pointer-events-none" : ""}`}
      >
        <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
        <div className="mt-2 text-sm">
          <span className="font-medium text-primary">Click to upload</span>{" "}
          <span className="text-muted-foreground">or drag &amp; drop</span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {accepted.map((e) => e.toUpperCase()).join(", ")} • up to {maxSizeMb} MB
          {" • "}max {maxFiles} files
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptAttr}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Upload progress */}
      {Object.entries(uploads).length > 0 && (
        <div className="mt-3 space-y-2">
          {Object.entries(uploads).map(([k, u]) => (
            <div key={k} className="rounded border bg-muted/40 p-2">
              <div className="flex items-center gap-2 text-xs">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="truncate flex-1">{u.name}</span>
                <span className="text-muted-foreground">{u.progress}%</span>
              </div>
              <Progress value={u.progress} className="h-1 mt-1" />
            </div>
          ))}
        </div>
      )}

      {/* File cards */}
      {value.files.length > 0 && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {value.files.map((f) => {
            const Icon = iconFor(f.type, f.name);
            const preview = previews[f.path];
            if (f.type.startsWith("image/") && !preview) void loadPreview(f);
            return (
              <div
                key={f.path}
                className="group relative rounded-lg border bg-card p-2 flex gap-2 items-center"
              >
                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {preview ? (
                    <img
                      src={preview}
                      alt={f.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => openFile(f)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="text-sm font-medium truncate">{f.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {humanSize(f.size)}
                  </div>
                </button>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => removeFile(f)}
                    className="opacity-60 hover:opacity-100 hover:text-destructive p-1"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Optional link */}
      {allowLinks && (
        <div className="mt-3">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <LinkIcon className="w-3 h-3" /> Project URL (optional)
          </label>
          <Input
            type="url"
            placeholder="https://…"
            value={value.link ?? ""}
            disabled={readOnly}
            onChange={(e) => patch({ link: e.target.value })}
            className="mt-1"
          />
        </div>
      )}

      {/* Reflection */}
      {allowComments && (
        <div className="mt-3">
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
            onClick={() => setReflectionOpen((o) => !o)}
          >
            {reflectionOpen ? "Hide" : "Add"} reflection
            {config.reflectionRequired ? " (required)" : " (optional)"}
          </button>
          {reflectionOpen && (
            <Textarea
              className="mt-2"
              rows={3}
              placeholder={
                config.reflectionPrompt ??
                "Briefly describe what you completed during this step."
              }
              value={value.reflection ?? ""}
              disabled={readOnly}
              onChange={(e) => patch({ reflection: e.target.value })}
            />
          )}
        </div>
      )}
    </div>
  );
}
