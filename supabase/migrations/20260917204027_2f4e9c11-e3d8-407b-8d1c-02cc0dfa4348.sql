CREATE TABLE public.whiteboard_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whiteboard_id uuid NOT NULL REFERENCES public.whiteboards(id) ON DELETE CASCADE,
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text,
  body text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT 'yellow',
  x double precision NOT NULL DEFAULT 0,
  y double precision NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX whiteboard_notes_board_idx ON public.whiteboard_notes(whiteboard_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whiteboard_notes TO authenticated;
GRANT ALL ON public.whiteboard_notes TO service_role;

ALTER TABLE public.whiteboard_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read notes"
  ON public.whiteboard_notes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can add their own notes"
  ON public.whiteboard_notes FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors and staff can update notes"
  ON public.whiteboard_notes FOR UPDATE TO authenticated
  USING (author_id = auth.uid() OR private.is_staff(auth.uid()))
  WITH CHECK (author_id = auth.uid() OR private.is_staff(auth.uid()));

CREATE POLICY "Authors and staff can delete notes"
  ON public.whiteboard_notes FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR private.is_staff(auth.uid()));

CREATE TRIGGER whiteboard_notes_touch BEFORE UPDATE ON public.whiteboard_notes
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

ALTER TABLE public.whiteboard_notes REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.whiteboard_notes;