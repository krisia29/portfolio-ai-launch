import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Github, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, roles } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [nickname, setNickname] = useState("");
  const [ghUser, setGhUser] = useState("");
  const [publicPortfolio, setPublicPortfolio] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (!data) return;
      setDisplayName(data.display_name ?? "");
      setNickname(data.nickname ?? "");
      setGhUser(data.github_username ?? "");
      setPublicPortfolio(!!data.portfolio_public);
    });
  }, [user?.id]);

  const save = async () => {
    if (!user) return;
    setLoading(true);
    const cleanGh = ghUser.trim().replace(/^@/, "");
    const { error } = await supabase.from("profiles").update({
      display_name: displayName.trim() || null,
      nickname: nickname.trim() || null,
      github_username: cleanGh || null,
      github_profile_url: cleanGh ? `https://github.com/${cleanGh}` : null,
      portfolio_public: publicPortfolio,
    }).eq("id", user.id);
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved.");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-display font-semibold">Profile</h1>
      <p className="text-muted-foreground mt-1 text-sm">Roles: {roles.join(", ") || "student"}</p>

      <div className="mt-6 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">
        <div className="flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 mt-0.5 text-warning shrink-0" />
          <div>
            <div className="font-medium">Privacy reminder</div>
            <p className="mt-1 text-muted-foreground">
              Your profile helps future employers and reviewers find your work.
              Only share your first and last name, career interests, skills, projects,
              certifications, portfolio links, GitHub username, and a professional
              personal email. Never publish your school, district, school email,
              graduation year, grade level, age, birth date, home address, phone,
              city of residence, class schedule, or any photo that identifies where
              you attend school.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-6 space-y-4">
        <div>
          <Label htmlFor="dn">Display name</Label>
          <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={100} />
          <p className="text-xs text-muted-foreground mt-1">Use your first and last name.</p>
        </div>
        <div>
          <Label htmlFor="nick">Nickname (leaderboard display)</Label>
          <Input id="nick" value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={60} />
        </div>
        <div>
          <Label htmlFor="gh"><span className="inline-flex items-center gap-1"><Github className="w-3.5 h-3.5" /> GitHub username</span></Label>
          <Input id="gh" placeholder="alexcodes" value={ghUser} onChange={(e) => setGhUser(e.target.value)} maxLength={39} />
          <p className="text-xs text-muted-foreground mt-1">
            Pick a professional handle that doesn't reveal your school, city, birth year,
            age, or graduation year (e.g., <code>alexcodes</code>, <code>krisiabuilds</code>, <code>buildwithsam</code>).
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <div>
            <Label>Public portfolio</Label>
            <p className="text-xs text-muted-foreground">Let anyone view your approved projects at /u/&lt;username&gt;.</p>
          </div>
          <Switch checked={publicPortfolio} onCheckedChange={setPublicPortfolio} />
        </div>
        <Button onClick={save} disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
      </div>
    </div>
  );
}
