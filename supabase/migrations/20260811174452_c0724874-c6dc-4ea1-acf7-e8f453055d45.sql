CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('teacher','admin')
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS access_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS access_requested_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS access_decided_at timestamptz,
  ADD COLUMN IF NOT EXISTS access_decided_by uuid;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_access_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_access_status_check
  CHECK (access_status IN ('pending','approved','denied'));

UPDATE public.profiles SET access_status = 'approved' WHERE access_status = 'pending';

DROP POLICY IF EXISTS "profiles_staff_update" ON public.profiles;
CREATE POLICY "profiles_staff_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.tg_guard_access_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.access_status IS DISTINCT FROM OLD.access_status
     AND NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Only staff can change access status';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_guard_access_status ON public.profiles;
CREATE TRIGGER profiles_guard_access_status
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_guard_access_status();

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE user_count INT; assigned public.app_role;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  assigned := CASE WHEN user_count=0 THEN 'admin'::public.app_role ELSE 'student'::public.app_role END;

  INSERT INTO public.profiles (id, display_name, email, avatar_url, access_status) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    CASE WHEN assigned = 'admin'::public.app_role THEN 'approved' ELSE 'pending' END
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;$function$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;