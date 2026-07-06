import { useEffect, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "student" | "teacher" | "admin";

const PREVIEW_KEY = "tpa:previewAsStudent";
const PREVIEW_EVENT = "tpa:previewAsStudent:change";

function readPreview(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(PREVIEW_KEY) === "1";
}

export function setPreviewAsStudent(on: boolean) {
  if (typeof window === "undefined") return;
  if (on) window.localStorage.setItem(PREVIEW_KEY, "1");
  else window.localStorage.removeItem(PREVIEW_KEY);
  window.dispatchEvent(new CustomEvent(PREVIEW_EVENT));
}

export function usePreviewAsStudent() {
  const [preview, setPreview] = useState<boolean>(() => readPreview());
  useEffect(() => {
    const sync = () => setPreview(readPreview());
    window.addEventListener(PREVIEW_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PREVIEW_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const set = useCallback((on: boolean) => setPreviewAsStudent(on), []);
  return [preview, set] as const;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [preview, setPreview] = usePreviewAsStudent();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setRoles([]);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .then(({ data }) => setRoles((data ?? []).map((r) => r.role as Role)));
  }, [session?.user?.id]);

  const actualIsStaff = roles.includes("teacher") || roles.includes("admin");
  const actualIsAdmin = roles.includes("admin");
  const previewAsStudent = actualIsStaff && preview;

  return {
    session,
    user: session?.user ?? null,
    loading,
    roles,
    // "actual" = the user's real permission level.
    actualIsStaff,
    actualIsAdmin,
    // "effective" = what the UI/permission checks should honor (respects preview mode).
    isStaff: actualIsStaff && !preview,
    isAdmin: actualIsAdmin && !preview,
    previewAsStudent,
    setPreviewAsStudent: setPreview,
    signOut: async () => {
      setPreview(false);
      await supabase.auth.signOut();
    },
  };
}

export type AuthUser = User;

/** Server-side role fetch used by route guards. */
export async function fetchRolesForCurrentUser(): Promise<Role[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", auth.user.id);
  return (data ?? []).map((r) => r.role as Role);
}
