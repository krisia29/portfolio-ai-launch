CREATE TABLE public.class_invites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  email text NOT NULL,
  invited_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (class_id, email)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_invites TO authenticated;
GRANT ALL ON public.class_invites TO service_role;

ALTER TABLE public.class_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view invites" ON public.class_invites
  FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Staff can create invites" ON public.class_invites
  FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can delete invites" ON public.class_invites
  FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

CREATE INDEX class_invites_email_idx ON public.class_invites (lower(email));

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

  INSERT INTO public.class_members (class_id, student_id)
  SELECT i.class_id, NEW.id FROM public.class_invites i
  WHERE lower(i.email) = lower(NEW.email)
  ON CONFLICT DO NOTHING;

  DELETE FROM public.class_invites WHERE lower(email) = lower(NEW.email);

  RETURN NEW;
END;$function$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;