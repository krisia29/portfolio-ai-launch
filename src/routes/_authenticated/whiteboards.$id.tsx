import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, useCallback } from "react";
import { Tldraw, getSnapshot, loadSnapshot, exportAs, type Editor } from "tldraw";
import "tldraw/tldraw.css";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, Loader2, Check, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/whiteboards/$id")({
  component: WhiteboardCanvas,
});

function WhiteboardCanvas() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const editorRef = useRef<Editor | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  const { data: board, isLoading } = useQuery({
    queryKey: ["whiteboard", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whiteboards")
        .select("*, owner:profiles!whiteboards_owner_id_fkey(display_name), editor:profiles!whiteboards_last_edited_by_fkey(display_name)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const persist = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor || !user) return;
    setSaving(true);
    try {
      const snapshot = getSnapshot(editor.store);
      const { error } = await supabase
        .from("whiteboards")
        .update({
          snapshot: snapshot as any,
          last_edited_by: user.id,
          last_edited_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (!error) setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }, [id, user]);

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(persist, 1200);
  }, [persist]);

  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;
      // Load existing snapshot
      if (board?.snapshot) {
        try {
          loadSnapshot(editor.store, board.snapshot as any);
        } catch (e) {
          console.error("Failed to load whiteboard snapshot", e);
        }
      }
      // Autosave on any store change
      const dispose = editor.store.listen(
        () => scheduleSave(),
        { source: "user", scope: "document" },
      );
      // Cleanup handled by component unmount below
      (editor as any)._disposeAutosave = dispose;
    },
    [board?.snapshot, scheduleSave],
  );

  useEffect(() => {
    return () => {
      const editor = editorRef.current;
      if (editor && (editor as any)._disposeAutosave) {
        (editor as any)._disposeAutosave();
      }
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const renameBoard = async () => {
    const t = titleDraft.trim();
    if (!t || !board) {
      setEditingTitle(false);
      return;
    }
    const { error } = await supabase
      .from("whiteboards")
      .update({ title: t })
      .eq("id", id);
    if (!error) {
      qc.invalidateQueries({ queryKey: ["whiteboard", id] });
      qc.invalidateQueries({ queryKey: ["whiteboards"] });
    }
    setEditingTitle(false);
  };

  const exportPNG = async () => {
    const editor = editorRef.current;
    if (!editor) return;
    const shapeIds = [...editor.getCurrentPageShapeIds()];
    if (shapeIds.length === 0) return;
    await exportAs(editor, shapeIds, {
      format: "png",
      name: board?.title ?? "whiteboard",
      background: true,
    });
  };

  const clearBoard = () => {
    const editor = editorRef.current;
    if (!editor) return;
    if (!confirm("Clear the entire board? This can be undone with Ctrl/Cmd+Z.")) return;
    const ids = [...editor.getCurrentPageShapeIds()];
    if (ids.length) editor.deleteShapes(ids);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-sm text-muted-foreground flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading whiteboard…
      </div>
    );
  }
  if (!board) {
    return (
      <div className="p-8">
        <p className="text-sm text-muted-foreground">Whiteboard not found.</p>
        <Button variant="link" onClick={() => navigate({ to: "/whiteboards" })}>Back</Button>
      </div>
    );
  }

  const lastEditor = (board as any).editor?.display_name ?? "someone";
  const lastEditedAt = board.last_edited_at ? new Date(board.last_edited_at) : null;

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="border-b bg-background px-4 py-2 flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/whiteboards">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Boards
          </Link>
        </Button>
        <div className="flex-1 min-w-[200px]">
          {editingTitle ? (
            <Input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={renameBoard}
              onKeyDown={(e) => {
                if (e.key === "Enter") renameBoard();
                if (e.key === "Escape") setEditingTitle(false);
              }}
              className="max-w-md"
            />
          ) : (
            <button
              className="font-display font-semibold text-lg hover:underline text-left"
              onClick={() => {
                setTitleDraft(board.title);
                setEditingTitle(true);
              }}
            >
              {board.title}
            </button>
          )}
          {lastEditedAt && (
            <div className="text-[11px] text-muted-foreground">
              Last edited by {lastEditor} · {lastEditedAt.toLocaleString()}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {saving ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Saving…
            </span>
          ) : savedAt ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Check className="w-3 h-3" /> Saved
            </span>
          ) : null}
        </div>
        <Button size="sm" variant="outline" onClick={exportPNG}>
          <Download className="w-4 h-4 mr-1.5" />
          PNG
        </Button>
        <Button size="sm" variant="outline" onClick={clearBoard}>
          <Trash2 className="w-4 h-4 mr-1.5" />
          Clear
        </Button>
      </div>
      <div className="flex-1 relative">
        <Tldraw onMount={handleMount} persistenceKey={undefined} />
      </div>
    </div>
  );
}
