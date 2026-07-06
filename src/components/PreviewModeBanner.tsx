import { useAuth } from "@/lib/auth";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PreviewModeBanner() {
  const { previewAsStudent, setPreviewAsStudent } = useAuth();
  if (!previewAsStudent) return null;
  return (
    <div className="border-b border-amber-300/60 bg-amber-100 text-amber-950 dark:bg-amber-500/15 dark:text-amber-100">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-3 text-sm">
        <div className="inline-flex items-center gap-2 font-medium">
          <Eye className="w-4 h-4" />
          Preview mode — you're viewing the platform as a student. Submissions and edits are disabled.
        </div>
        <Button size="sm" variant="outline" className="border-amber-400/70 bg-white/70 hover:bg-white" onClick={() => setPreviewAsStudent(false)}>
          Return to admin dashboard
        </Button>
      </div>
    </div>
  );
}
