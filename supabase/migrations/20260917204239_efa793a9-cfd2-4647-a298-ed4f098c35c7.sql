DROP POLICY IF EXISTS "Owners manage own whiteboards" ON public.whiteboards;
DROP POLICY IF EXISTS "Class members view class whiteboards" ON public.whiteboards;
DROP POLICY IF EXISTS "Anyone signed in can view templates" ON public.whiteboards;

CREATE POLICY "Signed in users can view boards"
  ON public.whiteboards FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff can create boards"
  ON public.whiteboards FOR INSERT TO authenticated
  WITH CHECK (private.is_staff(auth.uid()) AND owner_id = auth.uid());

CREATE POLICY "Staff can delete boards"
  ON public.whiteboards FOR DELETE TO authenticated
  USING (private.is_staff(auth.uid()));