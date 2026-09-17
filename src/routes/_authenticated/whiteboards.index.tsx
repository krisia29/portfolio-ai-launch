import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, StickyNote } from "lucide-react";

export const Route = createFileRoute("/_authenticated/whiteboards/")({
  component: WhiteboardsIndex,
});

function WhiteboardsIndex() {
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: boards = [], isLoading } = useQuery({
    queryKey: ["whiteboards", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whiteboards")
        .select("id,title,updated_at,last_edited_at,owner_id")
        .eq("is_archived", false)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return boards;
    return boards.filter((b: any) => b.title.toLowerCase().includes(q));
  }, [boards, search]);

  const createBoard = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("whiteboards")
        .insert({
          owner_id: user!.id,
          title: `Board — ${new Date().toLocaleDateString()}`,
          folder: "personal",
          last_edited_by: user!.id,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ["whiteboards"] });
      navigate({ to: "/whiteboards/$id", params: { id } });
    },
  });

  const deleteBoard = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("whiteboards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whiteboards"] }),
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-semibold">Whiteboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Shared sticky-note boards. Everyone's comments appear live as they're posted.
          </p>
        </div>
        <Button onClick={() => createBoard.mutate()} disabled={createBoard.isPending}>
          <Plus className="w-4 h-4 mr-1.5" />
          New board
        </Button>
      </div>

      <div className="relative my-6">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search boards…"
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No boards yet. Create one and start posting notes.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b: any) => (
            <div
              key={b.id}
              className="group rounded-2xl border bg-card p-4 flex flex-col hover:shadow-md transition"
            >
              <Link to="/whiteboards/$id" params={{ id: b.id }} className="block flex-1">
                <div className="aspect-video rounded-lg bg-gradient-to-br from-amber-100 to-sky-100 border grid place-items-center text-amber-700">
                  <StickyNote className="w-6 h-6" />
                </div>
                <div className="mt-3">
                  <div className="font-medium truncate">{b.title}</div>
                  <div className="text-xs text-muted-foreground">
                    Updated {new Date(b.last_edited_at ?? b.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
              {b.owner_id === user?.id && (
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm(`Delete "${b.title}"? This cannot be undone.`))
                        deleteBoard.mutate(b.id);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
