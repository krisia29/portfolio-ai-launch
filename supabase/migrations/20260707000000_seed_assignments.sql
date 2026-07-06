-- Seed complete assignments across all AI platform modules

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Set Up Your GitHub Portfolio Profile$sql$, $sql$Create a public GitHub account, customize your profile, and publish a professional profile README that introduces you to colleges and employers.$sql$, $sql$GitHub$sql$, ARRAY['GitHub','Documentation','Personal Branding','Communication']::text[], 45, $sql$Beginner$sql$,
  $sql$### What you will build
A GitHub profile that looks professional and includes a special profile README that appears at the top of your profile page.

### Step-by-step
1. Go to **github.com** and click **Sign up**. Use a school-appropriate username (example: `first-last-hs`). Save your password somewhere safe.
2. Verify your email.
3. Click your profile icon (top right) → **Your profile**. Add a photo, your name, a short bio ("High school student learning AI and building a portfolio."), and your school city/state.
4. Create the profile README: click **New repository**. Type your **exact GitHub username** as the repository name. Check **Public**, check **Add a README**. Click **Create repository**.
5. Edit `README.md`. Replace the content with:
   - A one-line intro ("Hi, I'm ___. I'm a high school student learning AI and building projects.")
   - Section: **Skills I'm learning** (bullet list)
   - Section: **Projects** (leave placeholders like "- Coming soon: ChatGPT research project")
   - Section: **Contact** (school email only, no personal info)
6. Commit the changes.
7. Visit `github.com/<yourusername>` and confirm the README appears at the top.
$sql$, $sql$- Public GitHub account with photo, name, bio.
- Profile README repository (named exactly like your username) with intro, skills, projects, and contact sections.
- Submit your profile URL: `https://github.com/<yourusername>`$sql$, $sql$### Verify your profile
1. Copy your profile URL from the browser.
2. Paste it in the submission box and click **Verify**.
$sql$, $sql$# <yourusername>

Hi, I'm <Your First Name>. I'm a high school student learning AI and building portfolio projects.

## Skills I'm learning
- Prompt engineering
- Documentation
- Web publishing

## Projects
- Coming soon: ChatGPT research project

## Contact
School email: you@school.edu
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$github-fundamentals$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$AI Ethics One-Pager: Rules I Follow When Using AI$sql$, $sql$Research responsible AI use for students and publish a one-page personal AI use policy you agree to follow in school and life.$sql$, $sql$General$sql$, ARRAY['AI Literacy','Research','Critical Thinking','Communication','Documentation']::text[], 45, $sql$Beginner$sql$,
  $sql$### What you will build
A one-page document ("My AI Use Policy") published to GitHub that other students could actually use.

### Step-by-step
1. Read three short, free sources about student AI use. Pick from:
   - Your school's AI or academic honesty policy
   - The MIT "AI Risk" overview (search "MIT AI risks student")
   - Common Sense Media AI guide for teens
2. Take notes on: honesty, privacy, bias, over-reliance, citation.
3. Open a plain text editor or Google Docs. Write **My AI Use Policy** with these sections:
   - **When I will use AI** (studying, brainstorming, drafting)
   - **When I will not use AI** (tests, personal essays where teachers require original work, private info about others)
   - **How I check AI answers** (verify with a second source; watch for hallucinations)
   - **How I give credit** (cite the tool and prompt when required)
4. Keep it to one page.
5. Save as `AI-USE-POLICY.md`.
$sql$, $sql$- One-page `AI-USE-POLICY.md` file.
- Published in a GitHub repository named `my-ai-use-policy`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# AI Ethics One-Pager: Rules I Follow When Using AI

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
General

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$responsible-ai$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$College & Career Research Brief with ChatGPT$sql$, $sql$Use ChatGPT to research three colleges or careers and produce a polished, cited research brief you can share with a counselor.$sql$, $sql$ChatGPT$sql$, ARRAY['Prompt Engineering','Research','Critical Thinking','Documentation','AI Literacy']::text[], 60, $sql$Beginner$sql$,
  $sql$### Free-tier note
The free version of ChatGPT is enough for this project. You do not need Plus.

### Step-by-step
1. Sign in at **chat.openai.com** with a free account.
2. Start a new chat. Use this **exact prompt** (edit the bold parts):
   > Act as a college and career counselor for a high school student in **grade 10** interested in **AI and computer science**. Give me a research brief comparing **3 careers** I could pursue. For each career, include: typical daily tasks, education needed, average U.S. salary range, and 2 real companies that hire in this field.
