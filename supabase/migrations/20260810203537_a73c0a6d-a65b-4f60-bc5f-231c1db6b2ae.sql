UPDATE public.assignments SET
  title = 'Week 7 — Build the Landing Page',
  est_minutes = 75,
  platform = 'Replit',
  lesson = jsonb_build_object(
    'version', 1,
    'objective', 'Use Replit Agent to improve your app''s landing page so it clearly introduces your app, looks good on a phone, and encourages users to explore it.',
    'estimatedMinutes', 75,
    'difficulty', 'intermediate',
    'successCriteria', jsonb_build_array(
      'Your existing Replit project opens and runs in Preview',
      'You tested the layout at a narrower (mobile) width and noted any problems',
      'You asked Replit Agent to fix the layout problems you found',
      'You made one final improvement from your App_Revisions document',
      'You uploaded screenshots of each improvement with the Agent chat visible'
    ),
    'overview', 'Your Replit project now has its first version of your app. In this assignment, you will improve the landing page, which is the first screen users see when they visit your app.

Instead of manually editing code, you will give Replit Agent clear instructions about what you want changed. You will use the app description, branding, and marketing work you created earlier in the course to guide the design.

Think of Replit Agent as an AI development assistant. You provide the direction; Replit Agent helps build it.',
    'steps', jsonb_build_array(
      jsonb_build_object(
        'id', 'step-1',
        'title', 'Step 1: Open Your Existing Replit Project',
        'body', 'Sign in to Replit. Open your existing project and wait for the project to load.

Open your app''s **Preview**.

**Test the mobile layout.** Use the Replit Preview to view your project at a narrower width. Look for:

- Text that is too large
- Buttons that are difficult to tap
- Images that do not fit
- Content that extends off the screen
- Navigation or buttons that are difficult to find

If you find a problem, ask Replit Agent to fix it.'
      ),
      jsonb_build_object(
        'id', 'step-2',
        'title', 'Step 2: Make One Final Improvement',
        'body', 'Open your **App_Revisions** document and ask Replit Agent to make those specific improvements. Be specific.

Screenshot each improvement with the Agent chat visible.

/evidence',
        'evidence', jsonb_build_object(
          'title', 'Upload screenshots of each improvement (Agent chat visible)',
          'required', true,
          'acceptedFiles', jsonb_build_array('png','jpg','jpeg','pdf','docx','zip'),
          'allowLinks', true,
          'maxFiles', 5,
          'maxSizeMb', 50
        )
      )
    ),
    'checklist', jsonb_build_array(
      'Project opens and runs in Replit Preview',
      'Mobile-width layout reviewed for text, buttons, images, and overflow',
      'Layout problems sent to Replit Agent as clear instructions',
      'Final improvement from App_Revisions requested and applied',
      'Screenshots uploaded showing each improvement with the Agent chat visible'
    ),
    'resources', jsonb_build_array(
      jsonb_build_object('label', 'Replit', 'url', 'https://replit.com'),
      jsonb_build_object('label', 'Replit Agent docs', 'url', 'https://docs.replit.com/replitai/agent')
    )
  ),
  updated_at = now()
WHERE id = '31aca571-fef6-4b84-b807-6def93eb61e9';