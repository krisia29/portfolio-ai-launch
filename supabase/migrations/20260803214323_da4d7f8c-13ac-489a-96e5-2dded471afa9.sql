UPDATE public.assignments SET
  title = 'Week 5 – Build a User Journey',
  objectives = 'Create a visual user journey that shows how someone will use your mobile app from beginning to end.',
  est_minutes = 55,
  difficulty = 'beginner',
  instructions_md = NULL,
  deliverables_md = NULL,
  github_instructions_md = NULL,
  readme_template_md = NULL,
  lesson = jsonb_build_object(
    'version', 1,
    'objective', 'Create a visual user journey that shows how someone will use your mobile app from beginning to end.',
    'estimatedMinutes', 55,
    'difficulty', 'beginner',
    'overview', 'Great apps are designed around the people who use them. Before developers begin building an app, they often create a user journey to understand the experience from the user''s point of view.

A user journey is a step-by-step map showing how a person interacts with an app to complete a goal. It helps you organize your ideas, identify missing features, and improve the overall experience before any coding begins.

In the previous assignment, you created a mind map of your app idea. In this assignment, you will build on that work by creating a user journey that shows how someone moves through your app from opening it to successfully completing a task. This planning will make it much easier to build your app later in Replit.',
    'steps', jsonb_build_array(
      jsonb_build_object(
        'id', 's1',
        'title', 'Step 1 – Decide on Your Main User Goal',
        'body', 'Think about the primary reason someone would use your app. Ask yourself:

- What problem does my app solve?
- What is the first thing a user wants to accomplish?
- What would make the user feel successful?

Think of one sentence to describe your user''s main goal.

> **Example:** "The user wants to organize homework assignments and receive reminders before each due date."'
      ),
      jsonb_build_object(
        'id', 's2',
        'title', 'Step 2 – List the User''s Steps',
        'body', 'A user journey is made up of small actions. In a new document, write down the steps users would take to reach the main goal.

> **Example:** Open the app → Create an account or sign in → View the home screen → Add information → Receive recommendations → Save progress → Return later to continue'
      ),
      jsonb_build_object(
        'id', 's3',
        'title', 'Step 3 – Open NapkinAI',
        'body', 'Sign in to your NapkinAI account and create a new page for this assignment.

Using your list of user steps, create a visual journey. Arrange the steps in the order a person would experience them. Include:

- Starting point
- Major actions
- Decisions (if any)
- Final outcome

Use simple labels that are easy to understand. Your journey should clearly show how one step leads to the next.

> **Helpful Tip:** Keep your labels short. One short phrase is usually enough.',
        'evidence', jsonb_build_object(
          'title', 'Upload your user journey diagram',
          'required', true,
          'allowLinks', false,
          'reflectionRequired', false
        )
      ),
      jsonb_build_object(
        'id', 's4',
        'title', 'Step 4 – Export Your User Journey',
        'body', 'Export your completed diagram and save the file as: `AppName_UserJourney`

Upload the file to your existing GitHub repository.'
      )
    )
  )
WHERE id = '5685b32e-4c49-457e-87bc-ad542bb66049';

UPDATE public.assignments SET created_at = (
  SELECT created_at + interval '1 minute' FROM public.assignments WHERE id = 'f4269f0a-c47c-4dec-b7cd-0cdb6ccd7238'
) WHERE id = '5685b32e-4c49-457e-87bc-ad542bb66049';