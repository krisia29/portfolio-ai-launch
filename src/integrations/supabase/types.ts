export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          body_md: string | null
          class_id: string | null
          created_at: string
          created_by: string | null
          id: string
          title: string
        }
        Insert: {
          body_md?: string | null
          class_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          title: string
        }
        Update: {
          body_md?: string | null
          class_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          created_at: string
          created_by: string | null
          deliverables_md: string | null
          difficulty: string | null
          est_minutes: number | null
          github_instructions_md: string | null
          id: string
          instructions_md: string | null
          module_id: string
          objectives: string | null
          platform: string | null
          points: number
          readme_template_md: string | null
          reflection_questions: Json | null
          requires_github: boolean
          rubric: Json | null
          skills: string[] | null
          status: Database["public"]["Enums"]["assignment_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deliverables_md?: string | null
          difficulty?: string | null
          est_minutes?: number | null
          github_instructions_md?: string | null
          id?: string
          instructions_md?: string | null
          module_id: string
          objectives?: string | null
          platform?: string | null
          points?: number
          readme_template_md?: string | null
          reflection_questions?: Json | null
          requires_github?: boolean
          rubric?: Json | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["assignment_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deliverables_md?: string | null
          difficulty?: string | null
          est_minutes?: number | null
          github_instructions_md?: string | null
          id?: string
          instructions_md?: string | null
          module_id?: string
          objectives?: string | null
          platform?: string | null
          points?: number
          readme_template_md?: string | null
          reflection_questions?: Json | null
          requires_github?: boolean
          rubric?: Json | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["assignment_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          code: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          cert_code: string
          id: string
          issued_at: string
          issued_by: string | null
          student_id: string
          title: string
        }
        Insert: {
          cert_code?: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          student_id: string
          title?: string
        }
        Update: {
          cert_code?: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          student_id?: string
          title?: string
        }
        Relationships: []
      }
      class_assignments: {
        Row: {
          assignment_id: string
          class_id: string
          due_at: string | null
        }
        Insert: {
          assignment_id: string
          class_id: string
          due_at?: string | null
        }
        Update: {
          assignment_id?: string
          class_id?: string
          due_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_assignments_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_members: {
        Row: {
          class_id: string
          joined_at: string
          student_id: string
        }
        Insert: {
          class_id: string
          joined_at?: string
          student_id: string
        }
        Update: {
          class_id?: string
          joined_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_members_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          archived: boolean
          created_at: string
          id: string
          join_code: string
          name: string
          period: string | null
          school: string | null
          teacher_id: string
        }
        Insert: {
          archived?: boolean
          created_at?: string
          id?: string
          join_code: string
          name: string
          period?: string | null
          school?: string | null
          teacher_id: string
        }
        Update: {
          archived?: boolean
          created_at?: string
          id?: string
          join_code?: string
          name?: string
          period?: string | null
          school?: string | null
          teacher_id?: string
        }
        Relationships: []
      }
      github_repo_snapshots: {
        Row: {
          description: string | null
          has_readme: boolean | null
          html_url: string | null
          is_empty: boolean | null
          is_public: boolean | null
          last_pushed_at: string | null
          primary_language: string | null
          repo_name: string | null
          repo_owner: string | null
          stars: number | null
          submission_id: string
          verification_errors: Json | null
          verified_at: string
        }
        Insert: {
          description?: string | null
          has_readme?: boolean | null
          html_url?: string | null
          is_empty?: boolean | null
          is_public?: boolean | null
          last_pushed_at?: string | null
          primary_language?: string | null
          repo_name?: string | null
          repo_owner?: string | null
          stars?: number | null
          submission_id: string
          verification_errors?: Json | null
          verified_at?: string
        }
        Update: {
          description?: string | null
          has_readme?: boolean | null
          html_url?: string | null
          is_empty?: boolean | null
          is_public?: boolean | null
          last_pushed_at?: string | null
          primary_language?: string | null
          repo_name?: string | null
          repo_owner?: string | null
          stars?: number | null
          submission_id?: string
          verification_errors?: Json | null
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_repo_snapshots_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          official_url: string | null
          order_index: number
          platform: string | null
          prereq_module_id: string | null
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          official_url?: string | null
          order_index: number
          platform?: string | null
          prereq_module_id?: string | null
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          official_url?: string | null
          order_index?: number
          platform?: string | null
          prereq_module_id?: string | null
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_prereq_module_id_fkey"
            columns: ["prereq_module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          github_profile_url: string | null
          github_username: string | null
          id: string
          nickname: string | null
          portfolio_public: boolean
          school: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          github_profile_url?: string | null
          github_username?: string | null
          id: string
          nickname?: string | null
          portfolio_public?: boolean
          school?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          github_profile_url?: string | null
          github_username?: string | null
          id?: string
          nickname?: string | null
          portfolio_public?: boolean
          school?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string
          created_by: string | null
          file_path: string | null
          id: string
          kind: string | null
          module_id: string | null
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_path?: string | null
          id?: string
          kind?: string | null
          module_id?: string | null
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_path?: string | null
          id?: string
          kind?: string | null
          module_id?: string | null
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      student_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          student_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          student_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_artifacts: {
        Row: {
          created_at: string
          file_path: string | null
          id: string
          kind: Database["public"]["Enums"]["artifact_kind"]
          meta: Json | null
          submission_id: string
          url: string | null
        }
        Insert: {
          created_at?: string
          file_path?: string | null
          id?: string
          kind: Database["public"]["Enums"]["artifact_kind"]
          meta?: Json | null
          submission_id: string
          url?: string | null
        }
        Update: {
          created_at?: string
          file_path?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["artifact_kind"]
          meta?: Json | null
          submission_id?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_artifacts_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          assignment_id: string
          class_id: string | null
          featured: boolean
          feedback_md: string | null
          id: string
          reflection_md: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          score: number | null
          status: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at: string
        }
        Insert: {
          assignment_id: string
          class_id?: string | null
          featured?: boolean
          feedback_md?: string | null
          id?: string
          reflection_md?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at?: string
        }
        Update: {
          assignment_id?: string
          class_id?: string | null
          featured?: boolean
          feedback_md?: string | null
          id?: string
          reflection_md?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["submission_status"]
          student_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "student" | "teacher" | "admin"
      artifact_kind:
        | "github_repo"
        | "github_pages"
        | "replit"
        | "live_url"
        | "pdf"
        | "pptx"
        | "docx"
        | "image"
        | "drive_url"
      assignment_status: "draft" | "published" | "archived"
      submission_status:
        | "draft"
        | "submitted"
        | "approved"
        | "revision_requested"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "teacher", "admin"],
      artifact_kind: [
        "github_repo",
        "github_pages",
        "replit",
        "live_url",
        "pdf",
        "pptx",
        "docx",
        "image",
        "drive_url",
      ],
      assignment_status: ["draft", "published", "archived"],
      submission_status: [
        "draft",
        "submitted",
        "approved",
        "revision_requested",
      ],
    },
  },
} as const
