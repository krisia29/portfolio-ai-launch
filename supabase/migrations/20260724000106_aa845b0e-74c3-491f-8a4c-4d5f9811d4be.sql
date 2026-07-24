
CREATE OR REPLACE FUNCTION private.build_lesson_from_md(
  p_instructions text,
  p_objective text,
  p_est_minutes int,
  p_difficulty text
) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  v_objective text;
  v_overview text;
  v_success_json jsonb := '[]'::jsonb;
  v_steps_json jsonb := '[]'::jsonb;
  v_body text;
  v_line text;
  v_match text[];
  v_after_instructions text;
  v_step_matches text[];
  v_step_title text;
  v_step_body text;
  v_step_id text;
  v_step_num int := 0;
  v_has_evidence boolean;
  v_evidence_step_indices int[] := '{}';
  v_i int;
  v_step_obj jsonb;
  v_steps jsonb[] := '{}';
  v_criterion text;
  v_criteria text[];
BEGIN
  -- Objective
  v_match := regexp_match(p_instructions, '###\s+Learning Objective\s*\n+([^\n]+(?:\n(?!###)[^\n]*)*)');
  IF v_match IS NOT NULL THEN
    v_objective := trim(v_match[1]);
  ELSE
    v_objective := coalesce(p_objective, '');
  END IF;

  -- Overview (or Assignment Overview)
  v_match := regexp_match(p_instructions, '###?\s+(?:Assignment )?Overview\s*\n+((?:.|\n)*?)(?=\n###?\s+|\Z)');
  IF v_match IS NOT NULL THEN
    v_overview := trim(v_match[1]);
  END IF;

  -- Success Criteria
  v_match := regexp_match(p_instructions, '###\s+Success Criteria\s*\n+((?:.|\n)*?)(?=\n###\s+|\Z)');
  IF v_match IS NOT NULL THEN
    FOR v_criterion IN
      SELECT trim(regexp_replace(l, '^\s*[-*]\s+', ''))
      FROM regexp_split_to_table(v_match[1], '\n') l
      WHERE l ~ '^\s*[-*]\s+\S'
    LOOP
      v_success_json := v_success_json || to_jsonb(v_criterion);
    END LOOP;
  END IF;

  -- Extract the Instructions section (between ### Instructions and next top-level ###)
  v_match := regexp_match(p_instructions, '###\s+Instructions\s*\n+((?:.|\n)*?)(?=\n###\s+(?:Submission|Deliverables|Resources|Rubric|Reflection)|\Z)');
  IF v_match IS NOT NULL THEN
    v_after_instructions := v_match[1];
  ELSE
    v_after_instructions := p_instructions;
  END IF;

  -- Split into steps by "#### Step N..." or "### Step N..." headings
  -- Use a marker replacement approach
  DECLARE
    parts text[];
    p text;
    m text[];
  BEGIN
    -- Normalize: insert a marker before each step heading
    v_after_instructions := regexp_replace(
      v_after_instructions,
      '(^|\n)(####?\s+Step\s+[0-9]+[^\n]*)',
      E'\n<<<STEPSPLIT>>>\\2',
      'g'
    );
    parts := string_to_array(v_after_instructions, '<<<STEPSPLIT>>>');
    FOREACH p IN ARRAY parts LOOP
      m := regexp_match(p, '^####?\s+Step\s+([0-9]+)[.\s—-]+([^\n]+)\n+((?:.|\n)*)$');
      IF m IS NOT NULL THEN
        v_step_num := v_step_num + 1;
        v_step_title := 'Step ' || m[1] || ': ' || trim(m[2]);
        v_step_body := m[3];

        -- Detect evidence markers
        v_has_evidence := (v_step_body ~* 'Screenshot\s+placeholder')
                      OR (v_step_body ~ '(^|\n)\s*/evidence\s*(\n|$)');

        -- Strip Screenshot placeholder blockquote lines
        v_step_body := regexp_replace(
          v_step_body,
          '(^|\n)\s*>\s*\*\*\s*Screenshot\s+placeholder[^\n]*',
          '',
          'gi'
        );
        v_step_body := regexp_replace(
          v_step_body,
          '(^|\n)\s*[-*+]\s*\*\*\s*Screenshot\s+placeholder[^\n]*',
          '',
          'gi'
        );
        v_step_body := regexp_replace(
          v_step_body,
          '(^|\n)\s*(?:\*\*)?Screenshot\s+placeholder[^\n]*',
          '',
          'gi'
        );
        -- Strip inline /evidence token
        v_step_body := regexp_replace(
          v_step_body,
          '(^|\n)\s*/evidence\s*',
          E'\\1',
          'g'
        );

        v_step_body := trim(both E'\n\t ' from v_step_body);
        v_step_id := 'step-' || v_step_num;

        v_step_obj := jsonb_build_object(
          'id', v_step_id,
          'title', v_step_title,
          'body', v_step_body
        );

        IF v_has_evidence THEN
          v_evidence_step_indices := v_evidence_step_indices || v_step_num;
        END IF;

        v_steps := v_steps || v_step_obj;
      END IF;
    END LOOP;
  END;

  -- Attach evidence to steps that had a marker; final one required, others optional
  IF array_length(v_evidence_step_indices, 1) IS NULL AND array_length(v_steps, 1) IS NOT NULL THEN
    -- No explicit markers: attach a single required evidence to the last step
    v_evidence_step_indices := ARRAY[array_length(v_steps, 1)];
  END IF;

  IF array_length(v_evidence_step_indices, 1) IS NOT NULL THEN
    FOR v_i IN 1 .. array_length(v_evidence_step_indices, 1) LOOP
      DECLARE
        idx int := v_evidence_step_indices[v_i];
        is_last boolean := (v_i = array_length(v_evidence_step_indices, 1));
        ev jsonb;
      BEGIN
        ev := jsonb_build_object(
          'title', 'Upload Evidence',
          'required', is_last,
          'optional', NOT is_last,
          'acceptedFiles', jsonb_build_array('png','jpg','jpeg','pdf','docx','pptx','zip'),
          'allowLinks', true,
          'maxFiles', 5,
          'maxSizeMb', 50,
          'reflectionPrompt', 'Add a short note about what this file shows.'
        );
        v_steps[idx] := v_steps[idx] || jsonb_build_object('evidence', ev);
      END;
    END LOOP;
  END IF;

  -- Build steps json array
  v_steps_json := to_jsonb(v_steps);

  RETURN jsonb_strip_nulls(jsonb_build_object(
    'version', 1,
    'objective', v_objective,
    'overview', v_overview,
    'estimatedMinutes', p_est_minutes,
    'difficulty', lower(coalesce(p_difficulty,'')),
    'successCriteria', v_success_json,
    'steps', v_steps_json
  ));
END;
$$;

-- Apply to all non-glossary assignments missing a lesson
UPDATE assignments a
SET lesson = private.build_lesson_from_md(a.instructions_md, a.objectives, a.est_minutes, a.difficulty)
WHERE a.lesson IS NULL
  AND a.module_id IN (SELECT id FROM modules WHERE slug != 'glossary')
  AND a.instructions_md IS NOT NULL;

-- Clean up
DROP FUNCTION private.build_lesson_from_md(text, text, int, text);
