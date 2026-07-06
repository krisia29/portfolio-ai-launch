-- ============================================================
-- 1. Private schema for SECURITY DEFINER helpers
-- ============================================================
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role);
$$;

CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role IN ('teacher','admin'));
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_staff(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_staff(uuid) TO authenticated, service_role;

-- ============================================================
-- 2. Drop policies that reference public.has_role / public.is_staff
--    and recreate them against private.*
-- ============================================================

-- announcements
DROP POLICY IF EXISTS "ann_read" ON public.announcements;
DROP POLICY IF EXISTS "ann_staff" ON public.announcements;
CREATE POLICY "ann_read" ON public.announcements FOR SELECT USING (
  private.is_staff(auth.uid())
  OR (class_id IS NULL)
  OR EXISTS (SELECT 1 FROM public.class_members cm WHERE cm.class_id = announcements.class_id AND cm.student_id = auth.uid())
);
CREATE POLICY "ann_staff" ON public.announcements FOR ALL USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- assignments
DROP POLICY IF EXISTS "assignments_read_published" ON public.assignments;
DROP POLICY IF EXISTS "assignments_staff_manage" ON public.assignments;
CREATE POLICY "assignments_read_published" ON public.assignments FOR SELECT USING (
  status = 'published'::assignment_status OR private.is_staff(auth.uid())
);
CREATE POLICY "assignments_staff_manage" ON public.assignments FOR ALL USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- badges
DROP POLICY IF EXISTS "badges_staff" ON public.badges;
CREATE POLICY "badges_staff" ON public.badges FOR ALL USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- certificates
DROP POLICY IF EXISTS "cert_read" ON public.certificates;
DROP POLICY IF EXISTS "cert_staff" ON public.certificates;
CREATE POLICY "cert_read" ON public.certificates FOR SELECT USING (student_id = auth.uid() OR private.is_staff(auth.uid()));
CREATE POLICY "cert_staff" ON public.certificates FOR ALL USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- class_assignments
DROP POLICY IF EXISTS "class_assignments_read" ON public.class_assignments;
DROP POLICY IF EXISTS "class_assignments_staff_manage" ON public.class_assignments;
CREATE POLICY "class_assignments_read" ON public.class_assignments FOR SELECT USING (
  private.is_staff(auth.uid())
  OR EXISTS (SELECT 1 FROM public.class_members cm WHERE cm.class_id = class_assignments.class_id AND cm.student_id = auth.uid())
);
CREATE POLICY "class_assignments_staff_manage" ON public.class_assignments FOR ALL USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- class_members
DROP POLICY IF EXISTS "class_members_self_read" ON public.class_members;
DROP POLICY IF EXISTS "class_members_staff_manage" ON public.class_members;
CREATE POLICY "class_members_self_read" ON public.class_members FOR SELECT USING (student_id = auth.uid() OR private.is_staff(auth.uid()));
CREATE POLICY "class_members_staff_manage" ON public.class_members FOR ALL USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- classes
DROP POLICY IF EXISTS "classes_staff_manage" ON public.classes;
DROP POLICY IF EXISTS "classes_lookup_by_code" ON public.classes;
CREATE POLICY "classes_staff_manage" ON public.classes FOR ALL USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
-- NOTE: classes_lookup_by_code intentionally removed. Class lookup by code is
-- now done exclusively through the join_class_by_code() SECURITY DEFINER
-- function below, which never exposes the join_code or roster to the caller.

-- github_repo_snapshots
DROP POLICY IF EXISTS "snapshots_via_submission" ON public.github_repo_snapshots;
CREATE POLICY "snapshots_via_submission" ON public.github_repo_snapshots FOR ALL
  USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = github_repo_snapshots.submission_id AND (s.student_id = auth.uid() OR private.is_staff(auth.uid()))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = github_repo_snapshots.submission_id AND (s.student_id = auth.uid() OR private.is_staff(auth.uid()))));

-- modules
DROP POLICY IF EXISTS "modules_staff_manage" ON public.modules;
CREATE POLICY "modules_staff_manage" ON public.modules FOR ALL USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- resources
DROP POLICY IF EXISTS "res_staff" ON public.resources;
CREATE POLICY "res_staff" ON public.resources FOR ALL USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- student_badges
DROP POLICY IF EXISTS "sb_read" ON public.student_badges;
DROP POLICY IF EXISTS "sb_staff" ON public.student_badges;
CREATE POLICY "sb_read" ON public.student_badges FOR SELECT USING (
  student_id = auth.uid()
  OR private.is_staff(auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = student_badges.student_id AND p.portfolio_public = true)
);
CREATE POLICY "sb_staff" ON public.student_badges FOR ALL USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- submission_artifacts
DROP POLICY IF EXISTS "artifacts_via_submission" ON public.submission_artifacts;
CREATE POLICY "artifacts_via_submission" ON public.submission_artifacts FOR ALL
  USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_artifacts.submission_id AND (s.student_id = auth.uid() OR private.is_staff(auth.uid()))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_artifacts.submission_id AND (s.student_id = auth.uid() OR private.is_staff(auth.uid()))));

-- submissions
DROP POLICY IF EXISTS "submissions_self_read" ON public.submissions;
DROP POLICY IF EXISTS "submissions_staff_manage" ON public.submissions;
CREATE POLICY "submissions_self_read" ON public.submissions FOR SELECT USING (student_id = auth.uid() OR private.is_staff(auth.uid()));
CREATE POLICY "submissions_staff_manage" ON public.submissions FOR ALL USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- user_roles
DROP POLICY IF EXISTS "user_roles_admin_read" ON public.user_roles;
CREATE POLICY "user_roles_admin_read" ON public.user_roles FOR SELECT USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- ============================================================
-- 3. Drop the old public.has_role / public.is_staff (now unused)
-- ============================================================
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_staff(uuid);

-- ============================================================
-- 4. Class join code lookup — replaces the "USING (true)" policy
-- ============================================================
CREATE OR REPLACE FUNCTION public.join_class_by_code(p_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_class_id uuid;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;
  IF p_code IS NULL OR length(btrim(p_code)) = 0 THEN
    RAISE EXCEPTION 'invalid_code' USING ERRCODE = '22023';
  END IF;

  SELECT id INTO v_class_id
  FROM public.classes
  WHERE join_code = upper(btrim(p_code))
    AND archived = false
  LIMIT 1;

  IF v_class_id IS NULL THEN
    RAISE EXCEPTION 'class_not_found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.class_members (class_id, student_id)
  VALUES (v_class_id, v_uid)
  ON CONFLICT DO NOTHING;

  RETURN v_class_id;
END;
$$;

REVOKE ALL ON FUNCTION public.join_class_by_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_class_by_code(text) TO authenticated;

-- ============================================================
-- 5. Profiles: stop exposing student emails to the public internet
-- ============================================================
DROP POLICY IF EXISTS "profiles_read_all" ON public.profiles;

-- Anonymous visitors can only see profiles that the student has published,
-- and column grants below prevent them from ever selecting the email column.
CREATE POLICY "profiles_public_portfolio_read" ON public.profiles
  FOR SELECT TO anon
  USING (portfolio_public = true);

-- Signed-in users continue to see profiles (needed for staff review, class
-- rosters, and displaying names on submissions).
CREATE POLICY "profiles_authenticated_read" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

-- Defense in depth: even if a policy accidentally opened up more rows to
-- anon in the future, anon can never select the email column.
REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (id, display_name, nickname, avatar_url, github_username, github_profile_url, portfolio_public, school, created_at, updated_at)
  ON public.profiles TO anon;