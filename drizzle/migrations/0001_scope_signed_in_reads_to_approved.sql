CREATE OR REPLACE FUNCTION private.is_approved(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT private.is_staff(_uid) OR EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = _uid AND p.access_status = 'approved');
$$;
REVOKE ALL ON FUNCTION private.is_approved(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_approved(uuid) TO authenticated;

DROP POLICY IF EXISTS badges_read_signed_in ON public.badges;
CREATE POLICY badges_read_approved ON public.badges FOR SELECT TO authenticated USING (private.is_approved(auth.uid()));
DROP POLICY IF EXISTS modules_read_signed_in ON public.modules;
CREATE POLICY modules_read_approved ON public.modules FOR SELECT TO authenticated USING (private.is_approved(auth.uid()));
DROP POLICY IF EXISTS res_read_signed_in ON public.resources;
CREATE POLICY res_read_approved ON public.resources FOR SELECT TO authenticated USING (private.is_approved(auth.uid()));
DROP POLICY IF EXISTS "Signed in users can view boards" ON public.whiteboards;
CREATE POLICY "Approved users can view boards" ON public.whiteboards FOR SELECT TO authenticated USING (private.is_approved(auth.uid()));
DROP POLICY IF EXISTS "Authenticated users can read notes" ON public.whiteboard_notes;
CREATE POLICY "Approved users or shared boards can read notes" ON public.whiteboard_notes FOR SELECT TO authenticated
  USING (private.is_approved(auth.uid()) OR author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.whiteboards w WHERE w.id = whiteboard_notes.whiteboard_id AND w.share_enabled));

DROP POLICY IF EXISTS class_members_self_join ON public.class_members;