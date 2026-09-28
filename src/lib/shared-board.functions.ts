import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

async function boardForToken(db: any, token: string) {
  const { data } = await db
    .from("whiteboards")
    .select("id,title,share_enabled")
    .eq("share_token", token)
    .maybeSingle();
  if (!data || !data.share_enabled) throw new Error("This board link is not available.");
  return data as { id: string; title: string };
}

const SAFE = "id,whiteboard_id,author_id,author_name,body,color,x,y,created_at";

export const getSharedBoard = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ token: z.string().min(8).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const board = await boardForToken(db, data.token);
    const { data: notes } = await db
      .from("whiteboard_notes")
      .select(SAFE)
      .eq("whiteboard_id", board.id)
      .order("created_at", { ascending: true });
    return { board, notes: notes ?? [] };
  });

export const addGuestNote = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        token: z.string().min(8).max(64),
        name: z.string().trim().min(3).max(80),
        color: z.enum(["yellow", "blue", "green", "pink", "purple"]),
        x: z.number().min(0).max(5000),
        y: z.number().min(0).max(5000),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin();
    const board = await boardForToken(db, data.token);
    const editToken = crypto.randomUUID();
    const { data: note, error } = await db
      .from("whiteboard_notes")
      .insert({
        whiteboard_id: board.id,
        author_id: null,
        author_name: data.name,
        body: "",
        color: data.color,
        x: data.x,
        y: data.y,
        edit_token_hash: await sha256(editToken),
      })
      .select(SAFE)
      .single();
    if (error) throw new Error(error.message);
    return { note, editToken };
  });

export const updateGuestNote = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid(),
        editToken: z.string().uuid(),
        body: z.string().max(1000).optional(),
        x: z.number().min(0).max(5000).optional(),
        y: z.number().min(0).max(5000).optional(),
        remove: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin();
    const hash = await sha256(data.editToken);
    const q = db.from("whiteboard_notes");
    if (data.remove) {
      await q.delete().eq("id", data.id).eq("edit_token_hash", hash);
    } else {
      const patch: Record<string, unknown> = {};
      if (data.body !== undefined) patch.body = data.body;
      if (data.x !== undefined) patch.x = data.x;
      if (data.y !== undefined) patch.y = data.y;
      await q.update(patch).eq("id", data.id).eq("edit_token_hash", hash);
    }
    return { ok: true };
  });
