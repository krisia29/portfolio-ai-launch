import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { downloadSubmissionFile } from "@/lib/submission-files.functions";

export function useSubmissionFile() {
  const download = useServerFn(downloadSubmissionFile);
  const mutation = useMutation({
    mutationFn: async ({ path, name }: { path: string; name: string }) => {
      const response = await download({ data: { path } });
      if (!response.ok) throw new Error("Could not open file. Please try again.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not open file"),
  });
  return { openFile: mutation.mutate, opening: mutation.isPending };
}