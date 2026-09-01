// Realistic UI mockups for key steps, keyed by assignment id -> step index.
// Rendered by <StepMockup /> under the matching lesson step.
import type { StepMockup } from "@/lib/mockup";

export const STEP_MOCKUPS: Record<string, Record<number, StepMockup>> = {
  // ─────────────────────────── Module 1 · GitHub ───────────────────────────
  "6bb0622a-0c1d-4be7-a64e-a9c282faea00": {
    0: {
      app: "GitHub",
      url: "github.com/login",
      caption: "The GitHub sign-in screen.",
      blocks: [
        { type: "heading", text: "Sign in to GitHub" },
        { type: "field", label: "Username or email address", value: "your-username" },
        { type: "field", label: "Password", value: "••••••••••" },
        { type: "button", text: "Sign in" },
        { type: "note", text: "Never share your password with anyone, including classmates." },
      ],
    },
    1: {
      app: "GitHub",
      url: "github.com/new",
      caption: "The New repository screen — you'll fill this in over the next steps.",
      blocks: [
        {
          type: "heading",
          text: "Create a new repository",
          sub: "A repository contains all project files, including the revision history.",
        },
        {
          type: "field",
          label: "Owner / repository name",
          prefix: "your-username",
          value: "my-first-repo",
          hint: "This name is available.",
        },
        {
          type: "field",
          label: "Description",
          optional: true,
          placeholder: "A short project summary",
        },
        {
          type: "radios",
          items: [
            { title: "Public", body: "Anyone can view this repository.", checked: true },
            { title: "Private", body: "Only you can access this." },
          ],
        },
        {
          type: "checks",
          label: "Initialize this repository with:",
          items: [
            { text: "Add a README file", checked: true },
            { text: "Add .gitignore" },
            { text: "Choose a license" },
          ],
        },
        { type: "button", text: "Create repository" },
      ],
    },
    4: {
      app: "GitHub",
      url: "github.com/new",
      caption: "Choose Public so teachers and reviewers can see your work.",
      blocks: [
        {
          type: "radios",
          items: [
            { title: "Public", body: "Anyone can view this repository.", checked: true },
            { title: "Private", body: "Only you can access this." },
          ],
        },
        { type: "note", text: "Public repositories must never contain personal information." },
      ],
    },
    7: {
      app: "GitHub",
      url: "github.com/your-username/my-first-repo",
      caption: "Copy the address bar link — that's your repository URL.",
      blocks: [
        { type: "heading", text: "your-username / my-first-repo", sub: "Public" },
        { type: "list", items: [{ title: "README.md", sub: "Initial commit" }] },
        { type: "field", label: "Repository URL", value: "https://github.com/your-username/my-first-repo" },
        { type: "button", text: "Copy link" },
      ],
    },
  },

  // ────────────────────── Module 2 · ChatGPT planning ──────────────────────
  "aa841efa-0f07-4d48-81eb-41a3d7c41ec3": {
    1: {
      app: "ChatGPT",
      url: "chatgpt.com",
      caption: "Start a new chat and paste your prompt.",
      blocks: [
        { type: "heading", text: "New chat" },
        {
          type: "prompt",
          value: "I want to design an AI-powered mobile app for a school project.\n\nPlease generate three different app ideas.\n\nFor each idea include:\n\nApp name\nProblem it solves\nWho would use it\nHow AI helps users\nThree main features\nWhy people would find it useful\n\nKeep the explanations simple enough for a high school student.",
        },
      ],
    },
    2: {
      app: "ChatGPT",
      url: "chatgpt.com",
      caption: "Read all three ideas before choosing one.",
      blocks: [
        {
          type: "chat",
          messages: [
            { role: "user", text: "Give me 3 mobile app ideas that help high school students." },
            {
              role: "ai",
              text: "1. StudyBuddy — matches students for study sessions.\n2. ClubFinder — helps students discover clubs and activities.\n3. HomeworkTimer — breaks assignments into timed focus blocks.",
            },
          ],
        },
      ],
    },
    4: {
      app: "ChatGPT",
      url: "chatgpt.com",
      caption: "Ask ChatGPT to compare your ideas side by side.",
      blocks: [
        { type: "prompt", value: "Compare these 3 app ideas: who they help, how hard they'd be to build, and why they matter." },
        {
          type: "table",
          columns: ["Idea", "Who it helps", "Difficulty"],
          rows: [
            ["StudyBuddy", "Students studying alone", "Medium"],
            ["ClubFinder", "New students", "Easy"],
            ["HomeworkTimer", "Students who procrastinate", "Easy"],
          ],
        },
      ],
    },
  },
  "43f9105c-64bf-49c4-a514-f812be001819": {
    0: {
      app: "ChatGPT",
      url: "chatgpt.com",
      caption: "Ask ChatGPT to help build your user personas.",
      blocks: [
        { type: "prompt", value: "Create 2 user personas for my app idea. Include goals, challenges, and why they'd use it." },
      ],
    },
    1: {
      app: "Google Docs",
      url: "docs.google.com",
      caption: "Your persona document — one section per persona.",
      blocks: [
        { type: "heading", text: "User Personas — [Your App Name]" },
        {
          type: "list",
          items: [
            { title: "Persona 1: The Busy Student", sub: "Goals · Challenges · Why they'd use the app" },
            { title: "Persona 2: The New Student", sub: "Goals · Challenges · Why they'd use the app" },
          ],
        },
        { type: "note", text: "Use made-up names only — never real classmates." },
      ],
    },
    2: {
      app: "GitHub",
      url: "github.com/your-username/my-first-repo/upload",
      caption: "Upload the file, then click Commit changes.",
      blocks: [
        { type: "heading", text: "Add files to my-first-repo", sub: "Drag and drop your file here, or choose your file." },
        { type: "list", items: [{ title: "user-personas.pdf", sub: "Ready to commit" }] },
        { type: "button", text: "Commit changes" },
      ],
    },
  },
  "0964a68b-b18d-4dc6-ba54-dfc59aab920a": {
    0: {
      app: "GitHub",
      url: "github.com/your-username/my-first-repo",
      caption: "Open the files you saved in earlier weeks.",
      blocks: [
        {
          type: "list",
          label: "Your repository files",
          items: [
            { title: "app-ideas.pdf", sub: "Week 2" },
            { title: "user-personas.pdf", sub: "Week 2" },
            { title: "README.md", sub: "Updated" },
          ],
        },
      ],
    },
    1: {
      app: "ChatGPT",
      url: "chatgpt.com",
      caption: "Ask for help turning your notes into a concept document.",
      blocks: [
        { type: "prompt", value: "Help me write an app concept document with: the problem, who it helps, and 5 main features." },
      ],
    },
    2: {
      app: "Google Docs",
      url: "docs.google.com",
      caption: "Your concept document structure.",
      blocks: [
        { type: "heading", text: "App Concept Document" },
        {
          type: "checks",
          label: "Sections to include:",
          items: [
            { text: "App name and one-sentence description", checked: true },
            { text: "The problem it solves", checked: true },
            { text: "Who it helps", checked: true },
            { text: "Five main features", checked: true },
          ],
        },
      ],
    },
  },

  // ────────────────────────── Module 3 · Claude ──────────────────────────
  "eb5d0e96-4cda-4230-8553-eac388ec9062": {
    0: {
      app: "Claude",
      url: "claude.ai/new",
      caption: "Start a new Claude chat with your feature list.",
      blocks: [
        { type: "heading", text: "How can I help you today?" },
        { type: "prompt", value: "Here are my app features. Help me pick the 5 most important and explain why.", action: "Send" },
      ],
    },
    1: {
      app: "Google Docs",
      url: "docs.google.com",
      caption: "Your final feature list — 5 features, each with one sentence.",
      blocks: [
        { type: "heading", text: "Final Feature List" },
        {
          type: "table",
          columns: ["Feature", "Why it matters"],
          rows: [
            ["Feature 1", "Solves the main problem"],
            ["Feature 2", "Keeps students coming back"],
            ["Feature 3", "Easy to build first"],
          ],
        },
      ],
    },
  },
  "aeb71757-de61-4f9c-8a80-8e5110ff5e7b": {
    0: {
      app: "Claude",
      url: "claude.ai",
      caption: "Paste your description and ask Claude to improve it.",
      blocks: [
        { type: "prompt", value: "Rewrite my app description so it is clearer and more exciting. Keep it under 100 words." },
      ],
    },
    1: {
      app: "Claude",
      url: "claude.ai",
      caption: "Compare both versions before you choose.",
      blocks: [
        {
          type: "table",
          columns: ["Your version", "Claude's version"],
          rows: [
            ["Longer, more general", "Shorter, more specific"],
            ["Lists features", "Explains the benefit"],
          ],
        },
        { type: "note", text: "You decide which wording to keep — AI is a helper, not the author." },
      ],
    },
  },
  "54587b3b-4997-4cd0-b9fe-5b7b68bc113e": {
    0: {
      app: "GitHub",
      url: "github.com/your-username/my-first-repo",
      caption: "Gather the documents you'll reuse.",
      blocks: [
        {
          type: "list",
          label: "Files you need",
          items: [
            { title: "app-concept.pdf", sub: "Week 2" },
            { title: "user-personas.pdf", sub: "Week 2" },
            { title: "final-features.pdf", sub: "Week 3" },
          ],
        },
      ],
    },
    1: {
      app: "Google Docs",
      url: "docs.google.com",
      caption: "Your marketing document layout.",
      blocks: [
        { type: "heading", text: "Marketing Copy — [Your App Name]" },
        {
          type: "checks",
          label: "Include each of these:",
          items: [
            { text: "Tagline (one short line)", checked: true },
            { text: "Short description (2–3 sentences)", checked: true },
            { text: "Three benefit bullet points", checked: true },
          ],
        },
      ],
    },
  },

  // ────────────────────────── Module 4 · Gemini ──────────────────────────

  "5cfa7a9a-569b-4a75-a5b8-7d420c86a5ed": {
    0: {
      app: "Gemini",
      url: "gemini.google.com",
      caption: "Ask Gemini to find the patterns in your research.",
      blocks: [
        { type: "prompt", value: "Look at my research and list the 3 most important insights in simple language." },
      ],
    },
    1: {
      app: "Google Docs",
      url: "docs.google.com",
      caption: "Your insight report — one insight per section.",
      blocks: [
        { type: "heading", text: "Insight Report" },
        {
          type: "table",
          columns: ["Insight", "Evidence", "What it means for my app"],
          rows: [
            ["Insight 1", "From source A", "Feature idea"],
            ["Insight 2", "From source B", "Feature idea"],
          ],
        },
      ],
    },
  },
  "081652c5-ecf1-4bea-aefa-d1f368e8627e": {
    1: {
      app: "Gemini",
      url: "gemini.google.com",
      caption: "Generate a summary of everything you collected.",
      blocks: [
        { type: "prompt", value: "Summarize all of my research in about 200 words for a school project." },
      ],
    },
    2: {
      app: "Google Docs",
      url: "docs.google.com",
      caption: "Edit the summary in your own words.",
      blocks: [
        { type: "heading", text: "Research Summary (edited by me)" },
        { type: "textarea", value: "[Paste the AI summary, then rewrite anything that doesn't sound like you.]" },
        { type: "note", text: "Always review AI text for accuracy before submitting it." },
      ],
    },
  },

  // ───────────────────────── Module 5 · NapkinAI ─────────────────────────
  "f4269f0a-c47c-4dec-b7cd-0cdb6ccd7238": {
    1: {
      app: "NapkinAI",
      url: "app.napkin.ai",
      caption: "Create a new blank Napkin document.",
      blocks: [
        { type: "heading", text: "New document", sub: "Paste text, then let Napkin turn it into a visual." },
        { type: "button", text: "Create", secondary: "Templates" },
      ],
    },
    3: {
      app: "NapkinAI",
      url: "app.napkin.ai",
      caption: "Pick the mind-map style you like best.",
      blocks: [
        { type: "textarea", label: "Your text", value: "My app: name, problem, users, 5 features" },
        {
          type: "tiles",
          label: "Visual options",
          items: [
            { title: "Mind map", selected: true },
            { title: "Tree" },
            { title: "Bubbles" },
            { title: "Grid" },
          ],
        },
      ],
    },
    5: {
      app: "NapkinAI",
      url: "app.napkin.ai",
      caption: "Export your mind map as a PNG.",
      blocks: [
        { type: "heading", text: "Export visual" },
        {
          type: "radios",
          items: [
            { title: "PNG image", body: "Best for uploading to GitHub.", checked: true },
            { title: "PDF", body: "Best for printing." },
          ],
        },
        { type: "button", text: "Download" },
      ],
    },
  },
  "5685b32e-4c49-457e-87bc-ad542bb66049": {
    1: {
      app: "Google Docs",
      url: "docs.google.com",
      caption: "List the steps your user takes, in order.",
      blocks: [
        { type: "heading", text: "User Journey — main goal" },
        {
          type: "list",
          items: [
            { title: "1. Opens the app" },
            { title: "2. Finds what they need" },
            { title: "3. Takes action" },
            { title: "4. Sees the result" },
          ],
        },
      ],
    },
    2: {
      app: "NapkinAI",
      url: "app.napkin.ai",
      caption: "Paste your steps and choose a journey-style visual.",
      blocks: [
        { type: "textarea", label: "Paste your steps", value: "1. Opens the app  2. Finds what they need  3. Takes action  4. Sees the result" },
        {
          type: "tiles",
          label: "Visual options",
          items: [
            { title: "Journey", selected: true },
            { title: "Timeline" },
            { title: "Steps" },
            { title: "Flow" },
          ],
        },
      ],
    },
    3: {
      app: "NapkinAI",
      url: "app.napkin.ai",
      caption: "Download the PNG and upload it to GitHub.",
      blocks: [
        { type: "heading", text: "Export visual" },
        { type: "radios", items: [{ title: "PNG image", checked: true }, { title: "PDF" }] },
        { type: "button", text: "Download" },
      ],
    },
  },
  "2f005f69-492e-40c4-b5e9-fb764e5b3e22": {
    1: {
      app: "NapkinAI",
      url: "app.napkin.ai",
      caption: "Paste your app workflow, then generate the diagram.",
      blocks: [
        { type: "textarea", label: "Your workflow", value: "Sign up → Set up profile → Use main feature → Save progress" },
        { type: "button", text: "Generate visual" },
      ],
    },
    3: {
      app: "NapkinAI",
      url: "app.napkin.ai",
      caption: "Export the finished workflow diagram.",
      blocks: [
        { type: "heading", text: "Export visual" },
        { type: "radios", items: [{ title: "PNG image", checked: true }, { title: "PDF" }] },
        { type: "button", text: "Download" },
      ],
    },
  },

  // ──────────────── Module 6 · Adobe Firefly + Canva AI ────────────────
  "1b40ad7a-2d2f-4c3b-8adc-cb81cf8b27cc": {
    0: {
      app: "Adobe Firefly",
      url: "firefly.adobe.com",
      caption: "Open Firefly's free text-to-image tool.",
      blocks: [
        { type: "heading", text: "Text to image", sub: "Describe the image you want to create." },
        { type: "prompt", placeholder: "Describe your logo idea…", action: "Generate" },
      ],
    },
    1: {
      app: "Adobe Firefly",
      url: "firefly.adobe.com",
      caption: "Firefly returns four options per prompt.",
      blocks: [
        { type: "prompt", value: "Simple flat logo of a notebook and clock, blue and white, no text" },
        {
          type: "tiles",
          label: "Results",
          items: [
            { title: "Option 1" },
            { title: "Option 2" },
            { title: "Option 3" },
            { title: "Option 4" },
          ],
        },
      ],
    },
    3: {
      app: "Adobe Firefly",
      url: "firefly.adobe.com",
      caption: "Select your favorite and download it.",
      blocks: [
        {
          type: "tiles",
          label: "Results",
          items: [
            { title: "Option 1" },
            { title: "Option 2", sub: "Selected", selected: true },
            { title: "Option 3" },
            { title: "Option 4" },
          ],
        },
        { type: "button", text: "Download", secondary: "Generate again" },
      ],
    },
  },
  "cfbddf94-7e8e-4c6d-9649-3f78513d0738": {
    1: {
      app: "Canva AI · Magic Media",
      url: "canva.com",
      caption: "Use Canva's Magic Media panel to write your prompt.",
      blocks: [
        { type: "heading", text: "Magic Media", sub: "Turn a description into an image." },
        { type: "prompt", value: "Bright promotional image of a phone showing a student planner app", action: "Generate" },
      ],
    },
    2: {
      app: "Canva AI · Magic Media",
      url: "canva.com",
      caption: "Choose the promotional images you'll keep.",
      blocks: [
        {
          type: "tiles",
          label: "Generated images",
          items: [
            { title: "Image 1", sub: "Keep", selected: true },
            { title: "Image 2" },
            { title: "Image 3", sub: "Keep", selected: true },
            { title: "Image 4" },
          ],
        },
        { type: "button", text: "Download selected" },
      ],
    },
  },
  "67ef7587-6445-4b92-9864-642f8910539f": {
    2: {
      app: "Canva",
      url: "canva.com/design",
      caption: "Download your graphic as a PNG.",
      blocks: [
        { type: "heading", text: "Download" },
        { type: "radios", items: [{ title: "PNG", body: "Recommended", checked: true }, { title: "JPG" }] },
        { type: "button", text: "Download" },
      ],
    },
  },

  // ────────────────────────── Module 7 · Replit ──────────────────────────
  "34ef6426-fe99-4f95-ac90-6e8e6c23e6cc": {
    1: {
      app: "Replit",
      url: "replit.com/new",
      caption: "Describe your app to the Replit Agent.",
      blocks: [
        { type: "heading", text: "What do you want to build?" },
        { type: "textarea", label: "Your prompt", value: "Build a simple mobile app prototype for [your app idea] with a home screen and 3 main features." },
        { type: "button", text: "Start building" },
      ],
    },
    2: {
      app: "Replit",
      url: "replit.com",
      caption: "The Agent shows what it built — check each screen.",
      blocks: [
        {
          type: "list",
          label: "Agent progress",
          items: [
            { title: "Created home screen", sub: "Done" },
            { title: "Added feature pages", sub: "Done" },
            { title: "Started preview", sub: "Running" },
          ],
        },
      ],
    },
    4: {
      app: "Replit",
      url: "replit.com/@you/my-app",
      caption: "Copy your project link to submit it.",
      blocks: [
        { type: "field", label: "Project URL", value: "https://replit.com/@you/my-app" },
        { type: "button", text: "Copy link", secondary: "Share" },
      ],
    },
  },
  "813ec9d3-2290-44e8-acee-41a67d953f84": {
    1: {
      app: "Replit Agent",
      url: "replit.com",
      caption: "Ask the Agent to add your screens and navigation.",
      keepSample: true,
      blocks: [
        {
          type: "prompt",
          value:
            "Expand my existing app StudyBuddy by adding the following screens: Study Timer, Flashcards, and Progress. These screens are based on the user journey and app workflow I created earlier in this project. Keep the existing landing page and its working features. Add a simple navigation system that allows users to move between the screens. The navigation should include: Timer, Flashcards, Progress. Use the same visual style, colors, typography, and branding already established on my landing page. Each screen should have a clear purpose. Use realistic sample content based on my app concept. Make sure the navigation works when users click each item. Make the screens responsive so they work on both desktop and phone-sized screens. Do not remove or break the existing landing page. Do not add unrelated features. After making the changes, show me the updated project in Preview.",
          action: "Send",
        },
      ],
    },
    2: {
      app: "Replit · Preview",
      url: "replit.com",
      caption: "Tap each tab to confirm navigation works.",
      blocks: [
        {
          type: "checks",
          label: "Test each screen:",
          items: [
            { text: "Home opens", checked: true },
            { text: "Explore opens", checked: true },
            { text: "Profile opens", checked: true },
            { text: "No error messages" },
          ],
        },
      ],
    },
  },
  "31aca571-fef6-4b84-b807-6def93eb61e9": {
    0: {
      app: "Replit",
      url: "replit.com/~",
      caption: "Reopen the project you built last week.",
      blocks: [
        { type: "list", label: "Your Repls", items: [{ title: "my-app", sub: "Edited last week" }] },
        { type: "button", text: "Open" },
      ],
    },
    1: {
      app: "Replit Agent",
      url: "replit.com",
      caption: "One clear improvement request works better than many at once.",
      blocks: [
        { type: "prompt", value: "Improve the landing page: add a clear headline, one image, and a Get Started button.", action: "Send" },
      ],
    },
  },

  // ───────────────────── Module 8 · Team project (Lovable) ─────────────────────
  "9a7306ea-5c82-4ec5-9d20-7d58b382a85f": {
    2: {
      app: "Google Docs",
      url: "docs.google.com",
      caption: "Assign one website section per teammate.",
      blocks: [
        {
          type: "table",
          columns: ["Teammate", "Role", "Website section"],
          rows: [
            ["Student 1", "Team lead", "Home"],
            ["Student 2", "Design lead", "Features"],
            ["Student 3", "Content lead", "About"],
          ],
        },
      ],
    },
    4: {
      app: "Google Docs",
      url: "docs.google.com",
      caption: "Your team role assignment table.",
      blocks: [
        { type: "heading", text: "Team Role Assignment Table" },
        {
          type: "table",
          columns: ["Role", "Responsibility", "Owner"],
          rows: [
            ["Team lead", "Keeps the group on schedule", "Student 1"],
            ["Design lead", "Colors, images, layout", "Student 2"],
            ["Content lead", "Writing and proofreading", "Student 3"],
          ],
        },
      ],
    },
    6: {
      app: "Google Drive",
      url: "drive.google.com",
      caption: "Save team materials in one shared folder.",
      blocks: [
        {
          type: "list",
          label: "Team folder",
          items: [
            { title: "team-roles.pdf" },
            { title: "contribution-plan.pdf" },
            { title: "master-prompt.txt" },
          ],
        },
        { type: "button", text: "Share", secondary: "Copy link" },
      ],
    },
  },
  "9fa501c7-4091-456a-b02b-cc9592c72007": {
    1: {
      app: "Google Docs",
      url: "docs.google.com",
      caption: "Combine every teammate's section into one master prompt.",
      blocks: [
        { type: "heading", text: "Team Master Prompt" },
        { type: "textarea", value: "Build a marketing website for [product]. Sections: Home, Features, About, Contact. Style: [colors and tone]." },
      ],
    },
    2: {
      app: "Lovable",
      url: "lovable.dev",
      caption: "Paste the master prompt to generate the first version.",
      blocks: [
        { type: "prompt", value: "Build a marketing website for [product] with Home, Features, About, and Contact sections.", action: "Build" },
      ],
    },
    3: {
      app: "Google Docs",
      url: "docs.google.com",
      caption: "Agree on three improvements before editing again.",
      blocks: [
        {
          type: "checks",
          label: "Priority improvements",
          items: [
            { text: "1. Clearer headline", checked: true },
            { text: "2. Better colors and spacing", checked: true },
            { text: "3. Fix mobile layout", checked: true },
          ],
        },
      ],
    },
  },
  "867feaad-d3df-4605-99ae-b142515dc737": {
    0: {
      app: "Lovable",
      url: "lovable.dev",
      caption: "Send one improvement prompt at a time.",
      blocks: [
        { type: "prompt", value: "Update the headline, make the buttons easier to see, and fix spacing on the About section.", action: "Send" },
      ],
    },
    2: {
      app: "Lovable · Preview",
      url: "lovable.dev",
      caption: "Check the desktop layout before publishing.",
      blocks: [
        {
          type: "checks",
          label: "Desktop check",
          items: [
            { text: "Nothing overlaps", checked: true },
            { text: "Text is readable", checked: true },
            { text: "All links work" },
          ],
        },
      ],
    },
    4: {
      app: "Lovable",
      url: "lovable.dev",
      caption: "Publish, then copy your live website link.",
      blocks: [
        { type: "heading", text: "Publish your site" },
        { type: "field", label: "Live URL", value: "https://your-team-site.lovable.app" },
        { type: "button", text: "Publish", secondary: "Copy link" },
      ],
    },
  },

  // ─────────────────────────── Module 9 · Gamma ───────────────────────────
  "a1886a36-6db6-4b96-ba55-83e6430114da": {
    1: {
      app: "Gamma",
      url: "gamma.app/create",
      caption: "Create a new presentation from your project text.",
      blocks: [
        { type: "heading", text: "Create with AI", sub: "Paste your text and Gamma builds the slides." },
        { type: "textarea", label: "Your text", value: "App name, the problem, who it helps, 5 features, prototype screenshots, branding" },
        { type: "button", text: "Generate" },
      ],
    },
    3: {
      app: "Gamma",
      url: "gamma.app",
      caption: "Edit each slide so it matches your project.",
      blocks: [
        {
          type: "list",
          label: "Slides",
          items: [
            { title: "1. Title", sub: "App name + tagline" },
            { title: "2. The problem" },
            { title: "3. Who it helps" },
            { title: "4. Features" },
            { title: "5. Prototype" },
          ],
        },
      ],
    },
    7: {
      app: "Gamma",
      url: "gamma.app",
      caption: "Share your deck with a view-only link.",
      blocks: [
        { type: "heading", text: "Share presentation" },
        {
          type: "radios",
          items: [
            { title: "Anyone with the link can view", checked: true },
            { title: "Anyone with the link can edit" },
          ],
        },
        { type: "field", label: "Share link", value: "https://gamma.app/docs/your-pitch" },
        { type: "button", text: "Copy link" },
      ],
    },
  },
};

