
CREATE TYPE public.app_role AS ENUM ('student','teacher','admin');
CREATE TYPE public.submission_status AS ENUM ('draft','submitted','approved','revision_requested');
CREATE TYPE public.assignment_status AS ENUM ('draft','published','archived');
CREATE TYPE public.artifact_kind AS ENUM ('github_repo','github_pages','replit','live_url','pdf','pptx','docx','image','drive_url');

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT, nickname TEXT, avatar_url TEXT, email TEXT,
  github_username TEXT, github_profile_url TEXT,
  portfolio_public BOOLEAN NOT NULL DEFAULT false,
  school TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX profiles_github_username_key ON public.profiles(lower(github_username)) WHERE github_username IS NOT NULL;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE USING (auth.uid()=id) WITH CHECK (auth.uid()=id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid()=id);

-- roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_read_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid()=user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role IN ('teacher','admin'));
$$;

CREATE POLICY "user_roles_admin_read" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE user_count INT; assigned public.app_role;
BEGIN
  INSERT INTO public.profiles (id, display_name, email, avatar_url) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  ) ON CONFLICT (id) DO NOTHING;
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  assigned := CASE WHEN user_count=0 THEN 'admin'::public.app_role ELSE 'student'::public.app_role END;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- classes (define before class_members references)
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, period TEXT, school TEXT,
  join_code TEXT NOT NULL UNIQUE,
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
GRANT ALL ON public.classes TO service_role;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.class_members (
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (class_id, student_id)
);
GRANT SELECT, INSERT, DELETE ON public.class_members TO authenticated;
GRANT ALL ON public.class_members TO service_role;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "classes_staff_manage" ON public.classes FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "classes_enrolled_read" ON public.classes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.class_members cm WHERE cm.class_id=classes.id AND cm.student_id=auth.uid()));
CREATE POLICY "classes_lookup_by_code" ON public.classes FOR SELECT TO authenticated USING (true);

CREATE POLICY "class_members_self_read" ON public.class_members FOR SELECT TO authenticated
  USING (student_id=auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "class_members_self_join" ON public.class_members FOR INSERT TO authenticated
  WITH CHECK (student_id=auth.uid());
CREATE POLICY "class_members_staff_manage" ON public.class_members FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- modules
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_index INT NOT NULL,
  title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  description TEXT, platform TEXT, official_url TEXT,
  prereq_module_id UUID REFERENCES public.modules(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.modules TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.modules TO authenticated;
GRANT ALL ON public.modules TO service_role;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules_read_all" ON public.modules FOR SELECT USING (true);
CREATE POLICY "modules_staff_manage" ON public.modules FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- assignments
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL, objectives TEXT, platform TEXT,
  skills TEXT[] DEFAULT '{}',
  est_minutes INT, difficulty TEXT,
  instructions_md TEXT, deliverables_md TEXT,
  github_instructions_md TEXT, readme_template_md TEXT,
  reflection_questions JSONB DEFAULT '[]', rubric JSONB DEFAULT '[]',
  points INT NOT NULL DEFAULT 10,
  requires_github BOOLEAN NOT NULL DEFAULT false,
  status public.assignment_status NOT NULL DEFAULT 'published',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.assignments TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.assignments TO authenticated;
GRANT ALL ON public.assignments TO service_role;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assignments_read_published" ON public.assignments FOR SELECT
  USING (status='published' OR public.is_staff(auth.uid()));
CREATE POLICY "assignments_staff_manage" ON public.assignments FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.class_assignments (
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  due_at TIMESTAMPTZ,
  PRIMARY KEY (class_id, assignment_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_assignments TO authenticated;
GRANT ALL ON public.class_assignments TO service_role;
ALTER TABLE public.class_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "class_assignments_read" ON public.class_assignments FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid())
    OR EXISTS (SELECT 1 FROM public.class_members cm WHERE cm.class_id=class_assignments.class_id AND cm.student_id=auth.uid()));
CREATE POLICY "class_assignments_staff_manage" ON public.class_assignments FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- submissions
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  status public.submission_status NOT NULL DEFAULT 'submitted',
  score INT, feedback_md TEXT, reflection_md TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ, reviewed_by UUID REFERENCES auth.users(id),
  featured BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(assignment_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submissions TO authenticated;
GRANT SELECT ON public.submissions TO anon;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submissions_self_read" ON public.submissions FOR SELECT TO authenticated
  USING (student_id=auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "submissions_self_insert" ON public.submissions FOR INSERT TO authenticated
  WITH CHECK (student_id=auth.uid());
CREATE POLICY "submissions_self_update" ON public.submissions FOR UPDATE TO authenticated
  USING (student_id=auth.uid() AND status <> 'approved') WITH CHECK (student_id=auth.uid());
CREATE POLICY "submissions_staff_manage" ON public.submissions FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "submissions_public_portfolio" ON public.submissions FOR SELECT TO anon
  USING (status='approved' AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=submissions.student_id AND p.portfolio_public=true));

CREATE TABLE public.submission_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  kind public.artifact_kind NOT NULL,
  url TEXT, file_path TEXT, meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_artifacts TO authenticated;
GRANT SELECT ON public.submission_artifacts TO anon;
GRANT ALL ON public.submission_artifacts TO service_role;
ALTER TABLE public.submission_artifacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "artifacts_via_submission" ON public.submission_artifacts FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id=submission_id AND (s.student_id=auth.uid() OR public.is_staff(auth.uid()))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id=submission_id AND (s.student_id=auth.uid() OR public.is_staff(auth.uid()))));
CREATE POLICY "artifacts_public_portfolio" ON public.submission_artifacts FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.submissions s JOIN public.profiles p ON p.id=s.student_id
    WHERE s.id=submission_id AND s.status='approved' AND p.portfolio_public=true));

