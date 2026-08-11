-- Point the profiles staff policy at the private helper
DROP POLICY IF EXISTS "profiles_staff_update" ON public.profiles;
CREATE POLICY "profiles_staff_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (private.is_staff(auth.uid()))
  WITH CHECK (private.is_staff(auth.uid()));

-- Trigger guard should use the private helper too
CREATE OR REPLACE FUNCTION public.tg_guard_access_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.access_status IS DISTINCT FROM OLD.access_status
     AND NOT private.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Only staff can change access status';
  END IF;
  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.tg_guard_access_status() FROM anon, authenticated;

-- Remove the publicly callable duplicate
DROP FUNCTION IF EXISTS public.is_staff(uuid);
