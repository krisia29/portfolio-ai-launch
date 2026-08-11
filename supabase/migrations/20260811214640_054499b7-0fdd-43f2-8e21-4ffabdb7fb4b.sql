CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "app_settings_staff_read" ON public.app_settings
  FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()));

CREATE TRIGGER app_settings_touch_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();