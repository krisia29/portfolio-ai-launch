UPDATE assignments SET
  title = 'Week 5 — Create a Mind Map in NapkinAI',
  objectives = 'Create a visual mind map that organizes your mobile app idea, features, users, and goals using NapkinAI''s free tools.',
  est_minutes = 55,
  difficulty = 'beginner',
  instructions_md = NULL,
  deliverables_md = NULL,
  github_instructions_md = NULL,
  readme_template_md = NULL,
  reflection_questions = '[]'::jsonb,
  created_at = now(),
  lesson = $json$
{
  "version": 1,
  "objective": "Create a visual mind map that organizes your mobile app idea, features, users, and goals using NapkinAI's free tools.",
  "estimatedMinutes": 55,
  "difficulty": "beginner",
  "overview": "Before building your app, it is important to organize your ideas visually. A mind map is a diagram that starts with one main idea in the center and branches into related topics. It helps you see how different parts of your project connect.\n\nIn previous assignments, you researched your app idea, summarized your findings, and identified important insights. In this assignment, you will use that work to create a mind map in NapkinAI. This diagram will become a planning tool that you can refer to throughout the rest of the course as you begin designing and building your mobile app.",
  "steps": [
    {
      "id": "s1",
      "title": "Step 1: Gather Your Previous Work",
      "body": "Before opening NapkinAI, collect the materials you created in earlier assignments, including:\n\n- Your finalized app idea\n- Your app concept document\n- Your research summary\n- Your key insights\n\nHaving this information ready will make it easier to generate a useful mind map.\n\n> **Helpful Tip:** If you cannot find one of your previous documents, open your GitHub repository and locate the files you saved during earlier assignments."
    },
    {
      "id": "s2",
      "title": "Step 2: Open NapkinAI",
      "body": "Go to [napkin.ai](https://napkin.ai) and follow the free account registration process.\n\nOnce you are signed in, locate the button to create a new project or workspace.\n\n> **New Term — Workspace:** A workspace is the area where you create and organize your diagrams and visual ideas."
    },
    {
      "id": "s3",
      "title": "Step 3: Create Your Starting Prompt",
      "body": "Copy and paste a summary of your project into the workspace.\n\n> **Helpful Tip:** Do not start from scratch. Reuse the work you have already completed and improve it if needed."
    },
    {
      "id": "s4",
      "title": "Step 4: Generate a Mind Map",
      "body": "After entering your project summary, select the option to generate a visual diagram.\n\nScreenshot the generated results.",
      "evidence": {
        "title": "Upload your mind map screenshot",
        "required": true,
        "allowLinks": false,
        "reflectionRequired": false
      }
    },
    {
      "id": "s5",
      "title": "Step 5: Improve Your Mind Map",
      "body": "Carefully review every branch. Ask yourself:\n\n- Does this match my app idea?\n- Is anything missing?\n- Are there ideas that should be removed?\n- Are the labels easy to understand?\n\nMake changes as needed.\n\nAdd at least one of the following branches:\n\n- User Goals\n- Accessibility Features\n- Safety Features\n- Future Improvements\n- Monetization Ideas (how an app could make money in the future)\n- Technical Requirements"
    },
    {
      "id": "s6",
      "title": "Step 6: Export Your Mind Map",
      "body": "Once you are satisfied with your work:\n\n- Download your diagram as a **PPT file** and save as: `AppMindMap`\n- Save your mind map to your GitHub repository.",
      "evidence": {
        "title": "Upload your final AppMindMap file",
        "required": true,
        "allowLinks": true,
        "reflectionRequired": false
      }
    }
  ]
}
$json$::jsonb
WHERE id = 'f4269f0a-c47c-4dec-b7cd-0cdb6ccd7238';