import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Strips HTML comments (including primer sentinels like <!-- primer:readme -->)
// and normalizes literal escape sequences (e.g. "\n", "\t") that can end up in
// JSON-stored lesson text so they render as real formatting instead of raw chars.
function stripComments(md: string) {
  let out = md.replace(/<!--[\s\S]*?-->/g, "");

  // Only unescape when the text actually contains literal escape sequences.
  if (/\\[nrt]/.test(out)) {
    out = out
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\n")
      .replace(/\\t/g, "  ");
  }

  out = out
    // Unescape markdown chars that were escaped during JSON/AI generation.
    .replace(/\\([-*_#>`[\]()+.!|])/g, "$1")
    // Drop stray leading "> " blockquote markers that add no meaning.
    .replace(/^[ \t]*>[ \t]?(?=\S)/gm, "")
    // Ensure a list/heading that follows text on the same paragraph starts fresh.
    .replace(/\n{3,}/g, "\n\n");

  return out.trim();
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
