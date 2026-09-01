// Declarative UI-mockup schema. Rendered by <StepMockup /> to show students a
// realistic picture of the tool screen a step refers to.

export type MockupBlock =
  | { type: "heading"; text: string; sub?: string }
  | {
      type: "field";
      label?: string;
      value?: string;
      placeholder?: string;
      prefix?: string;
      hint?: string;
      note?: string;
      optional?: boolean;
    }
  | { type: "textarea"; label?: string; value: string }
  | {
      type: "radios";
      items: { title: string; body?: string; checked?: boolean }[];
    }
  | { type: "checks"; label?: string; items: { text: string; checked?: boolean }[] }
  | { type: "button"; text: string; secondary?: string }
  | { type: "chat"; messages: { role: "user" | "ai"; text: string }[] }
  | { type: "prompt"; value?: string; placeholder?: string; action?: string }
  | { type: "list"; label?: string; items: { title: string; sub?: string }[] }
  | {
      type: "tiles";
      label?: string;
      items: { title: string; sub?: string; selected?: boolean }[];
    }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "code"; text: string }
  | { type: "note"; text: string };

export type StepMockup = {
  app?: string;
  url?: string;
  caption?: string;
  /** When true, keep the sample prompt below instead of injecting the step's actual prompt text. */
  keepSample?: boolean;
  blocks: MockupBlock[];
};
