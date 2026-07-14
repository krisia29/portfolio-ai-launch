
CREATE TABLE public.whiteboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled whiteboard',
  folder TEXT NOT NULL DEFAULT 'personal' CHECK (folder IN ('personal','class','assignment','group','template','archived')),
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
  snapshot JSONB,
  thumbnail TEXT,
  is_template BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_edited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_whiteboards_owner ON public.whiteboards(owner_id);
CREATE INDEX idx_whiteboards_class ON public.whiteboards(class_id);
CREATE INDEX idx_whiteboards_assignment ON public.whiteboards(assignment_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whiteboards TO authenticated;
GRANT ALL ON public.whiteboards TO service_role;

ALTER TABLE public.whiteboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage own whiteboards"
  ON public.whiteboards FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Staff view all whiteboards"
  ON public.whiteboards FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('teacher','admin')));

CREATE POLICY "Staff edit all whiteboards"
  ON public.whiteboards FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('teacher','admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('teacher','admin')));

CREATE POLICY "Class members view class whiteboards"
  ON public.whiteboards FOR SELECT
  TO authenticated
  USING (
    class_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.class_members cm
      WHERE cm.class_id = whiteboards.class_id AND cm.student_id = auth.uid()
    )
  );

CREATE POLICY "Anyone signed in can view templates"
  ON public.whiteboards FOR SELECT
  TO authenticated
  USING (is_template = true);

CREATE TRIGGER whiteboards_touch_updated_at
  BEFORE UPDATE ON public.whiteboards
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