const TIP_PREFIX = /^\**\s*(helpful tip|tip|note|example|important|reminder)\b/i;

function stripWrappingParens(text: string): string {
  const t = text.trim();
  if (t.startsWith("(") && t.endsWith(")")) return t.slice(1, -1).trim();
  return t;
}

/**
 * Pull the exact prompt text out of a step body. Instruction bodies present
 * prompts in three ways: a fenced code block, a blockquote, or a parenthesized
 * block of text. Tips, notes and examples are skipped.
 */
function extractPrompt(body?: string): string | undefined {
  if (!body) return undefined;

  // 1. Fenced code block
  const fenced = body.match(/```[a-z]*\n([\s\S]*?)```/);
  if (fenced?.[1]?.trim()) return fenced[1].trim();

  // 2. Blockquote (contiguous "> " lines), unless it's a tip/example
  const lines = body.split("\n");
  let bq: string[] | null = null;
  for (const line of lines) {
    if (/^\s*>/.test(line)) {
      (bq ??= []).push(line.replace(/^\s*>\s?/, ""));
    } else if (bq) {
      if (bq.join("\n").trim() && !TIP_PREFIX.test(bq.join("\n").trim())) break;
      bq = null;
    }
  }
  if (bq) {
    const text = stripWrappingParens(bq.join("\n"));
    if (text && !TIP_PREFIX.test(text)) return text;
  }

  // 3. Parenthesized block starting at the beginning of a line
  const paren = body.match(/(?:^|\n)[ \t]*\(([\s\S]*?)\)[ \t]*(?:\n|$)/);
  if (paren?.[1]?.trim() && paren[1].includes("\n")) return paren[1].trim();
  if (paren?.[1] && paren[1].trim().length > 60) return paren[1].trim();

  return undefined;
}


