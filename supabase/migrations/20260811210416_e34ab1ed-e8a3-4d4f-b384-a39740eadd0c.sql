UPDATE public.assignments
SET lesson = jsonb_set(
  lesson::jsonb,
  '{steps,7,evidence}',
  '{"title":"Submit Your Repository Link","required":true,"allowLinks":true,"allowFiles":false,"linkRequired":true,"allowComments":true,"reflectionPrompt":"Paste your repository URL above, then briefly describe what your repository will hold."}'::jsonb,
  true
)
WHERE id = '6bb0622a-0c1d-4be7-a64e-a9c282faea00';