ALTER TABLE public.whiteboards
  ADD COLUMN IF NOT EXISTS share_token text UNIQUE DEFAULT replace(gen_random_uuid()::text,'-',''),
  ADD COLUMN IF NOT EXISTS share_enabled boolean NOT NULL DEFAULT true;
UPDATE public.whiteboards SET share_token = replace(gen_random_uuid()::text,'-','') WHERE share_token IS NULL;
ALTER TABLE public.whiteboards ALTER COLUMN share_token SET NOT NULL;

ALTER TABLE public.whiteboard_notes ALTER COLUMN author_id DROP NOT NULL;
ALTER TABLE public.whiteboard_notes ADD COLUMN IF NOT EXISTS edit_token_hash text;

GRANT SELECT ON public.whiteboard_notes TO anon;
CREATE POLICY "Anyone can view notes on shared boards"
ON public.whiteboard_notes FOR SELECT TO anon
USING (EXISTS (SELECT 1 FROM public.whiteboards w WHERE w.id = whiteboard_id AND w.share_enabled));