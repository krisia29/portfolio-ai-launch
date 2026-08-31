import type { StepMockup as StepMockupData, MockupBlock } from "@/lib/mockup";
import { Check } from "lucide-react";

function Field({ b }: { b: Extract<MockupBlock, { type: "field" }> }) {
  return (
    <div className="space-y-1.5">
      {b.label && (
        <div className="text-[13px] font-medium text-foreground">
          {b.label}{" "}
          {b.optional && (
            <span className="font-normal text-muted-foreground">(optional)</span>
          )}
        </div>
      )}
      <div className="flex items-center gap-2">
        {b.prefix && (
          <>
            <div className="rounded-md border bg-muted/50 px-2.5 py-1.5 text-[13px] text-muted-foreground">
              {b.prefix}
            </div>
            <span className="text-muted-foreground">/</span>
          </>
        )}
        <div
          className={`flex-1 rounded-md border bg-background px-2.5 py-1.5 text-[13px] ${
            b.value ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {b.value ?? b.placeholder ?? ""}
        </div>
      </div>
      {b.hint && (
        <div className="flex items-center gap-1 text-[12px] text-success">
          <Check className="h-3.5 w-3.5" /> {b.hint}
        </div>
      )}
      {b.note && <p className="text-[12px] text-muted-foreground">{b.note}</p>}
    </div>
  );
}

function Block({ b }: { b: MockupBlock }) {
  switch (b.type) {
    case "heading":
      return (
        <div>
          <div className="text-[15px] font-semibold leading-snug">{b.text}</div>
          {b.sub && (
            <p className="mt-1 text-[12.5px] text-muted-foreground">{b.sub}</p>
          )}
        </div>
      );

    case "field":
      return <Field b={b} />;

    case "textarea":
      return (
        <div className="space-y-1.5">
          {b.label && (
            <div className="text-[13px] font-medium">{b.label}</div>
          )}
          <div className="min-h-[76px] whitespace-pre-wrap rounded-md border bg-background p-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
            {b.value}
          </div>
        </div>
      );

    case "radios":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {b.items.map((it, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 rounded-md border p-2.5 ${
                it.checked ? "border-primary bg-primary/5" : "bg-background"
              }`}
            >
              <span
                className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                  it.checked ? "border-primary" : ""
                }`}
              >
                {it.checked && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-medium">{it.title}</span>
                {it.body && (
                  <span className="block text-[12px] text-muted-foreground">
                    {it.body}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      );

    case "checks":
      return (
        <div className="space-y-2 border-t pt-3">
          {b.label && (
            <div className="text-[13px] font-medium">{b.label}</div>
          )}
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px]">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  it.checked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background"
                }`}
              >
                {it.checked && <Check className="h-3 w-3" />}
              </span>
              <span
                className={it.checked ? "" : "text-muted-foreground"}
              >
                {it.text}
              </span>
            </div>
          ))}
        </div>
      );

    case "button":
      return (
        <div className="flex items-center gap-2 pt-1">
          <div className="rounded-md bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground">
            {b.text}
          </div>
          {b.secondary && (
            <div className="rounded-md border px-3.5 py-2 text-[13px] font-medium text-muted-foreground">
              {b.secondary}
            </div>
          )}
        </div>
      );

    case "chat":
      return (
        <div className="space-y-2.5">
          {b.messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary/10 text-foreground"
                    : "border bg-background text-muted-foreground"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      );

    case "prompt":
      return (
        <div className="flex items-center gap-2 rounded-full border bg-background px-3.5 py-2.5">
          <span
            className={`flex-1 truncate text-[12.5px] ${b.value ? "" : "text-muted-foreground"}`}
          >
            {b.value ?? b.placeholder ?? "Ask anything…"}
          </span>
          <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
            {b.action ?? "Send"}
          </span>
        </div>
      );

    case "list":
      return (
        <div className="space-y-2">
          {b.label && (
            <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
              {b.label}
            </div>
          )}
          <div className="divide-y rounded-md border bg-background">
            {b.items.map((it, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded bg-primary/15" />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium">
                    {it.title}
                  </span>
                  {it.sub && (
                    <span className="block text-[12px] text-muted-foreground">
                      {it.sub}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case "tiles":
      return (
        <div className="space-y-2">
          {b.label && (
            <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
              {b.label}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {b.items.map((it, i) => (
              <div
                key={i}
                className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-md border p-2 text-center ${
                  it.selected
                    ? "border-primary bg-primary/5"
                    : "bg-[repeating-linear-gradient(45deg,hsl(var(--muted))_0_6px,transparent_6px_12px)]"
                }`}
              >
                <span className="text-[11.5px] font-medium leading-tight">
                  {it.title}
                </span>
                {it.sub && (
                  <span className="text-[10.5px] text-muted-foreground">
                    {it.sub}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case "table":
      return (
        <div className="overflow-hidden rounded-md border">
          <div className="grid bg-muted/50 text-[12px] font-semibold" style={{ gridTemplateColumns: `repeat(${b.columns.length}, minmax(0,1fr))` }}>
            {b.columns.map((c, i) => (
              <div key={i} className="px-2.5 py-2">{c}</div>
            ))}
          </div>
          {b.rows.map((r, ri) => (
            <div
              key={ri}
              className="grid border-t text-[12px] text-muted-foreground"
              style={{ gridTemplateColumns: `repeat(${b.columns.length}, minmax(0,1fr))` }}
            >
              {r.map((c, ci) => (
                <div key={ci} className="px-2.5 py-2">{c}</div>
              ))}
            </div>
          ))}
        </div>
      );

    case "code":
      return (
        <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 text-[12px] leading-relaxed">
          <code>{b.text}</code>
        </pre>
      );

    case "note":
      return (
        <p className="text-[12px] text-muted-foreground">{b.text}</p>
      );

    default:
      return null;
  }
}

export function StepMockup({ mockup }: { mockup?: StepMockupData }) {
  if (!mockup || !mockup.blocks?.length) return null;

  return (
    <figure className="mt-4 overflow-hidden rounded-xl border bg-muted/30 p-3 sm:p-4">
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
          </span>
          <div className="mx-auto max-w-[70%] truncate rounded-full border bg-background px-3 py-0.5 text-[11px] text-muted-foreground">
            {mockup.url ?? mockup.app}
          </div>
        </div>

        {/* screen */}
        <div className="space-y-3.5 p-4">
          {mockup.app && (
            <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              {mockup.app}
            </div>
          )}
          {mockup.blocks.map((b, i) => (
            <Block key={i} b={b} />
          ))}
        </div>
      </div>
      {mockup.caption && (
        <figcaption className="mt-2.5 text-center text-[12px] text-muted-foreground">
          {mockup.caption}
        </figcaption>
      )}
    </figure>
  );
}
