import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Strips HTML comments (including primer sentinels like <!-- primer:readme -->)
function stripComments(md: string) {
  return md.replace(/<!--[\s\S]*?-->/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

export function Markdown({ text, className }: { text: string | null | undefined; className?: string }) {
  if (!text) return null;
  const cleaned = stripComments(text);
  return (
    <div
      className={
        "prose prose-sm max-w-none dark:prose-invert " +
        "prose-headings:font-display prose-headings:font-semibold " +
        "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-base prose-h3:mt-6 " +
        "prose-p:leading-relaxed prose-p:my-3 " +
        "prose-a:text-primary hover:prose-a:underline " +
        "prose-strong:text-foreground " +
        "prose-ul:my-3 prose-ol:my-3 prose-li:my-0.5 " +
        "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none " +
        "prose-pre:bg-muted prose-pre:text-foreground " +
        "prose-hr:my-6 " +
        (className ? " " + className : "")
      }
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleaned}</ReactMarkdown>
    </div>
  );
}
