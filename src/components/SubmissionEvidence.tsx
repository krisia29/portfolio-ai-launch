import { ExternalLink } from "lucide-react";
import { useSubmissionFile } from "@/hooks/use-submission-file";
import { Button } from "@/components/ui/button";

export function SubmissionEvidence({ evidence }: { evidence: any }) {
  const entries = Object.entries(evidence ?? {}) as [string, any][];
  const items = entries.filter(([, v]) => v && (v.link || v.files?.length || v.reflection || v.text));
  const { openFile, opening } = useSubmissionFile();
  return (
    <div className="mt-4 rounded-lg border bg-muted/40 p-3 text-sm">
      <div className="text-xs font-semibold text-muted-foreground">Submitted work</div>
      {items.length === 0 ? (
        <div className="mt-1 text-muted-foreground">No links, files or answers were attached.</div>
      ) : (
        <div className="mt-2 space-y-3">
          {items.map(([step, v]) => (
            <div key={step}>
              <div className="text-xs text-muted-foreground capitalize">{step.replace(/[-_]/g, " ")}</div>
              {v.link && (
                <a href={v.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all inline-flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 shrink-0" /> {v.link}
                </a>
              )}
              {v.files?.map((f: any) => (
                <Button variant="link" key={f.path} disabled={opening} onClick={() => openFile({ path: f.path, name: f.name })} className="block h-auto max-w-full whitespace-normal break-all p-0 text-left">
                  {f.name}
                </Button>
              ))}
              {(v.reflection || v.text) && <div className="whitespace-pre-wrap mt-1">{v.reflection || v.text}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