3. Read the answer. **Do not trust it yet.** Pick 2 facts (salary and one company) and verify them by searching Google. If ChatGPT was wrong, note the correction.
4. Ask a follow-up: "Now give me 3 free ways I can start learning skills for these careers as a high school student."
5. Copy the whole conversation into a new document. Title it `career-brief.md`. At the top add: your name, date, and the prompts you used. At the bottom add a **Fact Check** section listing what you verified and any corrections.
$sql$, $sql$- `career-brief.md` file with prompts, ChatGPT response, and your fact-check section.
- Published to GitHub as `chatgpt-career-brief`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# College & Career Research Brief with ChatGPT

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
ChatGPT

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$chatgpt$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$AI-Powered Study Guide Generator$sql$, $sql$Turn class notes into a structured study guide with practice questions, using ChatGPT with careful prompting and verification.$sql$, $sql$ChatGPT$sql$, ARRAY['Prompt Engineering','Documentation','AI Literacy','Critical Thinking']::text[], 75, $sql$Intermediate$sql$,
  $sql$### Step-by-step
1. Pick a real unit from a current class (history, biology, algebra — anything). Gather your notes as plain text.
2. In ChatGPT, paste this prompt:
   > You are a patient high school tutor. I will paste notes from my **[subject]** class on **[topic]**. Turn them into a study guide with: (1) a 5-sentence summary, (2) a glossary of 8 key terms with definitions, (3) 10 practice questions (mix of multiple choice and short answer), and (4) an answer key. Use plain language for an 8th-grade reader.
   > Notes:
   > <paste notes>
3. Review every answer. Circle anything that looks wrong and re-check against your textbook.
4. Ask a follow-up: "Rewrite question 5 to be harder" — practice iterating.
5. Export the final guide as a Markdown file `study-guide.md`. Add a note at the top: what you changed after fact-checking.
$sql$, $sql$- `study-guide.md` (summary, glossary, 10 Qs, answer key, correction notes).
- GitHub repo `chatgpt-study-guide` with README.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# AI-Powered Study Guide Generator

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
ChatGPT

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$chatgpt$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Personal Brand Elevator Pitch Package$sql$, $sql$Use ChatGPT to draft, revise, and publish a personal elevator pitch, LinkedIn-style bio, and 3 tailored versions for different audiences.$sql$, $sql$ChatGPT$sql$, ARRAY['Prompt Engineering','Personal Branding','Communication','Documentation']::text[], 90, $sql$Advanced$sql$,
  $sql$### Step-by-step
1. Write a quick self-inventory (5 minutes): interests, top 3 skills, one project you're proud of, one goal.
2. In ChatGPT:
   > You are a career coach. Using the info below, write me: (a) a 60-second spoken elevator pitch, (b) a 3-sentence LinkedIn-style bio, (c) a 1-sentence tagline. Voice = confident but authentic high school student.
   > Info: <paste your inventory>
3. Ask ChatGPT to produce **3 audience versions**: one for a college admissions officer, one for a summer job interview, one for a scholarship application.
4. Read each aloud. Edit anything that sounds fake. Replace any invented claim.
5. Save all versions in `personal-brand.md`. Include the prompts you used.
$sql$, $sql$- `personal-brand.md` with 3 audience-tailored versions.
- GitHub repo `personal-brand-kit`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Personal Brand Elevator Pitch Package

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
ChatGPT

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$chatgpt$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Book or Article Deep-Reading Companion$sql$, $sql$Use Claude to help you read and understand a long text, producing a written analysis worthy of a college app.$sql$, $sql$Claude$sql$, ARRAY['Prompt Engineering','Research','Critical Thinking','Communication','AI Literacy']::text[], 60, $sql$Beginner$sql$,
  $sql$### Free-tier note
Free Claude has daily message limits. Prepare your text in advance and use messages efficiently.

### Step-by-step
1. Sign in at **claude.ai** with a free account.
2. Pick a public-domain article, essay, or book chapter (Project Gutenberg or a news article ~1,500–4,000 words).
3. Paste this prompt then paste the text:
   > You are helping a high school student read closely. For the text below: (1) give a 5-sentence summary, (2) list the 3 main arguments, (3) point out 2 places where the author might be biased or missing something, (4) give me 3 discussion questions I could bring to class.
