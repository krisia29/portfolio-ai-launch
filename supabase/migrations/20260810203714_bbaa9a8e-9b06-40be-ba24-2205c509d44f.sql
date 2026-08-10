UPDATE public.assignments SET
  title = 'Week 7 — Add Navigation and Additional Pages',
  est_minutes = 75,
  platform = 'Replit',
  lesson = jsonb_build_object(
    'version', 1,
    'objective', 'Use Replit Agent to expand your app prototype by creating additional screens and a simple navigation system that allows users to move through your app.',
    'estimatedMinutes', 75,
    'difficulty', 'intermediate',
    'successCriteria', jsonb_build_array(
      'You identified at least three screens your user needs, based on your User Journey',
      'You listed those screens in your App_Revisions document',
      'Replit Agent added the screens plus a working navigation system',
      'Your original landing page still works and matches the new screens visually',
      'You tested every navigation item and uploaded screenshots with the Agent chat visible'
    ),
    'overview', 'Your landing page gives users their first impression of your app. Now it''s time to give them somewhere to go.

In this assignment, you will expand your prototype by adding additional screens and navigation. You will use the user journey and app workflow you created in Week 5 to decide which screens your app needs.

You will continue using Replit Agent instead of manually creating files or writing code. Your job is to clearly explain what you want the app to do.',
    'steps', jsonb_build_array(
      jsonb_build_object(
        'id', 'step-1',
        'title', 'Step 1: Open Your Existing Project',
        'body', 'Open the app **Preview**. Make sure your landing page is still working.

Open the **User Journey** document from your repository.

Review the steps a user takes when interacting with your app. For example:

`Home → Sign Up → Dashboard → Choose Goal → Receive Recommendation`

Identify **at least three screens** your user needs.

In your **App_Revisions** document, write them down. For example:

- Dashboard
- Recommendations'
      ),
      jsonb_build_object(
        'id', 'step-2',
        'title', 'Step 2: Ask Replit Agent to Add Your Screens',
        'body', 'Open the Replit Agent conversation in your existing project.

Copy the prompt below and replace the bracketed sections.

(Expand my existing app [APP NAME] by adding the following screens: [SCREEN 1], [SCREEN 2], [SCREEN 3, IF NEEDED]. These screens are based on the user journey and app workflow I created earlier in this project. Keep the existing landing page and its working features. Add a simple navigation system that allows users to move between the screens. The navigation should include: [NAVIGATION ITEM 1], [NAVIGATION ITEM 2], [NAVIGATION ITEM 3]. Use the same visual style, colors, typography, and branding already established on my landing page. Each screen should have a clear purpose. Use realistic sample content based on my app concept. Make sure the navigation works when users click each item. Make the screens responsive so they work on both desktop and phone-sized screens. Do not remove or break the existing landing page. Do not add unrelated features. After making the changes, show me the updated project in Preview.)

Screenshot the revisions with the chat bot visible.

/evidence',
        'evidence', jsonb_build_object(
          'title', 'Upload screenshots of the revisions (Agent chat visible)',
          'required', true,
          'acceptedFiles', jsonb_build_array('png','jpg','jpeg','pdf','docx','zip'),
          'allowLinks', true,
          'maxFiles', 5,
          'maxSizeMb', 50
        )
      ),
      jsonb_build_object(
        'id', 'step-3',
        'title', 'Step 3: Test Your Navigation',
        'body', 'Click each navigation item. For every link or button, test that every direction lands in the appropriate section as listed in your user journey.

If a button or navigation item does not work, tell Replit Agent exactly what is wrong. For example:

(The Dashboard navigation button does not open the Dashboard screen. Please fix the navigation without changing the existing design.)'
      )
    ),
    'checklist', jsonb_build_array(
      'Landing page still loads and works in Preview',
      'At least three new screens identified from the User Journey',
      'Screens listed in App_Revisions',
      'Replit Agent added the screens and a working navigation system',
      'Every navigation item tested and any broken links reported to the Agent',
      'Screenshots uploaded with the Agent chat visible'
    ),
    'resources', jsonb_build_array(
      jsonb_build_object('label', 'Replit', 'url', 'https://replit.com'),
      jsonb_build_object('label', 'Replit Agent docs', 'url', 'https://docs.replit.com/replitai/agent')
    )
  ),
  updated_at = now()
WHERE id = '813ec9d3-2290-44e8-acee-41a67d953f84';