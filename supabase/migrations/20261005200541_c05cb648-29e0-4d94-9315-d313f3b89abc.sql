CREATE OR REPLACE FUNCTION public.tg_guard_submission_review()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF private.is_staff(auth.uid()) OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  IF NEW.status NOT IN ('draft','submitted') THEN
    RAISE EXCEPTION 'Only admins can approve or request revisions';
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.score := NULL; NEW.feedback_md := NULL; NEW.reviewed_at := NULL;
    NEW.reviewed_by := NULL; NEW.featured := false;
  ELSE
    NEW.score := OLD.score; NEW.feedback_md := OLD.feedback_md;
    NEW.reviewed_at := OLD.reviewed_at; NEW.reviewed_by := OLD.reviewed_by;
    NEW.featured := OLD.featured;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.tg_guard_submission_review() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER submissions_guard_review BEFORE INSERT OR UPDATE ON public.submissions
FOR EACH ROW EXECUTE FUNCTION public.tg_guard_submission_review();