4. Follow up with: "Explain paragraph 4 in simpler words," and "Rewrite the thesis in one sentence I could quote."
5. Compile everything into `deep-read.md`. Add your own **My Response** section (100–200 words) reacting to the argument. This part must be your own writing.
$sql$, $sql$- `deep-read.md` with Claude's analysis and your own written response.
- GitHub repo `claude-deep-read`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Book or Article Deep-Reading Companion

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Claude

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$claude$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Long-Form Interview: A Historical Figure Q&A$sql$, $sql$Use Claude's careful reasoning to simulate an interview with a real historical figure, then produce an illustrated Q&A document.$sql$, $sql$Claude$sql$, ARRAY['Prompt Engineering','Research','Storytelling','Critical Thinking','Documentation']::text[], 75, $sql$Intermediate$sql$,
  $sql$### Step-by-step
1. Pick a well-documented historical figure (Ada Lovelace, MLK Jr., Marie Curie, Cesar Chavez, etc.).
2. In Claude:
   > You are simulating a respectful interview with **<figure>**. Only use widely accepted facts. If you are unsure, say so. I will ask 8 questions. Stay in character and cite the era/context.
3. Ask 8 real questions (mix of personal and about their work).
4. After the interview, ask Claude:
   > Now step out of character. List every claim in the interview that a fact-checker should verify.
5. Fact-check at least 3 of those claims using Wikipedia or Britannica. Correct or annotate.
6. Save as `interview-<figure-name>.md` with the interview, the fact-check list, and your corrections.
$sql$, $sql$- `interview-<figure>.md` with Q&A + fact-check + corrections.
- GitHub repo `claude-historical-interview`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Long-Form Interview: A Historical Figure Q&A

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Claude

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$claude$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Persuasive Op-Ed with AI Editing Partner$sql$, $sql$Draft a 500-word op-ed on a topic you care about, then use Claude as a writing coach to revise it three times.$sql$, $sql$Claude$sql$, ARRAY['Prompt Engineering','Communication','Critical Thinking','Documentation','Personal Branding']::text[], 90, $sql$Advanced$sql$,
  $sql$### Step-by-step
1. Pick a real local or school issue you have an opinion on.
2. Write a first draft yourself (~500 words). This is important — the AI is your editor, not your author.
3. Paste it into Claude with this prompt:
   > You are a firm but kind writing coach. Review my op-ed. Do not rewrite it. Instead give me: (1) 3 specific things that work, (2) 5 specific things to improve with line references, (3) 3 tougher counter-arguments a reader might raise.
