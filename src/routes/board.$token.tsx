import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getSharedBoard, addGuestNote, updateGuestNote } from "@/lib/shared-board.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, StickyNote, Trash2, UserRound } from "lucide-react";

export const Route = createFileRoute("/board/$token")({
  head: () => ({
    meta: [
      { title: "Shared Whiteboard — Tech Pathways Academy" },
      { name: "description", content: "Add your sticky notes to this live class whiteboard." },
      { property: "og:title", content: "Shared Whiteboard — Tech Pathways Academy" },
      { property: "og:description", content: "Add your sticky notes to this live class whiteboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SharedBoard,
});

type Note = {
  id: string;
  whiteboard_id: string;
  author_id: string | null;
  author_name: string | null;
  body: string;
  color: string;
  x: number;
  y: number;
};

const COLORS = [
  { key: "yellow", bg: "bg-amber-200 text-amber-950", ring: "bg-amber-300" },
  { key: "blue", bg: "bg-sky-200 text-sky-950", ring: "bg-sky-300" },
  { key: "green", bg: "bg-emerald-200 text-emerald-950", ring: "bg-emerald-300" },
  { key: "pink", bg: "bg-pink-200 text-pink-950", ring: "bg-pink-300" },
  { key: "purple", bg: "bg-violet-200 text-violet-950", ring: "bg-violet-300" },
] as const;
const colorClass = (k: string) => COLORS.find((c) => c.key === k)?.bg ?? COLORS[0].bg;

const NAME_KEY = "tpa:boardName";
const TOKENS_KEY = "tpa:guestNoteTokens";
const readTokens = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(TOKENS_KEY) || "{}");
  } catch {
    return {};
  }
};
const db = supabase as any;

function SharedBoard() {
  const { token } = Route.useParams();
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [board, setBoard] = useState<{ id: string; title: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [color, setColor] = useState("yellow");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    setTokens(readTokens());
    const saved = localStorage.getItem(NAME_KEY) || "";
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      let initial = saved;
      if (!initial && u) {
        const { data: p } = await supabase.from("profiles").select("display_name").eq("id", u.id).maybeSingle();
        initial = (p?.display_name as string) || (u.user_metadata?.full_name as string) || "";
      }
      setNameDraft(initial);
      if (saved) setName(saved);
    });
  }, []);

  useEffect(() => {
    getSharedBoard({ data: { token } })
      .then((r) => {
        setBoard(r.board);
        setNotes(r.notes as Note[]);
      })
      .catch((e) => setError(e.message || "This board link is not available."));
  }, [token]);

  useEffect(() => {
    if (!board) return;
    const ch = supabase
      .channel(`shared:${board.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "whiteboard_notes", filter: `whiteboard_id=eq.${board.id}` },
        (p: any) =>
          setNotes((prev) => {
            if (p.eventType === "INSERT") return prev.some((n) => n.id === p.new.id) ? prev : [...prev, p.new];
            if (p.eventType === "UPDATE")
              return prev.map((n) => (n.id === p.new.id ? { ...n, ...p.new } : n));
            if (p.eventType === "DELETE") return prev.filter((n) => n.id !== p.old.id);
            return prev;
          }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [board?.id]);

  const canEdit = (n: Note) => (user && n.author_id === user.id) || !!tokens[n.id];

  const saveName = () => {
    const t = nameDraft.trim().replace(/\s+/g, " ");
    if (t.split(" ").length < 2) return;
    localStorage.setItem(NAME_KEY, t);
    setName(t);
  };

  const addNote = async (x?: number, y?: number) => {
    if (!board || !name) return;
    const rect = boardRef.current?.getBoundingClientRect();
    const nx = Math.max(0, Math.round(x ?? (rect ? rect.width / 2 - 90 : 200) + Math.random() * 60 - 30));
    const ny = Math.max(0, Math.round(y ?? 80 + Math.random() * 120));
    let note: Note | null = null;
    if (user) {
      const { data } = await db
        .from("whiteboard_notes")
        .insert({ whiteboard_id: board.id, author_id: user.id, author_name: name, body: "", color, x: nx, y: ny })
        .select("id,whiteboard_id,author_id,author_name,body,color,x,y")
        .single();
      note = data;
    } else {
      const r = await addGuestNote({ data: { token, name, color: color as any, x: nx, y: ny } });
      note = r.note as Note;
      const next = { ...readTokens(), [note.id]: r.editToken };
      localStorage.setItem(TOKENS_KEY, JSON.stringify(next));
      setTokens(next);
    }
    if (note) {
      setNotes((prev) => (prev.some((p) => p.id === note!.id) ? prev : [...prev, note!]));
      setEditingId(note.id);
    }
  };

  const persist = (n: Note, patch: { body?: string; x?: number; y?: number; remove?: boolean }) => {
    if (user && n.author_id === user.id) {
      const q = patch.remove
        ? db.from("whiteboard_notes").delete().eq("id", n.id)
        : db.from("whiteboard_notes").update(patch).eq("id", n.id);
      return q.then(({ error }: any) => {
        if (error) console.error("Note save failed", error);
      });
    }
    const t = tokens[n.id];
    if (t) return updateGuestNote({ data: { id: n.id, editToken: t, ...patch } });
  };

  const saveBody = (n: Note, body: string) => {
    setNotes((prev) => prev.map((p) => (p.id === n.id ? { ...p, body } : p)));
    clearTimeout(timers.current[n.id]);
    timers.current[n.id] = setTimeout(() => persist(n, { body }), 400);
  };

  const onPointerDown = (e: React.PointerEvent, n: Note) => {
    if (!canEdit(n) || editingId === n.id) return;
    const rect = boardRef.current!.getBoundingClientRect();
    dragRef.current = { id: n.id, dx: e.clientX - rect.left - n.x, dy: e.clientY - rect.top - n.y };
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
    const n = d && notes.find((p) => p.id === d.id);
    if (n) persist(n, { x: Math.round(n.x), y: Math.round(n.y) });
  };

  if (error)
    return <div className="p-10 text-center text-muted-foreground">{error}</div>;
  if (!board)
    return (
      <div className="p-10 flex justify-center text-sm text-muted-foreground gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading board…
      </div>
    );

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b bg-background px-4 py-2 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[180px] font-display font-semibold text-lg">{board.title}</div>
        {name && (
          <>
            <button
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline"
              onClick={() => setName("")}
              title="Change name"
            >
              <UserRound className="w-3.5 h-3.5" /> {name}
            </button>
            <div className="flex items-center gap-1">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  aria-label={c.key}
                  onClick={() => setColor(c.key)}
                  className={`w-6 h-6 rounded-full ${c.ring} border-2 ${color === c.key ? "border-foreground scale-110" : "border-transparent"}`}
                />
              ))}
            </div>
            <Button size="sm" onClick={() => addNote()}>
              <Plus className="w-4 h-4 mr-1.5" /> Add note
            </Button>
          </>
        )}
      </div>

      <div
        ref={boardRef}
        onDoubleClick={(e) => {
          if (e.target !== boardRef.current || !name) return;
          const r = boardRef.current!.getBoundingClientRect();
          addNote(e.clientX - r.left - 90, e.clientY - r.top - 40);
        }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="flex-1 relative overflow-hidden bg-muted/30"
        style={{ backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      >
        {!name && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-background/70 backdrop-blur-sm p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveName();
              }}
              className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-lg space-y-3"
            >
              <h2 className="font-display text-xl font-semibold">Join this board</h2>
              <p className="text-sm text-muted-foreground">
                Enter your first and last name. It will appear on every note you add.
              </p>
              <Input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="First and last name"
                maxLength={80}
              />
              {nameDraft.trim() && nameDraft.trim().split(/\s+/).length < 2 && (
                <p className="text-xs text-destructive">Please enter both your first and last name.</p>
              )}
              <Button type="submit" className="w-full" disabled={nameDraft.trim().split(/\s+/).length < 2}>
                Start adding notes
              </Button>
              {user && <p className="text-xs text-muted-foreground">Your notes will be saved to your account.</p>}
            </form>
          </div>
        )}

        {notes.length === 0 && name && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none text-center text-sm text-muted-foreground">
            <div>
              <StickyNote className="w-8 h-8 mx-auto mb-2 opacity-60" />
              Double-click anywhere (or use “Add note”) to leave a comment.
            </div>
          </div>
        )}

        {notes.map((n) => (
          <div
            key={n.id}
            onPointerDown={(e) => onPointerDown(e, n)}
            style={{ left: n.x, top: n.y }}
            className={`absolute w-48 min-h-[7rem] p-3 rounded-lg shadow-md ${colorClass(n.color)} ${canEdit(n) ? "cursor-grab" : ""}`}
          >
            {editingId === n.id ? (
              <textarea
                autoFocus
                value={n.body}
                onChange={(e) => saveBody(n, e.target.value)}
                onBlur={() => setEditingId(null)}
                placeholder="Type your comment…"
                className="w-full h-20 bg-transparent resize-none outline-none text-sm"
              />
            ) : (
              <div
                onDoubleClick={() => canEdit(n) && setEditingId(n.id)}
                className="text-sm whitespace-pre-wrap break-words min-h-[5rem]"
              >
                {n.body || (canEdit(n) ? "Double-click to write…" : "")}
              </div>
            )}
            <div className="mt-1 flex items-center justify-between text-[10px] opacity-70">
              <span className="truncate">{n.author_name ?? "Someone"}</span>
              {canEdit(n) && (
                <button
                  onClick={() => {
                    setNotes((p) => p.filter((x) => x.id !== n.id));
                    persist(n, { remove: true });
                  }}
                  title="Delete note"
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
