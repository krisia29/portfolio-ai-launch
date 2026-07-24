UPDATE public.assignments
SET
  title = 'Week 4 — Research and Validation',
  objectives = 'Learn how to use Gemini Notebooks to organize research from trusted sources and collect information that will help improve your mobile app idea.',
  est_minutes = 60,
  difficulty = 'beginner',
  instructions_md = NULL,
  deliverables_md = NULL,
  github_instructions_md = NULL,
  readme_template_md = NULL,
  reflection_questions = NULL,
  lesson = jsonb_build_object(
    'version', 1,
    'title', 'Week 4 — Research and Validation',
    'objective', 'Learn how to use Gemini Notebooks to organize research from trusted sources and collect information that will help improve your mobile app idea.',
    'estimatedMinutes', 60,
    'difficulty', 'beginner',
    'overview', E'Professional software developers begin every project with research. Before writing code or designing screens, they learn about the problem they want to solve and the people they want to help.\n\nIn this assignment, you will use Gemini Notebooks to collect reliable information about the topic of your mobile app. By organizing your research in one place, you will build a stronger foundation for the rest of your project. The information you gather today will be used in the next two assignments to improve your app idea and plan better features.',
    'steps', jsonb_build_array(
      jsonb_build_object(
        'id','step-1','title','Open Gemini',
        'body', E'1. Go to [notebooklm.google](https://notebooklm.google) and sign in using your Google account.\n2. From the left menu, select **Notebooks** (sometimes labeled *Gem* or *Notebook*, depending on updates to the interface).\n3. Click **Create Notebook**.\n\n**New Term**\n\n**Notebook** – A workspace where you can collect documents, websites, notes, and AI conversations about one project.'
      ),
      jsonb_build_object(
        'id','step-2','title','Name Your Notebook',
        'body', E'1. Name your notebook **Tech Pathways Academy Research**.\n2. Click **Create** or **Save**.'
      ),
      jsonb_build_object(
        'id','step-3','title','Add Research Sources',
        'body', E'1. Add at least two trusted sources related to your app idea.\n\nExamples of trusted sources include:\n\n- Government websites (.gov)\n- Educational organizations (.edu)\n- Nonprofit organizations\n- Official company websites\n- Published research articles\n\nAvoid using:\n\n- Social media posts\n- Personal blogs\n- Opinion websites without evidence\n\nUse whichever free option is available.'
      ),
      jsonb_build_object(
        'id','step-4','title','Ask Gemini Questions',
        'body', E'1. Use the chat area inside your notebook to ask questions about your research.\n\nTry prompts such as:\n\n- What are the biggest problems people experience with this topic?\n- Who would benefit most from an app like this?\n- What solutions already exist?\n- What important facts appear across these sources?\n- What features could help solve these problems?\n\n**Helpful Tip:** AI can sometimes make mistakes. Always compare Gemini''s answers with your original sources before using the information.\n\n2. Screenshot one conversation where Gemini answers questions using your research.',
        'evidence', jsonb_build_object(
          'title','Upload Gemini conversation screenshot',
          'required', true,
          'acceptedFiles', jsonb_build_array('png','jpg','jpeg','pdf','zip'),
          'allowLinks', true,
          'maxFiles', 3,
          'maxSizeMb', 50
        )
      ),
      jsonb_build_object(
        'id','step-5','title','Save Your Research Notes',
        'body', E'1. Create a document that includes:\n\n- Three facts you learned\n- Two common problems people experience\n- Three possible features your app could include based on your research\n\n2. Save this document as **Week4_ResearchNotes**\n3. Upload to your existing GitHub repository',
        'evidence', jsonb_build_object(
          'title','Upload Week4_ResearchNotes',
          'required', true,
          'acceptedFiles', jsonb_build_array('pdf','docx','png','jpg','jpeg','zip'),
          'allowLinks', true,
          'maxFiles', 3,
          'maxSizeMb', 50
        )
      )
    )
  ),
  updated_at = now()
WHERE id = '074e09ee-0881-43e8-8818-1c897a64bbd2';