4. Revise your draft. Repeat the feedback loop 2 more times.
5. Ask Claude to check for factual claims that need sources.
6. Publish `op-ed.md` with: final version, all three drafts, and a **Coach's Notes** section describing what feedback you took and what you rejected.
$sql$, $sql$- `op-ed.md` (final + all drafts + coach's notes).
- GitHub repo `claude-op-ed`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Persuasive Op-Ed with AI Editing Partner

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Claude

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$claude$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Personal Logo & Brand Kit$sql$, $sql$Design a personal logo, color palette, and font pairing using Canva's free AI tools — the foundation of a portfolio identity.$sql$, $sql$Canva AI$sql$, ARRAY['Visual Design','Personal Branding','AI Literacy','Communication']::text[], 60, $sql$Beginner$sql$,
  $sql$### Free-tier note
Use Canva Free. Magic Studio features have monthly free limits — the steps below stay within them.

### Step-by-step
1. Sign in at **canva.com** with a free account.
2. Click **Create a design → Logo**.
3. Click **Magic Media** (in the left panel) → **Text to Image**. Prompt:
   > Minimal flat vector logo of **<a symbol that represents you>**, two-color, clean lines, white background
   Generate 2–4 options. Free plan limits image generations per month — plan your prompts.
4. Drag your favorite onto the canvas. Add your initials or first name in a simple font.
5. Create a second design: **Custom size** 1000x400 px. Title it "Brand Kit". Include: your logo, a 4-color palette (use Canva's color picker), 2 font names (one header, one body), and a one-sentence personal tagline.
6. Download both as PNG.
$sql$, $sql$- Logo PNG.
- Brand Kit PNG (logo + palette + fonts + tagline).
- GitHub repo `personal-brand-canva` with both PNGs and README.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Personal Logo & Brand Kit

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Canva AI

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$canva-ai$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Infographic: 'A Day in the Life' of a Career You Want$sql$, $sql$Use Canva AI to design a data-rich, visually appealing infographic about a real career path.$sql$, $sql$Canva AI$sql$, ARRAY['Visual Design','Research','Data Visualization','Communication','Documentation']::text[], 75, $sql$Intermediate$sql$,
  $sql$### Step-by-step
1. Research one career (use the Bureau of Labor Statistics website — free). Collect: typical daily schedule, top 3 skills, average salary, education path, 3 companies that hire this role.
2. In Canva: **Create a design → Infographic**.
3. Use **Magic Design** or a free infographic template. Build 5 sections:
   - Hero (career name + big number: salary)
   - Daily schedule timeline
   - Top skills icons
   - Education path steps
   - Companies logos (use text, not copyrighted logos)
4. Use **Magic Write** (free tier includes limited uses) to sharpen your headlines and captions. Keep prompts short.
5. Use **Magic Media** for 1 hero illustration only (save your free uses).
6. Download as PNG **and** PDF.
$sql$, $sql$- Infographic PNG + PDF.
- Sources list (`sources.md`).
- GitHub repo `career-infographic-canva`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Infographic: 'A Day in the Life' of a Career You Want

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Canva AI

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$canva-ai$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Nonprofit Campaign Poster Series (3 Posters)$sql$, $sql$Design a 3-poster campaign for a cause you care about, using consistent branding and Canva AI to speed up the design work.$sql$, $sql$Canva AI$sql$, ARRAY['Visual Design','Marketing','Storytelling','Communication','Personal Branding']::text[], 90, $sql$Advanced$sql$,
  $sql$### Step-by-step
1. Pick a real, appropriate cause (mental health awareness, clean water, literacy, etc.).
2. Define: one goal, one target audience, one call-to-action.
3. In Canva, create three **Poster (US Letter)** designs sharing the same colors, fonts, and logo.
4. Poster 1: **Awareness** (surprising statistic).
5. Poster 2: **Story** (one person's story — use Magic Media for illustration, not real people).
6. Poster 3: **Action** (what the viewer can do this week).
7. Use **Magic Write** sparingly to tighten headlines.
8. Export all three as PDFs.
9. Write a `campaign-brief.md` explaining the goal, audience, and design choices.
$sql$, $sql$- 3 poster PDFs.
- `campaign-brief.md`.
- GitHub repo `canva-campaign-<cause>`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Nonprofit Campaign Poster Series (3 Posters)

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Canva AI

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$canva-ai$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Class Notes Study Notebook$sql$, $sql$Use NotebookLM to turn your own class materials into an interactive study companion, then export a clean study guide.$sql$, $sql$NotebookLM$sql$, ARRAY['Research','AI Literacy','Prompt Engineering','Documentation','Critical Thinking']::text[], 60, $sql$Beginner$sql$,
  $sql$### Free-tier note
NotebookLM is free with a Google account. It can only answer using **sources you upload** — that is the point.

### Step-by-step
1. Go to **notebooklm.google.com** and sign in with a free Google account.
2. Click **New notebook**. Upload 3–5 sources for one unit of a class (PDFs, Google Docs, or paste text). Everything must be legally yours to use (your notes, teacher handouts you have permission to use, public articles).
3. Once sources load, ask NotebookLM:
   - "Give me a 5-sentence summary of these sources."
   - "Make a glossary of the 10 most important terms."
   - "Create 10 practice questions with answers."
4. Click each answer's **citations** — check the source it points to. This is the trust step.
5. Use **Audio Overview** (free) to generate a podcast-style audio summary. Download the MP3.
6. Copy everything into `study-notebook.md`. Include a **Sources** list at the top.
$sql$, $sql$- `study-notebook.md` (summary, glossary, Q&A, sources).
- Audio Overview MP3 file.
- GitHub repo `notebooklm-study-<subject>`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Class Notes Study Notebook

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
NotebookLM

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$notebooklm$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Research Deep-Dive: 5-Source Literature Review$sql$, $sql$Use NotebookLM to synthesize five real articles into a well-cited mini literature review.$sql$, $sql$NotebookLM$sql$, ARRAY['Research','Critical Thinking','Documentation','AI Literacy','Communication']::text[], 90, $sql$Intermediate$sql$,
  $sql$### Step-by-step
1. Pick a research question (example: "Does homework help high school students learn?").
2. Find 5 real, free articles (Google Scholar, news, .gov, .edu). Save PDFs or copy links.
3. Create a NotebookLM notebook and upload all 5.
4. Ask:
   - "What is the main argument of each source?"
   - "Where do the sources agree? Where do they disagree?"
   - "What questions do these sources fail to answer?"
5. Use citations to double-check every claim. Reject anything that isn't traceable.
6. Draft a 500–700 word literature review in `lit-review.md`. Add a **Works Cited** section listing all 5 sources.
$sql$, $sql$- `lit-review.md` with citations.
- Source list.
- GitHub repo `notebooklm-lit-review`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Research Deep-Dive: 5-Source Literature Review

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
NotebookLM

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$notebooklm$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Podcast Episode: AI-Assisted Explainer$sql$, $sql$Use NotebookLM's free Audio Overview to produce a real podcast episode with a written show-notes page.$sql$, $sql$NotebookLM$sql$, ARRAY['Storytelling','Communication','Research','AI Literacy','Documentation']::text[], 90, $sql$Advanced$sql$,
  $sql$### Step-by-step
1. Pick a topic you can teach a peer in 10 minutes (e.g., "How photosynthesis works", "How compound interest works").
2. Gather 4–6 free sources. Upload to a NotebookLM notebook.
3. In NotebookLM, click **Audio Overview → Customize** and give it a direction like:
   > A 10-minute conversation for high school students who have never studied this before. Use simple analogies.
4. Generate. Listen fully. Note any errors.
5. Write show notes in `show-notes.md`: title, 3-sentence description, 5 timestamped highlights, sources, and a section on **What the AI got wrong** and how you would correct it.
6. Download the MP3.
$sql$, $sql$- MP3 episode.
- `show-notes.md`.
- GitHub repo `notebooklm-podcast-<topic>`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Podcast Episode: AI-Assisted Explainer

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
NotebookLM

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$notebooklm$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Concept Diagram: How Something Works$sql$, $sql$Use NapkinAI to turn your written explanation into a clean visual diagram suitable for a portfolio.$sql$, $sql$NapkinAI$sql$, ARRAY['Visual Design','Data Visualization','Communication','AI Literacy','Documentation']::text[], 45, $sql$Beginner$sql$,
  $sql$### Free-tier note
NapkinAI has a generous free plan. You can generate multiple visual variations from text.

### Step-by-step
1. Go to **napkin.ai** and sign in free.
2. Click **Create new** and paste a 100–200 word explanation of how something works (water cycle, blockchain, photosynthesis — pick something you can explain accurately).
3. Highlight a sentence or paragraph. Click the **Napkin/visual** icon that appears. Pick a diagram style (flow, cycle, hierarchy).
4. Generate 3–4 variations. Pick your favorite.
5. Edit labels, colors, and arrows for accuracy.
6. Export as PNG **and** SVG.
$sql$, $sql$- PNG and SVG of your diagram.
- 100–200 word source explanation as `explanation.md`.
- GitHub repo `napkin-concept-diagram`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Concept Diagram: How Something Works

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
NapkinAI

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$napkinai$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Process Map: A Real Workflow You Use$sql$, $sql$Document a real process (college application, project workflow, school club meeting) as a professional process map.$sql$, $sql$NapkinAI$sql$, ARRAY['Process Mapping','Visual Design','Documentation','Communication','Critical Thinking']::text[], 60, $sql$Intermediate$sql$,
  $sql$### Step-by-step
1. Pick a real multi-step process you know (7–15 steps).
2. Write out every step in order in `process.md`.
3. In NapkinAI, paste your steps. Generate a **flowchart** or **swimlane** style diagram.
4. Try at least 3 variations. Pick the clearest.
5. Add decision points (diamonds) where the process branches.
6. Export PNG + SVG. Save both.
7. Add a short paragraph explaining who would use this and why.
$sql$, $sql$- Flowchart PNG + SVG.
- `process.md` steps.
- GitHub repo `napkin-process-map`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Process Map: A Real Workflow You Use

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
NapkinAI

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$napkinai$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Visual Storytelling Deck for a Business Idea$sql$, $sql$Turn a written business or club pitch into 5 clean visuals that tell a story: problem → audience → solution → plan → impact.$sql$, $sql$NapkinAI$sql$, ARRAY['Business Planning','Visual Design','Storytelling','Data Visualization','Communication']::text[], 90, $sql$Advanced$sql$,
  $sql$### Step-by-step
1. Write a 1-page pitch for a realistic business or club idea (fictional but plausible).
2. Break it into 5 sections and write 2–3 sentences for each.
3. In NapkinAI, generate one visual per section (icons, cycles, comparison charts, timelines).
4. Keep the visual style consistent across all 5.
5. Export each PNG and combine into a single PDF using any free tool (Canva, Google Slides, Preview).
6. Write `pitch-brief.md` with your original pitch and captions for each visual.
$sql$, $sql$- 5 PNG visuals.
- Combined PDF deck.
- `pitch-brief.md`.
- GitHub repo `napkin-pitch-deck`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Visual Storytelling Deck for a Business Idea

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
NapkinAI

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$napkinai$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$About Me: 5-Slide Introduction Deck$sql$, $sql$Use Gamma's free AI slide generator to create a polished 5-slide 'About Me' presentation.$sql$, $sql$Gamma$sql$, ARRAY['Presentation','Personal Branding','Communication','Visual Design','AI Literacy']::text[], 45, $sql$Beginner$sql$,
  $sql$### Free-tier note
Gamma free plan gives you 400 AI credits when you sign up. Each generation uses credits — plan your prompts.

### Step-by-step
1. Sign up free at **gamma.app**.
2. Click **Create new → Generate → Presentation**.
3. Enter this prompt:
   > A 5-card 'About Me' presentation for a high school student. Sections: Introduction, Interests, Skills I'm Building, A Project I'm Proud Of, What's Next. Style: clean and friendly.
4. Choose a theme. Generate.
5. Edit every card. Replace generic AI text with your real info. Delete anything fake.
6. Add one real screenshot or photo (school-appropriate).
7. Click **Share → Export → PDF**.
$sql$, $sql$- Gamma share link (public).
- PDF export.
- GitHub repo `gamma-about-me` with the PDF and README.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# About Me: 5-Slide Introduction Deck

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Gamma

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$gamma$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Tutorial Deck: Teach a Skill in 10 Slides$sql$, $sql$Design an instructional Gamma deck that teaches a peer a real skill you know, with screenshots and clear steps.$sql$, $sql$Gamma$sql$, ARRAY['Presentation','Communication','Documentation','Visual Design','Storytelling']::text[], 75, $sql$Intermediate$sql$,
  $sql$### Step-by-step
1. Pick a skill you can teach in 10 slides (make a Google Sheet chart, edit a photo, write a resume, etc.).
2. Outline your 10 slides on paper first.
3. In Gamma, prompt:
   > A 10-card tutorial for high school students on **<your skill>**. Include an intro slide, 7 step-by-step slides, a common mistakes slide, and a next steps slide. Keep language simple.
4. Replace every generic image with a real screenshot you take. Free screenshot: press `Cmd+Shift+4` (Mac) or `Win+Shift+S` (Windows).
5. Add a **What I got wrong when learning this** slide (your own voice).
6. Export as PDF and share link.
$sql$, $sql$- Gamma share link.
- PDF export.
- Screenshots folder.
- GitHub repo `gamma-tutorial-<skill>`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Tutorial Deck: Teach a Skill in 10 Slides

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Gamma

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$gamma$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Pitch Deck for a School Club, Event, or Project$sql$, $sql$Build a real pitch deck you could present to a teacher, principal, or club leader to get approval or funding.$sql$, $sql$Gamma$sql$, ARRAY['Presentation','Business Planning','Communication','Storytelling','Personal Branding']::text[], 90, $sql$Advanced$sql$,
  $sql$### Step-by-step
1. Choose a real thing you want to pitch (starting a club, running an event, funding a project).
2. Outline: Problem → Why now → Your idea → Who benefits → Plan/timeline → What you need → How you'll measure success → Ask.
3. In Gamma, prompt for a 10-slide pitch deck using that outline.
4. Rewrite every slide in your own voice. Add real numbers when you can (attendance, budget, timeline).
5. Add a **Q&A prep** slide at the end (3 questions you expect + your answers).
6. Export PDF + get share link.
7. Practice presenting it aloud once and record 30-second notes in `speaker-notes.md`.
$sql$, $sql$- Gamma share link.
- PDF export.
- `speaker-notes.md`.
- GitHub repo `gamma-pitch-<project>`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Pitch Deck for a School Club, Event, or Project

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Gamma

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$gamma$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Book Cover Redesign$sql$, $sql$Use Adobe Firefly (free) to generate original imagery, then design a portfolio-quality book cover for a real book.$sql$, $sql$Adobe Firefly$sql$, ARRAY['Image Generation','Visual Design','Prompt Engineering','Storytelling','AI Literacy']::text[], 60, $sql$Beginner$sql$,
  $sql$### Free-tier note
Adobe Firefly free plan includes monthly generative credits. Each image = 1 credit. Plan your prompts to stay within the free monthly limit.

### Step-by-step
1. Sign in at **firefly.adobe.com** with a free Adobe ID.
2. Pick a real, well-known book you have read.
3. Click **Text to Image**. Write a prompt describing the cover mood:
   > <genre> book cover illustration, <mood>, <color palette>, <key symbol from the book>, no text
4. Generate 4 options. Adjust the style panel (content type, effects) and regenerate once if needed.
5. Download your favorite as PNG.
6. Open Canva (free) or any free image editor. Add the book title and author text over the image. Keep typography clean.
7. Export final cover as PNG at 1500x2400 px.
$sql$, $sql$- Final cover PNG.
- `prompt-log.md` with every prompt you tried and what worked.
- GitHub repo `firefly-book-cover-<title>`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Book Cover Redesign

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Adobe Firefly

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$adobe-firefly$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Product Concept Ad: Fictional Product Poster$sql$, $sql$Design a full ad campaign visual for a fictional (but plausible) product using Firefly's generative fill and text-to-image.$sql$, $sql$Adobe Firefly$sql$, ARRAY['Image Generation','Marketing','Visual Design','Prompt Engineering','Storytelling']::text[], 75, $sql$Intermediate$sql$,
  $sql$### Step-by-step
1. Invent a plausible product (a smart water bottle, a bag for artists, etc.). Write a 3-sentence product brief.
2. In Firefly, generate a hero product shot using **Text to Image**:
   > Studio photograph of <product>, minimal white background, soft lighting, high detail
3. Try **Generative Fill** on the image to add a background scene (a desk, a hiking trail).
4. Download the best result.
5. In Canva (free), add: product name (custom typography), a one-line tagline, and a small ingredient/feature list.
6. Save as PNG + PDF at poster size.
$sql$, $sql$- Product hero image (Firefly PNG).
- Final poster PNG + PDF.
- `product-brief.md` and `prompt-log.md`.
- GitHub repo `firefly-product-ad`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Product Concept Ad: Fictional Product Poster

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Adobe Firefly

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$adobe-firefly$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Short Illustrated Story (5 Illustrations + Text)$sql$, $sql$Write a short original story and illustrate it with 5 Firefly-generated images that share a consistent style.$sql$, $sql$Adobe Firefly$sql$, ARRAY['Image Generation','Storytelling','Prompt Engineering','Visual Design','Documentation']::text[], 120, $sql$Advanced$sql$,
  $sql$### Step-by-step
1. Write an original 400–600 word short story (school-appropriate).
2. Pick 5 key moments to illustrate.
3. In Firefly, decide a **style keyword** you'll reuse for every image (e.g., "flat vector, muted palette, storybook"). Consistency comes from repeating this exact phrase.
4. Generate one image per scene. Save each. Track prompts.
5. Combine everything into a PDF: cover + 5 scenes with story text underneath each image. Use Canva free or Google Slides.
6. Publish.
$sql$, $sql$- 5 Firefly PNGs.
- Story PDF.
- `story.md` (full text).
- `prompt-log.md`.
- GitHub repo `firefly-illustrated-story`.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Short Illustrated Story (5 Illustrations + Text)

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Adobe Firefly

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$adobe-firefly$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Personal Portfolio Website (HTML/CSS)$sql$, $sql$Build and deploy your first live portfolio website using Replit's free tier and HTML/CSS.$sql$, $sql$Replit$sql$, ARRAY['Coding','Web Development','Documentation','Personal Branding','Visual Design']::text[], 90, $sql$Beginner$sql$,
  $sql$### Free-tier note
Replit free plan gives you public workspaces and free hosting via Replit Deployments (with limitations) or the built-in webview URL. This project uses the free static webview.

### Step-by-step
1. Sign in at **replit.com** free.
2. Click **Create Repl** → **HTML, CSS, JS** template. Name it `portfolio`.
3. In `index.html`, replace the body with a portfolio layout:
   - Header with your name + tagline
   - **About** section
   - **Projects** section (3 cards with title, description, link)
   - **Contact** section (school email)
4. In `style.css`, add real styling: font family, color palette, responsive layout with `max-width: 900px; margin: auto`.
5. Click **Run**. The webview shows your live site.
6. Copy the webview URL — that's your live link.
7. Optionally deploy with Replit's free Static Deployment.
$sql$, $sql$- Working Replit project (public URL).
- All source files uploaded to GitHub repo `replit-portfolio-site`.
- Live URL added to the README.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Personal Portfolio Website (HTML/CSS)

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Replit

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$replit$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$AI Chatbot in Python (No API Key Required)$sql$, $sql$Build a simple rules-based or free-tier AI chatbot in Python that runs live on Replit.$sql$, $sql$Replit$sql$, ARRAY['Coding','AI Literacy','Prompt Engineering','Documentation','Critical Thinking']::text[], 90, $sql$Intermediate$sql$,
  $sql$### Free-tier note
This assignment does **not** require a paid API. Build a keyword/menu chatbot in pure Python — no API keys, no billing.

### Step-by-step
1. Create a new **Python** Repl called `study-buddy-bot`.
2. Design your bot's personality: a study helper for one subject you know well.
3. In `main.py`, write a loop that:
   - Prints a welcome message
   - Reads user input
   - Matches keywords (`if 'quiz' in user_input.lower():`) and responds
   - Includes at least: greeting, help menu, 3 topic explanations, 5 practice questions with answer checking, a goodbye
4. Test every branch.
5. Add comments explaining what each section does.
6. Take a screenshot of a conversation.
$sql$, $sql$- `main.py` runnable in Replit.
- Public Repl URL.
- Screenshot of a conversation.
- GitHub repo `replit-study-bot` with `main.py` + README.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# AI Chatbot in Python (No API Key Required)

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Replit

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$replit$sql$;

INSERT INTO public.assignments (
  module_id, title, objectives, platform, skills, est_minutes, difficulty,
  instructions_md, deliverables_md, github_instructions_md, readme_template_md,
  reflection_questions, rubric, points, requires_github, status
)
SELECT id, $sql$Full-Stack Mini App: Personal Journal or Habit Tracker$sql$, $sql$Build a small web app in Replit that stores data using localStorage, with a real UI you would show an employer.$sql$, $sql$Replit$sql$, ARRAY['Coding','Web Development','Documentation','Visual Design','Critical Thinking']::text[], 150, $sql$Advanced$sql$,
  $sql$### Step-by-step
1. Pick one: a **daily journal**, **habit tracker**, or **reading log**.
2. Create an **HTML, CSS, JS** Repl.
3. Build UI: input form, submit button, list of past entries.
4. Use JavaScript `localStorage` to save entries so they persist on reload.
5. Add: delete button, entry count, and a "clear all" confirmation.
6. Style it professionally (fonts, spacing, colors, mobile-friendly).
7. Test on desktop and phone (open the webview URL on your phone).
8. Write a real README with screenshots, live link, and features list.
$sql$, $sql$- Public Replit project URL.
- Screenshot(s).
- GitHub repo `replit-<app-name>` with all source and README.$sql$, $sql$### Publish to GitHub

1. Sign in at github.com with your free student account.
2. Click **New repository** (green button, top left).
3. Name it clearly (example: `ai-portfolio-<project-name>`). Keep it **Public**. Check **Add a README**.
4. Click **Create repository**.
5. On the repo page, click **Add file → Upload files**. Drag every project file (images, PDFs, screenshots, exported files) into the box.
6. Scroll down, type a commit message like `Add project files`, click **Commit changes**.
7. Click the **README.md** file, then the pencil icon to edit. Paste the README template from this assignment and fill it in.
8. Commit the README.
9. Copy your repository URL from the address bar. Paste it into the submission box on this platform and click **Verify**.
$sql$, $sql$# Full-Stack Mini App: Personal Journal or Habit Tracker

## About this project
Short 1–2 sentence description of what you built.

## AI tool used
Replit

## Skills I practiced
- Prompt engineering
- (add 2–3 more)

## How I made it
1. Step 1 — what I asked the AI
2. Step 2 — how I revised the output
3. Step 3 — how I finished the project

## Screenshots / files
Add screenshots or link to the exported file.

## Reflection
2–3 sentences about what you learned and what you would improve next time.
$sql$,
  $sql$["Which prompt worked best and why?", "Where did the AI make a mistake, and how did you fix it?", "What is one skill you improved during this project?", "How could this project be shown to a college or employer?"]$sql$::jsonb, $sql${"completion": "All required steps finished and deliverables uploaded.", "creativity": "Student went beyond the minimum with a personal or original angle.", "accuracy": "AI output was checked, corrected, and free of obvious errors.", "documentation": "README is complete, clearly written, and includes AI tool + reflection.", "github_submission": "Repository is public, organized, and URL was verified."}$sql$::jsonb, 100, true, 'published'
FROM public.modules WHERE slug = $sql$replit$sql$;
