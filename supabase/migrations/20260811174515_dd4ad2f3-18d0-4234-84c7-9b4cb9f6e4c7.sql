REVOKE EXECUTE ON FUNCTION public.tg_guard_access_status() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.tg_touch_updated_at() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;