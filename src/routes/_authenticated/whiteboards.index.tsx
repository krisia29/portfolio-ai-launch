import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  User as UserIcon,
  GraduationCap,
  ClipboardList,
  Users,
  BookmarkCheck,
  Archive,
  Trash2,
  Copy,
  Pencil,
} from "lucide-react";

type Folder =
  | "personal"
  | "class"
  | "assignment"
  | "group"
  | "template"
  | "archived";

const FOLDERS: { key: Folder; label: string; icon: React.ReactNode }[] = [
  { key: "personal", label: "Personal Boards", icon: <UserIcon className="w-4 h-4" /> },
  { key: "class", label: "Class Boards", icon: <GraduationCap className="w-4 h-4" /> },
  { key: "assignment", label: "Assignment Boards", icon: <ClipboardList className="w-4 h-4" /> },
  { key: "group", label: "Group Projects", icon: <Users className="w-4 h-4" /> },
  { key: "template", label: "Templates", icon: <BookmarkCheck className="w-4 h-4" /> },
  { key: "archived", label: "Archived", icon: <Archive className="w-4 h-4" /> },
];

export const Route = createFileRoute("/_authenticated/whiteboards/")({
  component: WhiteboardsIndex,
});

function WhiteboardsIndex() {
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [folder, setFolder] = useState<Folder>("personal");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const { data: boards = [], isLoading } = useQuery({
    queryKey: ["whiteboards", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whiteboards")
        .select("id,title,folder,is_archived,is_template,last_edited_at,updated_at,owner_id,class_id,assignment_id")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return boards.filter((b: any) => {
      if (folder === "archived") {
        if (!b.is_archived) return false;
      } else if (folder === "template") {
        if (!b.is_template || b.is_archived) return false;
      } else {
        if (b.is_archived) return false;
        if (b.folder !== folder) return false;
      }
      if (q && !b.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [boards, folder, search]);

  const createBoard = useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await supabase
        .from("whiteboards")
        .insert({
          owner_id: user!.id,
          title: title.trim() || "Untitled whiteboard",
          folder: folder === "archived" ? "personal" : folder === "template" ? "template" : folder,
          is_template: folder === "template" && isStaff,
          last_edited_by: user!.id,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ["whiteboards"] });
      setCreating(false);
      setNewTitle("");
      navigate({ to: "/whiteboards/$id", params: { id } });
    },
  });

  const duplicateBoard = useMutation({
    mutationFn: async (id: string) => {
      const { data: src, error: e1 } = await supabase
        .from("whiteboards")
        .select("*")
        .eq("id", id)
        .single();
      if (e1) throw e1;
      const { data, error } = await supabase
        .from("whiteboards")
        .insert({
          owner_id: user!.id,
          title: `${src.title} (copy)`,
          folder: src.folder,
          class_id: src.class_id,
          assignment_id: src.assignment_id,
          snapshot: src.snapshot,
          last_edited_by: user!.id,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whiteboards"] }),
  });

  const archiveBoard = useMutation({
    mutationFn: async ({ id, archived }: { id: string; archived: boolean }) => {
      const { error } = await supabase
        .from("whiteboards")
        .update({ is_archived: archived })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whiteboards"] }),
  });

  const deleteBoard = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("whiteboards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whiteboards"] }),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-semibold">Whiteboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sketch, brainstorm, and diagram your AI project ideas.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          New whiteboard
        </Button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          {FOLDERS.map((f) => {
            if (f.key === "template" && !isStaff) {
              // students can still view templates but the folder is optional
            }
            const active = folder === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFolder(f.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition ${
                  active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                {f.icon}
                <span>{f.label}</span>
              </button>
            );
          })}
        </aside>

        <div>
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search whiteboards…"
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              No whiteboards here yet. Create one to get started.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((b: any) => (
                <div
                  key={b.id}
                  className="group rounded-2xl border bg-card p-4 flex flex-col hover:shadow-md transition"
                >
                  <Link
                    to="/whiteboards/$id"
                    params={{ id: b.id }}
                    className="block flex-1"
                  >
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-muted to-muted/40 border grid place-items-center text-muted-foreground">
                      <Pencil className="w-6 h-6" />
                    </div>
                    <div className="mt-3">
                      <div className="font-medium truncate">{b.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Updated {new Date(b.last_edited_at ?? b.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                  <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => duplicateBoard.mutate(b.id)}
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        archiveBoard.mutate({ id: b.id, archived: !b.is_archived })
                      }
                      title={b.is_archived ? "Unarchive" : "Archive"}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </Button>
                    {b.owner_id === user?.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Delete "${b.title}"? This cannot be undone.`))
                            deleteBoard.mutate(b.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New whiteboard</DialogTitle>
            <DialogDescription>
              It will be saved to <b>{FOLDERS.find((f) => f.key === folder)?.label}</b>.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Whiteboard title"
            onKeyDown={(e) => {
              if (e.key === "Enter") createBoard.mutate(newTitle);
            }}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createBoard.mutate(newTitle)}
              disabled={createBoard.isPending}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
