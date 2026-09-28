-- Catalog tables: signed-in users only
DROP POLICY IF EXISTS modules_read_all ON public.modules;
CREATE POLICY modules_read_signed_in ON public.modules FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS badges_read ON public.badges;
CREATE POLICY badges_read_signed_in ON public.badges FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS res_read ON public.resources;
CREATE POLICY res_read_signed_in ON public.resources FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

-- Profiles: self, staff, or public portfolios
DROP POLICY IF EXISTS profiles_authenticated_read ON public.profiles;
CREATE POLICY profiles_self_or_staff_read ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR private.is_staff(auth.uid()) OR portfolio_public = true);

-- Whiteboards: hide share_token column from direct reads
DROP POLICY IF EXISTS "Signed in users can view boards" ON public.whiteboards;
CREATE POLICY "Signed in users can view boards" ON public.whiteboards FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
REVOKE SELECT ON public.whiteboards FROM authenticated, anon;
GRANT SELECT (id, owner_id, title, folder, class_id, assignment_id, snapshot, thumbnail, is_template, is_archived,
  last_edited_by, last_edited_at, created_at, updated_at, share_enabled) ON public.whiteboards TO authenticated;

CREATE OR REPLACE FUNCTION public.get_board_share_token(_board_id uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT share_token FROM public.whiteboards WHERE id = _board_id AND private.is_staff(auth.uid())
$$;
REVOKE EXECUTE ON FUNCTION public.get_board_share_token(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_board_share_token(uuid) TO authenticated;

-- Notes: hide edit_token_hash column
DROP POLICY IF EXISTS "Authenticated users can read notes" ON public.whiteboard_notes;
CREATE POLICY "Authenticated users can read notes" ON public.whiteboard_notes FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
REVOKE SELECT ON public.whiteboard_notes FROM authenticated, anon;
GRANT SELECT (id, whiteboard_id, author_id, author_name, body, color, x, y, created_at, updated_at)
  ON public.whiteboard_notes TO authenticated, anon;