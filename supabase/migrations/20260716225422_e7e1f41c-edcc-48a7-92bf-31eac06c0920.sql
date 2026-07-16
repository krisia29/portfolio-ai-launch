
-- 1) Full rewrite of the GitHub profile setup assignment
UPDATE public.assignments SET
  instructions_md = $md$<!-- primer:platform:github -->
### Concept primer: What is GitHub and why does every AI project live there?

**GitHub** is the world's largest place where people store, share, and collaborate on projects — originally code, but today anything made of files: writing, designs, presentations, images, research. Think of it as a mix of Google Drive, LinkedIn, and a portfolio site, built specifically around projects.

**Why we use it in this course.** A GitHub profile is portable proof of your work. Unlike a private document, a public GitHub repository has a permanent URL you can put on a college application, a résumé, or a scholarship form — and the reviewer can open it instantly, no login required. Your **profile page** at `github.com/<username>` becomes a live portfolio that updates every time you publish a new project.

**Key words you'll see over and over.**

- **Repository (or "repo")** — one project folder. Each assignment in this course lives in its own repo.
- **README** — the front-page document GitHub shows when someone opens a repo (see the README primer below).
- **Commit** — a saved snapshot of your files with a note describing what changed. Every edit you make on GitHub is a commit.
- **Public vs. Private** — public repos are visible to anyone with the URL. In this course you'll use **Public** so reviewers can grade them.
- **Profile README** — a special repo whose name matches your username exactly; its README shows up at the top of your profile page.

---

### Privacy first — before you create anything

Your GitHub profile is public to the entire internet. Follow these rules from day one:

**Only share:** your first and last name, a professional personal email, your skills, your projects, your certifications, your career interests, and links to your portfolio or resume.

**Never publish:** your school name, school district, school email, graduation year, grade level, age, birth date, home address, phone number, city or neighborhood of residence, class or daily schedule, student ID, parent info, personal social media, or any photo that reveals a school logo, uniform, classroom number, or identifying background.

**Username guidance.** Pick a professional handle that does *not* reveal your school, city, birth year, age, or graduation year. Good examples: `alexcodes`, `krisiabuilds`, `buildwithsam`, `jordanmakes`. Avoid formats like `firstlast-hs`, `firstlast2027`, or anything with school initials or a mascot.

---

### What you will build
A GitHub profile that looks professional and includes a special profile README that appears at the top of your profile page.

### Step-by-step
1. Go to **github.com** and click **Sign up**. Pick a professional username that does not reveal personal information (see examples above). Save your password somewhere safe.
2. Verify your email using a **personal email address** created specifically for career and portfolio use (for example, `firstname.lastname@gmail.com`). Do **not** use a school-issued email.
3. Click your profile icon (top right) → **Your profile**. Add a professional photo or avatar (optional), your first and last name, and a short professional bio. Example: *"Aspiring AI and software developer building projects in machine learning, automation, and web development."* Do **not** add your school, city/state, grade, graduation year, or age.
4. Create the profile README: click **New repository**. Type your **exact GitHub username** as the repository name. Check **Public**, check **Add a README**. Click **Create repository**.
5. Edit `README.md`. Replace the content with:
   - A one-line professional intro (see the README template below).
   - Section: **Skills I'm learning** (bullet list)
   - Section: **Career interests** (1–3 areas you want to grow into)
   - Section: **Projects** (leave placeholders like "- Coming soon: ChatGPT research project")
   - Section: **Contact** — professional personal email only. No school email, no phone, no address.
6. Commit the changes.
7. Visit `github.com/<yourusername>` and confirm the README appears at the top.
8. Review your profile one more time and confirm none of the following appears anywhere: school name, district, school email, graduation year, grade level, age, birth date, address, phone, city, class schedule, or identifying photos.$md$,
  readme_template_md = $md$# <yourusername>

Hi, I'm <Your First Name> <Your Last Name>. I'm an aspiring AI and software developer building projects in machine learning, automation, and web development.

## Skills I'm learning
- Prompt engineering
- Documentation
- Web publishing

## Career interests
- (e.g., AI product design, software engineering, data science)

## Projects
- Coming soon: ChatGPT research project

## Certifications
- (List any you've earned; leave blank for now if none.)

## Contact
Professional email: firstname.lastname@example.com
Portfolio: https://github.com/<yourusername>

<!-- Privacy reminder: never include school name, district, school email, graduation year, grade, age, birth date, home address, phone number, city of residence, class schedule, or identifying photos in this README. -->$md$
WHERE id = '6bb0622a-0c1d-4be7-a64e-a9c282faea00';

-- 2) Global phrase replacements across assignment content (privacy hygiene)
UPDATE public.assignments SET
  instructions_md = regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(instructions_md,
              'High school student learning AI and building a portfolio\.',
              'Aspiring AI and software developer building portfolio projects.', 'g'),
            'high school student', 'student developer', 'g'),
          'High school student', 'Student developer', 'g'),
        'School email:?\s*you@school\.edu', 'Professional email: firstname.lastname@example.com', 'gi'),
      'school email( only)?', 'professional personal email', 'gi'),
    'you@school\.edu', 'firstname.lastname@example.com', 'gi'),
  github_instructions_md = regexp_replace(
    regexp_replace(github_instructions_md,
      'school email( only)?', 'professional personal email', 'gi'),
    'you@school\.edu', 'firstname.lastname@example.com', 'gi'),
  readme_template_md = regexp_replace(
    regexp_replace(
      regexp_replace(COALESCE(readme_template_md, ''),
        'School email:?\s*you@school\.edu', 'Professional email: firstname.lastname@example.com', 'gi'),
      'school email( only)?', 'professional personal email', 'gi'),
    'you@school\.edu', 'firstname.lastname@example.com', 'gi');
