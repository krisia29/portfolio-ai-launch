UPDATE assignments
SET lesson = (lesson - 'objectives') || jsonb_build_object(
  'objective',
  CASE WHEN jsonb_typeof(lesson->'objectives') = 'array'
    THEN (SELECT string_agg(x, ' ') FROM jsonb_array_elements_text(lesson->'objectives') AS t(x))
    ELSE lesson->>'objectives' END
)
WHERE lesson IS NOT NULL
  AND lesson ? 'objectives'
  AND (lesson->>'objective') IS NULL;