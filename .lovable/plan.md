
# Tech Pathways Academy: AI Portfolio — MVP Plan

Scope: Core LMS loop (auth, classes, modules, assignments, submissions, grading, dashboards) + first-class GitHub OAuth and repository verification. Portfolio auto-generation from verified repos is included because it falls out of the GitHub work. Badges, leaderboard, certificates, CSV/Excel exports, announcements, and resource library are **scaffolded as tables and stubbed UI** so they can be filled in later without redesign.

## 1. Stack & Architecture

- TanStack Start (already scaffolded), React 19, Tailwind v4, shadcn.
- Lovable Cloud (Supabase) for DB, auth, storage, server functions.
- GitHub OAuth via Supabase Auth (native provider) — set up with `supabase--configure_social_auth`.
- Server functions (`createServerFn`) for all GitHub API calls (using the user's provider token) and any privileged reads. Public marketing/landing routes stay top-level; the app itself lives under `_authenticated/`.

## 2. Data Model (Supabase)

All tables in `public` schema with GRANTs + RLS. Roles held in a separate `user_roles` table using the `app_role` enum + `has_role()` security-definer function (per project rules).

- `app_role` enum: `student`, `teacher`, `admin`
- `profiles` (id → auth.users, display_name, avatar_url, github_username, github_user_id, github_profile_url, portfolio_public bool, nickname)
- `user_roles` (user_id, role)
- `schools` (id, name) — future scalability
- `classes` (id, school_id, teacher_id, name, period, join_code unique, archived)
- `class_members` (class_id, student_id, joined_at)
- `modules` (id, order_index, title, slug, description, platform, is_locked_until_prereq, prereq_module_id)
- `assignments` (id, module_id, title, objectives, platform, skills[], est_minutes, difficulty, instructions_md, deliverables_md, github_instructions_md, readme_template_md, reflection_questions jsonb, rubric jsonb, points, due_at, status: draft/published/archived, created_by)
- `class_assignments` (class_id, assignment_id, due_at_override) — assignments are assigned per class
- `submissions` (id, assignment_id, student_id, class_id, submitted_at, status: submitted/approved/revision_requested, score, feedback_md, reflection_md)
- `submission_artifacts` (id, submission_id, kind: github_repo | github_pages | replit | live_url | pdf | pptx | docx | image | drive_url, url, file_path, meta jsonb)
- `github_repo_snapshots` (submission_id, repo_owner, repo_name, description, primary_language, is_public, has_readme, is_empty, last_pushed_at, html_url, verified_at, verification_errors jsonb) — cached from GitHub API at submission time and refreshable
- Scaffolded for later: `badges`, `student_badges`, `announcements`, `resources`, `certificates`. Tables + RLS created but only minimal UI in MVP.

All user-owned data has RLS `auth.uid() = student_id` (+ teacher/admin via `has_role`). Public portfolio reads use narrow `TO anon` SELECT policies filtered to `portfolio_public = true` and approved submissions only.

## 3. Auth Flow

- Preferred: **Sign in with GitHub** (Supabase GitHub OAuth). On first sign-in, trigger auto-populates `profiles` with GitHub username, avatar, profile URL, and stores `provider_token` for API calls.
- Alternative: Email + password signup.
- Existing users can connect/disconnect GitHub from Profile page (`supabase.auth.linkIdentity` / `unlinkIdentity`).
- First registered user is auto-granted `admin` role (bootstrap); admin can promote teachers. Students self-register and join a class via **class code**.
- Password reset page at `/reset-password` (per auth rules).
- Auth-required routes live under `src/routes/_authenticated/` using the integration-managed gate.

## 4. GitHub Integration

Server functions call the GitHub REST API. Token source in priority order:
1. Student's Supabase `provider_token` (from GitHub OAuth) — required scopes: `read:user`, `public_repo`.
2. Falls back to unauthenticated public API for verification if student signed up via email.

Server functions:
- `verifyRepoSubmission({ url })` → parses owner/repo, fetches `/repos/{owner}/{repo}`, checks: exists, public, not empty, ownership (owner === student's `github_username` when known), and `/repos/{owner}/{repo}/contents/README.md`. Returns structured errors surfaced to the student before submission is allowed.
- `refreshRepoSnapshot(submissionId)` — re-fetches metadata for grading view.
- `getStudentGithubStats(studentId)` — repo count, repos submitted for course, README presence, deployed sites (any `github_pages` or `live_url` artifact).

Submission UI for GitHub kind shows: a README checklist (title, description, AI tools, skills, screenshots, install/usage, reflection) and validation results inline. Students cannot submit a GitHub repo artifact that fails validation.

## 5. Routes

Public:
- `/` — landing with product pitch + Sign in with GitHub CTA
- `/auth` — sign in / sign up (GitHub + email)
- `/reset-password`
- `/u/$username` — public portfolio page (only if student opted in), lists approved projects

Authenticated (`_authenticated/`):
- `/dashboard` — role-aware; renders student or instructor dashboard
- `/classes` — student: list joined classes + join-by-code; teacher/admin: manage classes
- `/classes/$classId` — roster, assignments in class, announcements
- `/modules` — course catalog (student view of unlocked modules)
- `/modules/$moduleSlug` — module detail with assignments
- `/assignments/$assignmentId` — assignment detail + submission form
- `/submissions/$submissionId` — student view of feedback / status
- `/portfolio` — the current student's portfolio (auto-built from approved submissions)
- `/profile` — profile + GitHub connect/disconnect + portfolio visibility toggle
- `/admin/assignments` — CRUD, duplicate, publish/archive (teacher + admin)
- `/admin/modules` — CRUD
- `/admin/review` — submissions queue with filters (status, class, assignment, platform, student, date)
- `/admin/users` — admin: manage teachers/roles

## 6. Dashboards (MVP)

Student dashboard:
- Current class + join code entry
- Overall progress bar (approved / total assigned)
- Portfolio completion % (approved submissions with GitHub repo / total assignments requiring GitHub)
- GitHub stats card (repos count, published sites, READMEs present)
- Upcoming due dates, recently graded, announcements teaser

Instructor dashboard:
- Totals: students, active (last 7d), pending reviews, approved
- Portfolio completion rate across class
- Repos submitted vs. approved
- Students missing GitHub connection / missing READMEs
- Recent activity feed

Badges/leaderboard/certificates render placeholder empty-states in MVP.

## 7. Seed Content

Migration seeds all 9 modules in order with 1–2 starter assignments each:
1. GitHub Fundamentals (prereq for everything)
2. Responsible AI & Digital Citizenship (unlocks 3–9)
3. ChatGPT · 4. Claude · 5. Canva AI · 6. NotebookLM · 7. NapkinAI · 8. Gamma · 9. Adobe Firefly · 10. Replit

Each seeded assignment includes objectives, instructions, deliverables, GitHub publishing instructions where applicable, README template, reflection questions, rubric, and default points.

## 8. Design Direction

Clean modern EdTech: neutral background, one strong brand accent, card-based layouts, generous spacing, subtle progress rings. Not the generic AI-purple gradient look. Fonts: a warm-modern sans for headings + neutral sans for body (chosen at build time in `src/routes/__root.tsx` via `<link>`). Fully responsive; dashboards degrade to single column on mobile.

## 9. Out of Scope for MVP (scaffolded for later)

- Badge automation logic (tables exist; award manually via admin later)
- Leaderboard computation (tables exist; UI is placeholder)
- Certificate PDF generation
- CSV/Excel exports
- Announcements + Resources CRUD UIs (tables exist)
- Employer/scholarship showcase pages, resume/transcript generation

## 10. Technical Details

- Secrets: `supabase--configure_social_auth` enables GitHub provider — user supplies GitHub OAuth App Client ID + Secret via that flow. No manual secret tools needed.
- GitHub scopes requested: `read:user user:email public_repo`.
- Rate-limit-safe: repo verification is on-demand (submit / refresh), not polling. Snapshots cached in `github_repo_snapshots`.
- File uploads (PDF/PPTX/DOCX/images) go to a private Supabase Storage bucket `submissions`; instructors get signed URLs.
- All server writes use `requireSupabaseAuth`; RLS enforced. Grants added on every new public table.
- Head metadata set on `__root.tsx` (real title/description) and each shareable public route (`/`, `/u/$username`).

## 11. Build Order (single implementation pass)

1. Enable Lovable Cloud; migrations for schema + RLS + grants + seed.
2. Configure GitHub OAuth provider; add auth pages + role bootstrap trigger.
3. Class join-code flow + roster.
4. Modules + assignments (student read views + admin CRUD).
5. Submission form with artifact kinds + GitHub verification server fn.
6. Instructor review queue + grading (approve / revise / feedback / points).
7. Student + instructor dashboards.
8. Auto-portfolio page + public `/u/$username`.
9. Profile page (GitHub connect/disconnect, portfolio visibility).
10. Polish, empty states, responsive pass.

Ready to implement on approval.
