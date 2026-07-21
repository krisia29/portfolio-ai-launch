-- 1. Add JSON lesson column
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS lesson JSONB;

-- 2. Assignment progress table (per-student step tracking + screenshots)
CREATE TABLE IF NOT EXISTS public.assignment_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  completed_steps TEXT[] NOT NULL DEFAULT '{}',
  screenshots JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, assignment_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignment_progress TO authenticated;
GRANT ALL ON public.assignment_progress TO service_role;

ALTER TABLE public.assignment_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "progress_own_all" ON public.assignment_progress
  FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

CREATE POLICY "progress_staff_read" ON public.assignment_progress
  FOR SELECT USING (private.is_staff(auth.uid()));

CREATE TRIGGER assignment_progress_touch BEFORE UPDATE ON public.assignment_progress
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- 3. Storage policies for submission-screenshots bucket
-- Path convention: {student_id}/{assignment_id}/{step_id}-{filename}
CREATE POLICY "screenshots_own_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'submission-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "screenshots_own_write" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'submission-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "screenshots_own_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'submission-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "screenshots_own_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'submission-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "screenshots_staff_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'submission-screenshots' AND private.is_staff(auth.uid()));