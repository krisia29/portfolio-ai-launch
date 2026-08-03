UPDATE public.assignments SET
  title = 'Week 5 — Create an App Workflow Diagram',
  objectives = 'Create a workflow diagram that visually explains how users move through your mobile app from start to finish.',
  est_minutes = 55,
  difficulty = 'beginner',
  instructions_md = NULL,
  deliverables_md = NULL,
  github_instructions_md = NULL,
  readme_template_md = NULL,
  created_at = '2026-07-24 20:24:10.398975+00',
  lesson = jsonb_build_object(
    'version', 1,
    'objective', 'Create a workflow diagram that visually explains how users move through your mobile app from start to finish.',
    'overview', 'Before developers build an app, they create a workflow diagram. A workflow diagram is a visual map that shows the order of screens, actions, and decisions a user experiences while using an app.

In this assignment, you will use the work you completed in previous assignments—including your app concept, research, key insights, mind map, and user journey—to create a workflow diagram in NapkinAI. This diagram will become the blueprint for building your app prototype in Replit during Weeks 7 and 8.',
    'estimatedMinutes', 55,
    'difficulty', 'beginner',
    'steps', jsonb_build_array(
      jsonb_build_object(
        'id','s1',
        'title','Step 1: Gather Your Previous Work',
        'body','Before creating your workflow, open the documents you created in earlier assignments.

You should have:

- Your App Concept Document
- Your User Personas
- Your Claude app improvements
- Your research summary from NotebookLM
- Your key insights
- Your NapkinAI Mind Map
- Your User Journey

These documents will help you design a workflow that makes sense for your users.'
      ),
      jsonb_build_object(
        'id','s2',
        'title','Step 2: Open NapkinAI',
        'body','1. Click **New Diagram** (or create a new visual if prompted).
2. **List Your App Screens.** Think about the screens a user will visit while using your app.

Examples include:

- Welcome Screen
- Login or Sign Up
- Home Screen
- Dashboard
- Search
- Create New Item
- Profile
- Settings
- Help
- Results
- Confirmation Screen

Your app may have different screens depending on the problem it solves.

3. Write down the screens before arranging them.
4. **Arrange the Screens in Order** that a user would experience them.

For example:

Welcome
↓
Create Account
↓
Home Screen
↓
Choose Feature
↓
Complete Task
↓
View Results
↓
Save Progress
↓
Return to Home

Your workflow should clearly show how one screen connects to the next.'
      ),
      jsonb_build_object(
        'id','s3',
        'title','Step 3: Review Your Workflow',
        'body','1. Before exporting your diagram, check the following:

- Does every screen connect to another screen?
- Is the order easy to understand?
- Could someone unfamiliar with your app follow the workflow?
- Does the workflow match your User Journey from the previous assignment?
- Does it support the goals of your User Persona?

2. If needed, rearrange or simplify your workflow.'
      ),
      jsonb_build_object(
        'id','s4',
        'title','Step 4: Export Your Diagram',
        'body','Export your workflow as a PDF and save as: `App-Workflow-Diagram`

Upload the file to your existing GitHub repository.',
        'evidence', jsonb_build_object(
          'title','Upload your app workflow diagram',
          'required', true,
          'allowLinks', false,
          'reflectionRequired', false
        )
      )
    )
  )
WHERE id = '2f005f69-492e-40c4-b5e9-fb764e5b3e22';