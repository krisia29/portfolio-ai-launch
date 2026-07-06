import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export const modulesQO = queryOptions({
  queryKey: ["modules"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("modules")
      .select("*, assignments(id,title,platform,points,requires_github,status,est_minutes,difficulty)")
      .order("order_index");
    if (error) throw error;
    return data ?? [];
  },
});

export const meProfileQO = (userId: string | null) =>
  queryOptions({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const mySubmissionsQO = (userId: string | null) =>
  queryOptions({
    queryKey: ["mySubmissions", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("submissions")
        .select(
          "*, assignments(id,title,platform,points,module_id,modules(title,slug)), submission_artifacts(*), github_repo_snapshots(*)",
        )
        .eq("student_id", userId)
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const myClassesQO = (userId: string | null) =>
  queryOptions({
    queryKey: ["myClasses", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("class_members")
        .select("class_id, classes(*)")
        .eq("student_id", userId);
      if (error) throw error;
      return data ?? [];
    },
  });