/**
 * Replace placeholder prompt copy in a mockup with the actual prompt from the
 * step instructions, so students see exactly what to paste into the tool.
 */
function applyActualPrompt(mockup: StepMockup, prompt: string): StepMockup {
  let used = false;
  const blocks = mockup.blocks.map((b) => {
    if (used) return b;
    if (b.type === "prompt") {
      used = true;
      return { ...b, value: prompt };
    }
    if (b.type === "textarea") {
      used = true;
      return { ...b, value: prompt };
    }
    if (b.type === "chat") {
      const i = b.messages.findIndex((m) => m.role === "user");
      if (i === -1) return b;
      used = true;
      const messages = b.messages.map((m, mi) =>
        mi === i ? { ...m, text: prompt } : m,
      );
      return { ...b, messages };
    }
    return b;
  });
  return used ? { ...mockup, blocks } : mockup;
}

export function getStepMockup(
  assignmentId: string,
  stepIndex: number,
  stepBody?: string,
): StepMockup | undefined {
  const mockup = STEP_MOCKUPS[assignmentId]?.[stepIndex];
  if (!mockup) return undefined;
  if (mockup.keepSample) return mockup;
  const prompt = extractPrompt(stepBody);
  return prompt ? applyActualPrompt(mockup, prompt) : mockup;
}