CREATE TABLE public.github_repo_snapshots (
  submission_id UUID PRIMARY KEY REFERENCES public.submissions(id) ON DELETE CASCADE,
  repo_owner TEXT, repo_name TEXT, description TEXT, primary_language TEXT,
  is_public BOOLEAN, has_readme BOOLEAN, is_empty BOOLEAN,
  last_pushed_at TIMESTAMPTZ, html_url TEXT, stars INT DEFAULT 0,
  verification_errors JSONB DEFAULT '[]',
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.github_repo_snapshots TO authenticated;
GRANT SELECT ON public.github_repo_snapshots TO anon;
GRANT ALL ON public.github_repo_snapshots TO service_role;
ALTER TABLE public.github_repo_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "snapshots_via_submission" ON public.github_repo_snapshots FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id=submission_id AND (s.student_id=auth.uid() OR public.is_staff(auth.uid()))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id=submission_id AND (s.student_id=auth.uid() OR public.is_staff(auth.uid()))));
CREATE POLICY "snapshots_public_portfolio" ON public.github_repo_snapshots FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.submissions s JOIN public.profiles p ON p.id=s.student_id
    WHERE s.id=submission_id AND s.status='approved' AND p.portfolio_public=true));

-- scaffolded
CREATE TABLE public.badges (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, description TEXT, icon TEXT);
GRANT SELECT ON public.badges TO authenticated, anon; GRANT ALL ON public.badges TO service_role;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_read" ON public.badges FOR SELECT USING (true);
CREATE POLICY "badges_staff" ON public.badges FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.student_badges (student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE, awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY(student_id, badge_id));
GRANT SELECT, INSERT, DELETE ON public.student_badges TO authenticated; GRANT SELECT ON public.student_badges TO anon; GRANT ALL ON public.student_badges TO service_role;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sb_read" ON public.student_badges FOR SELECT USING (student_id=auth.uid() OR public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=student_id AND p.portfolio_public=true));
CREATE POLICY "sb_staff" ON public.student_badges FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.announcements (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE, title TEXT NOT NULL, body_md TEXT, created_by UUID REFERENCES auth.users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated; GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ann_read" ON public.announcements FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR class_id IS NULL OR EXISTS (SELECT 1 FROM public.class_members cm WHERE cm.class_id=announcements.class_id AND cm.student_id=auth.uid()));
CREATE POLICY "ann_staff" ON public.announcements FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.resources (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL, title TEXT NOT NULL, kind TEXT, url TEXT, file_path TEXT, created_by UUID REFERENCES auth.users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated; GRANT SELECT ON public.resources TO anon; GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "res_read" ON public.resources FOR SELECT USING (true);
CREATE POLICY "res_staff" ON public.resources FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.certificates (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, title TEXT NOT NULL DEFAULT 'AI Portfolio Certificate of Completion', issued_at TIMESTAMPTZ NOT NULL DEFAULT now(), cert_code TEXT NOT NULL UNIQUE DEFAULT ('TPA-' || substr(replace(gen_random_uuid()::text,'-',''),1,10)), issued_by UUID REFERENCES auth.users(id));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated; GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cert_read" ON public.certificates FOR SELECT USING (student_id=auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "cert_staff" ON public.certificates FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at=now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER assignments_touch BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- seed modules
INSERT INTO public.modules (order_index, title, slug, description, platform, official_url) VALUES
 (1,'GitHub Fundamentals','github-fundamentals','Set up GitHub, create repos, write great READMEs, and publish sites with GitHub Pages. Complete this first.','GitHub','https://github.com'),
 (2,'Responsible AI & Digital Citizenship','responsible-ai','Prompt engineering, fact-checking, copyright, privacy, and ethical AI use.','General',NULL),
 (3,'ChatGPT','chatgpt','Conversational AI: prompt engineering, structured outputs, and productivity.','ChatGPT','https://chat.openai.com'),
 (4,'Claude','claude','Analysis and long-form reasoning with Claude.','Claude','https://claude.ai'),
 (5,'Canva AI','canva-ai','Design social posts and visuals with Canva AI.','Canva AI','https://canva.com'),
 (6,'NotebookLM','notebooklm','Turn source documents into podcasts, briefings, and study guides.','NotebookLM','https://notebooklm.google'),
 (7,'NapkinAI','napkinai','Turn ideas into visuals and diagrams.','NapkinAI','https://napkin.ai'),
 (8,'Gamma','gamma','Generate presentations and web pages with AI.','Gamma','https://gamma.app'),
 (9,'Adobe Firefly','adobe-firefly','Generative image creation with Adobe Firefly.','Adobe Firefly','https://firefly.adobe.com'),
 (10,'Replit','replit','Build and deploy apps with Replit + Replit AI.','Replit','https://replit.com');

UPDATE public.modules SET prereq_module_id=(SELECT id FROM public.modules WHERE slug='github-fundamentals') WHERE slug='responsible-ai';
UPDATE public.modules SET prereq_module_id=(SELECT id FROM public.modules WHERE slug='responsible-ai') WHERE order_index>=3;

-- seed badges
INSERT INTO public.badges (code, name, description, icon) VALUES
 ('first-repo','First Repository','Published your first GitHub repository.','🌱'),
 ('readme-expert','README Expert','Wrote a thorough, professional README.','📖'),
 ('prompt-engineer','Prompt Engineer','Demonstrated strong prompting skills.','🎯'),
 ('ai-researcher','AI Researcher','Completed a research-grade analysis.','🔬'),
 ('creative-designer','Creative Designer','Shipped standout visual work.','🎨'),
 ('presentation-pro','Presentation Pro','Delivered a polished presentation.','🎤'),
 ('coding-explorer','Coding Explorer','Wrote and shipped code.','💻'),
 ('website-publisher','Website Publisher','Deployed a live website.','🌐'),
 ('portfolio-builder','Portfolio Builder','Built a strong AI portfolio.','🗂️'),
 ('ai-innovator','AI Innovator','Combined AI tools creatively.','✨'),
 ('course-completion','Course Completion','Completed the full AI Portfolio course.','🏆');
