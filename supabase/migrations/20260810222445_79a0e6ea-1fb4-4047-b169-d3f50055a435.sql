INSERT INTO public.assignments (module_id, title, objectives, platform, skills, est_minutes, difficulty, points, requires_github, status, created_at, updated_at, lesson)
VALUES (
'ce27cb9a-64f8-4cd0-8e6a-8c5a0ad54eca',
'Week 8 — Create the Marketing Website in Lovable',
'Create the first version of a professional marketing website that introduces and promotes your AI-powered mobile app.',
'Lovable',
ARRAY['Marketing','Prompt writing','Web design','AI tools'],
90,
'intermediate',
10,
true,
'published',
'2026-08-10 20:00:00+00',
now(),
$json${
  "version": 1,
  "objective": "Create the first version of a professional marketing website that introduces and promotes your AI-powered mobile app.",
  "estimatedMinutes": 90,
  "difficulty": "intermediate",
  "overview": "Your Replit prototype demonstrates how your app works. Your Lovable website has a different purpose: it introduces your app to the world.\n\nThink of the website as the marketing page for a real startup. Someone who has never heard of your app should be able to visit the website and quickly understand what your app does, who it is for, and why it is useful.\n\nInstead of asking Lovable to build your website one small piece at a time, you will give it a detailed prompt containing your project information and the sections you want. This helps you make better use of your available Lovable credits.",
  "successCriteria": [
    "Your master prompt contains your real app information with every bracket replaced.",
    "Lovable generates a complete first version of the website with all seven required sections.",
    "You identify the three most important improvements and request them as one combined update.",
    "Your project is saved and you have copied the share preview link."
  ],
  "steps": [
    {
      "id": "step-1",
      "title": "Step 1 — Gather Your Project Information",
      "body": "Before opening Lovable, gather the following information from your previous assignments:\n\n- App name\n- App description\n- Target audience\n- Problem your app solves\n- 3–5 main features\n- User personas\n- App logo\n- Promotional images\n- App screenshots from Replit\n- Marketing copy\n\nThen go to **lovable.dev** and sign in using GitHub."
    },
    {
      "id": "step-2",
      "title": "Step 2 — Prepare Your Master Prompt",
      "body": "In a new document, paste the template below. Replace everything inside [brackets] with information about your own app.\n\nSave the document as **Lovable_Prompt** and upload it to your repository.\n\n(Create a professional, modern marketing website for my AI-powered mobile app.\n\nAPP INFORMATION\n\nApp Name: [Enter your app name]\n\nApp Description: [Paste your final app description]\n\nTarget Audience: [Describe your target users]\n\nProblem: [Describe the problem your app solves]\n\nSolution: [Explain how your app solves the problem]\n\nMAIN FEATURES\n\n1. [Feature 1] — [Short description]\n\n2. [Feature 2] — [Short description]\n\n3. [Feature 3] — [Short description]\n\n4. [Feature 4, if applicable] — [Short description]\n\nWEBSITE GOAL\n\nThe goal of this website is to introduce visitors to my app, explain how it works, highlight its benefits, and encourage visitors to learn more.\n\nWEBSITE STRUCTURE\n\nCreate the following sections:\n\n1. HERO SECTION\n- Display the app name prominently.\n- Include a short, memorable tagline.\n- Include a concise description of the app.\n- Include a primary call-to-action button.\n- Use a clean visual hierarchy.\n\n2. PROBLEM AND SOLUTION\n- Clearly explain the problem my target audience experiences.\n- Explain how my app provides a solution.\n- Keep the text concise and easy for a first-time visitor to understand.\n\n3. FEATURES\n- Create a visually organized section highlighting the main features.\n- Give each feature a clear title.\n- Include a short explanation for each feature.\n- Use icons or visual elements where appropriate.\n\n4. HOW IT WORKS\n- Explain the basic user experience in 3–5 simple steps.\n- Make the process easy to understand for someone who has never used the app.\n\n5. APP PREVIEW\n- Create a section where screenshots of my app can be displayed.\n- Use a clean mobile-app presentation style.\n- Leave the layout organized so I can replace placeholder images with my actual Replit screenshots.\n\n6. ABOUT THE PROJECT\n- Explain why this app was created.\n- Describe the purpose of the project.\n- Keep the section concise and professional.\n\n7. CALL TO ACTION\n- End with a strong call-to-action encouraging visitors to learn more about the app.\n- Use a clear button.\n\nDESIGN REQUIREMENTS\n\n- Modern technology/startup aesthetic.\n- Professional but appropriate for a student portfolio.\n- Clean layout with plenty of spacing.\n- Easy-to-read typography.\n- Strong visual hierarchy.\n- Consistent colors and button styles.\n- Responsive design so the website works on desktop and mobile screens.\n- Do not overcrowd the page.\n- Make the website feel like a real product landing page rather than a school assignment.\n\nIMPORTANT\n\nUse the information I provided above as the source of truth for my app.\n\nDo not invent features, statistics, customer testimonials, awards, partnerships, or claims that I did not provide.\n\nKeep all text concise.\n\nCreate the complete first version of the website in one implementation rather than making small unrelated changes one at a time.)\n\n/evidence",
      "evidence": {
        "title": "Upload your Lovable_Prompt document",
        "required": true,
        "acceptedFiles": ["pdf", "docx", "png", "jpg", "jpeg"],
        "allowLinks": true,
        "maxFiles": 3
      }
    },
    {
      "id": "step-3",
      "title": "Step 3 — Submit the Master Prompt",
      "body": "Paste your completed prompt into Lovable. Before submitting, make sure you replaced all [bracketed information].\n\nCarefully inspect the generated website. Look for major problems such as:\n\n- Missing sections\n- Incorrect app information\n- Incorrect features\n- Broken layouts\n- Missing buttons\n- Poor mobile layout\n- Placeholder text\n- Incorrect images\n\nIdentify the **3 most important improvements**. Do not ask Lovable to fix every tiny detail individually. Combine related changes into one prompt using the template below, and save it in your Lovable_Prompt document.\n\n(Review the current website and make the following improvements in one update:\n\n1. [Major improvement #1]\n\n2. [Major improvement #2]\n\n3. [Major improvement #3]\n\nKeep everything else unchanged.\n\nDo not remove any existing sections or features unless specifically requested.\n\nMaintain the existing visual style, color palette, typography, and overall structure.\n\nMake these changes together as one cohesive update.)\n\n**Example**\n\n(Review the current website and make the following improvements in one update:\n\n1. Improve the Hero section by making the headline shorter and more compelling.\n\n2. Improve the Features section by making each feature card easier to scan.\n\n3. Improve spacing between the major sections so the page feels less crowded.\n\nKeep everything else unchanged.\n\nDo not remove any existing sections or features.\n\nMaintain the existing visual style, color palette, typography, and overall structure.\n\nMake these changes together as one cohesive update.)\n\n/evidence",
      "evidence": {
        "title": "Upload a screenshot of your improvement prompt and the updated website",
        "required": true,
        "acceptedFiles": ["png", "jpg", "jpeg", "pdf", "docx"],
        "allowLinks": true,
        "maxFiles": 5
      }
    },
    {
      "id": "step-4",
      "title": "Step 4 — Save and Share Your Website",
      "body": "Confirm your project is saved.\n\nClick **Share** and copy the share preview link, then submit it below.\n\n/evidence",
      "evidence": {
        "title": "Submit your Lovable share preview link",
        "required": true,
        "allowLinks": true,
        "acceptedFiles": ["png", "jpg", "jpeg", "pdf"],
        "maxFiles": 3
      }
    }
  ],
  "checklist": [
    "Project information gathered from previous assignments",
    "Lovable_Prompt document completed with all brackets replaced and uploaded to your repository",
    "Master prompt submitted and the generated website reviewed",
    "Three most important improvements requested as one combined update",
    "Project saved and share preview link submitted"
  ],
  "resources": [
    { "label": "Lovable", "url": "https://lovable.dev" }
  ]
}$json$
);