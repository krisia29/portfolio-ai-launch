ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS requested_role text NOT NULL DEFAULT 'student';

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE user_count INT; assigned public.app_role; req text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  assigned := CASE WHEN user_count=0 THEN 'admin'::public.app_role ELSE 'student'::public.app_role END;
  req := CASE WHEN NEW.raw_user_meta_data->>'requested_role' = 'admin' THEN 'admin' ELSE 'student' END;

  INSERT INTO public.profiles (id, display_name, email, avatar_url, access_status, requested_role) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    CASE WHEN assigned = 'admin'::public.app_role THEN 'approved' ELSE 'pending' END,
    req
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned) ON CONFLICT DO NOTHING;

  INSERT INTO public.class_members (class_id, student_id)
  SELECT i.class_id, NEW.id FROM public.class_invites i
  WHERE lower(i.email) = lower(NEW.email)
  ON CONFLICT DO NOTHING;
  DELETE FROM public.class_invites WHERE lower(email) = lower(NEW.email);
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.approve_admin_request(_user_id uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve admin requests';
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'admin') ON CONFLICT DO NOTHING;
  UPDATE public.profiles SET access_status = 'approved', access_decided_at = now(),
    access_decided_by = auth.uid(), requested_role = 'admin' WHERE id = _user_id;
END;$$;

REVOKE ALL ON FUNCTION public.approve_admin_request(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.approve_admin_request(uuid) TO authenticated;