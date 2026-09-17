import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Plus, Trash2, Users, StickyNote } from "lucide-react";

export const Route = createFileRoute("/_authenticated/whiteboards/$id")({
  component: WhiteboardCanvas,
});

type Note = {
  id: string;
  whiteboard_id: string;
  author_id: string;
  author_name: string | null;
  body: string;
  color: string;
  x: number;
  y: number;
};

const COLORS: { key: string; label: string; bg: string; ring: string }[] = [
  { key: "yellow", label: "Yellow", bg: "bg-amber-200 text-amber-950", ring: "bg-amber-300" },
  { key: "blue", label: "Blue", bg: "bg-sky-200 text-sky-950", ring: "bg-sky-300" },
  { key: "green", label: "Green", bg: "bg-emerald-200 text-emerald-950", ring: "bg-emerald-300" },
  { key: "pink", label: "Pink", bg: "bg-pink-200 text-pink-950", ring: "bg-pink-300" },
  { key: "purple", label: "Purple", bg: "bg-violet-200 text-violet-950", ring: "bg-violet-300" },
];

const colorClass = (key: string) =>
  COLORS.find((c) => c.key === key)?.bg ?? COLORS[0].bg;

const db = supabase as any;

function WhiteboardCanvas() {
  const { id } = Route.useParams();
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [color, setColor] = useState("yellow");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [online, setOnline] = useState(1);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const { data: board, isLoading, refetch } = useQuery({
    queryKey: ["whiteboard", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whiteboards")
        .select("id,title,owner_id")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Initial notes + realtime stream
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await db
        .from("whiteboard_notes")
        .select("*")
        .eq("whiteboard_id", id)
        .order("created_at", { ascending: true });
      if (!active) return;
      setNotes((data ?? []) as Note[]);
      setLoadingNotes(false);
    })();

    const channel = supabase
      .channel(`board:${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "whiteboard_notes",
          filter: `whiteboard_id=eq.${id}`,
        },
        (payload: any) => {
          setNotes((prev) => {
            if (payload.eventType === "INSERT") {
              const n = payload.new as Note;
              return prev.some((p) => p.id === n.id) ? prev : [...prev, n];
            }
            if (payload.eventType === "UPDATE") {
              const n = payload.new as Note;
              return prev.map((p) => (p.id === n.id ? { ...p, ...n } : p));
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((p) => p.id !== (payload.old as Note).id);
            }
            return prev;
          });
        },
      )
      .on("presence", { event: "sync" }, () => {
        setOnline(Object.keys(channel.presenceState()).length || 1);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED" && user) {
          channel.track({ user_id: user.id });
        }
      });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [id, user?.id]);

  const addNote = useCallback(
    async (x?: number, y?: number) => {
      if (!user) return;
      const rect = boardRef.current?.getBoundingClientRect();
      const nx = x ?? Math.round((rect ? rect.width / 2 : 300) - 90 + Math.random() * 80 - 40);
      const ny = y ?? Math.round(80 + Math.random() * 120);
      const name =
        (user.user_metadata?.full_name as string) ||
        user.email?.split("@")[0] ||
        "Anonymous";
      const { data } = await db
        .from("whiteboard_notes")
        .insert({
          whiteboard_id: id,
          author_id: user.id,
          author_name: name,
          body: "",
          color,
          x: Math.max(0, nx),
          y: Math.max(0, ny),
        })
        .select("*")
        .single();
      if (data) {
        setNotes((prev) => (prev.some((p) => p.id === data.id) ? prev : [...prev, data as Note]));
        setEditingId(data.id);
      }
    },
    [color, id, user],
  );

  const canEdit = (n: Note) => isStaff || n.author_id === user?.id;

  const saveBody = (noteId: string, body: string) => {
    setNotes((prev) => prev.map((p) => (p.id === noteId ? { ...p, body } : p)));
    if (saveTimers.current[noteId]) clearTimeout(saveTimers.current[noteId]);
    saveTimers.current[noteId] = setTimeout(() => {
      db.from("whiteboard_notes").update({ body }).eq("id", noteId);
    }, 400);
  };

  const removeNote = async (noteId: string) => {
    setNotes((prev) => prev.filter((p) => p.id !== noteId));
    await db.from("whiteboard_notes").delete().eq("id", noteId);
  };

  // Dragging
  const onPointerDown = (e: React.PointerEvent, n: Note) => {
    if (!canEdit(n) || editingId === n.id) return;
    const rect = boardRef.current!.getBoundingClientRect();
    dragRef.current = {
      id: n.id,
      dx: e.clientX - rect.left - n.x,
      dy: e.clientY - rect.top - n.y,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const rect = boardRef.current!.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 60, e.clientX - rect.left - d.dx));
    const y = Math.max(0, Math.min(rect.height - 40, e.clientY - rect.top - d.dy));
    setNotes((prev) => prev.map((p) => (p.id === d.id ? { ...p, x, y } : p)));
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    const n = notes.find((p) => p.id === d.id);
    if (n) db.from("whiteboard_notes").update({ x: n.x, y: n.y }).eq("id", n.id);
  };

  const renameBoard = async () => {
    const t = titleDraft.trim();
    setEditingTitle(false);
    if (!t || !board || t === board.title) return;
    await supabase.from("whiteboards").update({ title: t }).eq("id", id);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="p-8 text-sm text-muted-foreground flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading board…
      </div>
    );
  }
  if (!board) {
    return (
      <div className="p-8">
        <p className="text-sm text-muted-foreground">Board not found.</p>
        <Button variant="link" onClick={() => navigate({ to: "/whiteboards" })}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="border-b bg-background px-4 py-2 flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/whiteboards">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Boards
          </Link>
        </Button>
        <div className="flex-1 min-w-[180px]">
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
        </div>

        <div className="flex items-center gap-1">
          {COLORS.map((c) => (
            <button
              key={c.key}
              title={c.label}
              onClick={() => setColor(c.key)}
              className={`w-6 h-6 rounded-full ${c.ring} border-2 transition ${
                color === c.key ? "border-foreground scale-110" : "border-transparent"
              }`}
            />
          ))}
        </div>

        <Button size="sm" onClick={() => addNote()}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add note
        </Button>

        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3.5 h-3.5" /> {online} here
        </span>
      </div>

      <div
        ref={boardRef}
        onDoubleClick={(e) => {
          if (e.target !== boardRef.current) return;
          const rect = boardRef.current!.getBoundingClientRect();
          addNote(e.clientX - rect.left - 90, e.clientY - rect.top - 40);
        }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="flex-1 relative overflow-hidden bg-muted/30"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {loadingNotes && (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading notes…
            </span>
          </div>
        )}

        {!loadingNotes && notes.length === 0 && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center text-sm text-muted-foreground">
              <StickyNote className="w-8 h-8 mx-auto mb-2 opacity-60" />
              Double-click anywhere (or use “Add note”) to leave a comment.
              <br />
              Everyone on this board sees new notes instantly.
            </div>
          </div>
        )}

        {notes.map((n) => (
          <div
            key={n.id}
            onPointerDown={(e) => onPointerDown(e, n)}
            style={{ left: n.x, top: n.y }}
            className={`absolute w-48 min-h-[7rem] p-3 rounded-lg shadow-md rotate-[-0.4deg] ${colorClass(
              n.color,
            )} ${canEdit(n) ? "cursor-grab active:cursor-grabbing" : ""}`}
          >
            {editingId === n.id ? (
              <textarea
                autoFocus
                value={n.body}
                onChange={(e) => saveBody(n.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                placeholder="Type your comment…"
                className="w-full h-20 bg-transparent resize-none outline-none text-sm placeholder:opacity-60"
              />
            ) : (
              <div
                onDoubleClick={() => canEdit(n) && setEditingId(n.id)}
                className="text-sm whitespace-pre-wrap break-words min-h-[5rem]"
              >
                {n.body || (canEdit(n) ? "Double-click to write…" : "")}
              </div>
            )}
            <div className="mt-1 flex items-center justify-between gap-2 text-[10px] opacity-70">
              <span className="truncate">{n.author_name ?? "Someone"}</span>
              {canEdit(n) && (
                <button
                  onClick={() => removeNote(n.id)}
                  title="Delete note"
                  className="opacity-70 hover:opacity-100"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
