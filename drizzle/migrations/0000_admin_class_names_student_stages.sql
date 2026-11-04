ALTER TABLE public.class_members ADD COLUMN stage text NOT NULL DEFAULT 'Active', ADD COLUMN stage_changed_on date;
CREATE OR REPLACE FUNCTION public.tg_guard_class_management() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_TABLE_NAME = 'classes' THEN
    IF NEW.name IS DISTINCT FROM OLD.name AND auth.role() IS DISTINCT FROM 'service_role' AND NOT private.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can rename classes';
    END IF;
  ELSE
    IF NEW.stage NOT IN ('Active', 'Completed', 'Dropped', 'Withdrew') THEN RAISE EXCEPTION 'Invalid student stage'; END IF;
    IF NEW.stage <> 'Active' AND NEW.stage_changed_on IS NULL THEN RAISE EXCEPTION 'Stage change date is required'; END IF;
    IF NEW.stage = 'Active' THEN NEW.stage_changed_on := NULL; END IF;
    IF TG_OP = 'INSERT' THEN
      IF (NEW.stage <> 'Active' OR NEW.stage_changed_on IS NOT NULL) AND auth.role() IS DISTINCT FROM 'service_role' AND NOT private.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Only admins can change student stages'; END IF;
    ELSIF (NEW.stage IS DISTINCT FROM OLD.stage OR NEW.stage_changed_on IS DISTINCT FROM OLD.stage_changed_on) AND auth.role() IS DISTINCT FROM 'service_role' AND NOT private.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can change student stages';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.tg_guard_class_management() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER guard_class_name BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.tg_guard_class_management();
CREATE TRIGGER guard_student_stage BEFORE INSERT OR UPDATE ON public.class_members FOR EACH ROW EXECUTE FUNCTION public.tg_guard_class_management();