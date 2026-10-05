/**
 * Server-only helpers that push student submissions into a single
 * Google Sheet. All Google calls go through the Lovable connector gateway.
 */
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";
const SHEET_TITLE = "Tech Pathways Academy — Student Progress";
const TAB = "Progress";
const SETTINGS_KEY = "progress_spreadsheet_id";
const APP_URL = "https://portfolio-ai-launch.lovable.app";
const BUCKET = "submission-screenshots";
const FILE_LINK_SECONDS = 60 * 60 * 24 * 365; // 1 year

export const HEADERS = [
  "Student",
  "Email",
  "GitHub",
  "Module",
  "Assignment",
  "Platform",
  "Points possible",
  "Score",
  "Status",
  "Submitted at",
  "Reviewed at",
  "Repo URL",
  "Live URL",
  "Uploaded files",
  "Other submitted info",
  "Open submission",
];

function gatewayHeaders() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
  if (!lovableKey || !connectionKey) {
    throw new Error("Google Sheets is not connected for this project yet.");
  }
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": connectionKey,
    "Content-Type": "application/json",
  };
}

async function gateway(path: string, init?: { method?: string; body?: unknown }) {
  const res = await fetch(`${GATEWAY}${path}`, {
    method: init?.method ?? "GET",
    headers: gatewayHeaders(),
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Google Sheets request failed [${res.status}]: ${text}`);
    throw new Error(`Google Sheets request failed [${res.status}]: ${text}`);
  }
  return res.json();
}

type Admin = Awaited<typeof import("@/integrations/supabase/client.server")>["supabaseAdmin"];

async function getOrCreateSpreadsheet(admin: Admin) {
  const { data: existing } = await admin
    .from("app_settings")
    .select("value")
    .eq("key", SETTINGS_KEY)
    .maybeSingle();

  if (existing?.value) {
    try {
      await gateway(`/spreadsheets/${existing.value}?fields=spreadsheetId`);
      return existing.value as string;
    } catch {
      // fall through and create a fresh spreadsheet
    }
  }

  const created = (await gateway("/spreadsheets", {
    method: "POST",
    body: {
      properties: { title: SHEET_TITLE },
      sheets: [{ properties: { title: TAB } }],
    },
  })) as { spreadsheetId: string };

  await admin
    .from("app_settings")
    .upsert({ key: SETTINGS_KEY, value: created.spreadsheetId, updated_at: new Date().toISOString() });

  return created.spreadsheetId;
}

const isRepo = (u: string) => /github\.com\//i.test(u) && !/\.github\.io/i.test(u);
const label = (k: string) => k.replace(/[-_]/g, " ");

/** Rebuilds the whole sheet: one row per student per assignment submission. */
export async function syncApprovedProgress() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: subs, error } = await supabaseAdmin
    .from("submissions")
    .select(
      "id, student_id, assignment_id, status, score, reflection_md, submitted_at, reviewed_at, assignments(title, platform, points, modules(title, order_index)), submission_artifacts(kind, url, file_path)",
    )
    .neq("status", "draft")
    .order("submitted_at", { ascending: true });
  if (error) throw new Error(error.message);

  const rows = subs ?? [];
  const ids = [...new Set(rows.map((r: any) => r.student_id))];
  const aIds = [...new Set(rows.map((r: any) => r.assignment_id))];
  const people = new Map<string, any>();
  const evidence = new Map<string, any>();
  if (ids.length) {
    const [{ data: profiles }, { data: progress }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, display_name, email, github_username").in("id", ids),
      supabaseAdmin
        .from("assignment_progress")
        .select("student_id, assignment_id, evidence")
        .in("student_id", ids)
        .in("assignment_id", aIds),
    ]);
    for (const p of profiles ?? []) people.set(p.id, p);
    for (const p of (progress ?? []) as any[]) evidence.set(`${p.student_id}:${p.assignment_id}`, p.evidence ?? {});
  }

  const values: string[][] = [HEADERS];
  for (const s of rows as any[]) {
    const p = people.get(s.student_id) ?? {};
    const arts = s.submission_artifacts ?? [];
    const ev = evidence.get(`${s.student_id}:${s.assignment_id}`) ?? {};

    const repos: string[] = [];
    const lives: string[] = [];
    const files: string[] = [];
    const other: string[] = [];
    const add = (arr: string[], v?: string | null) => v && !arr.includes(v) && arr.push(v);

    add(repos, arts.find((a: any) => a.kind === "github_repo")?.url);
    for (const a of arts) if (a.kind !== "github_repo" && a.url) add(lives, a.url);

    const filePaths: { name: string; path: string }[] = [];
    for (const a of arts) if (a.file_path) filePaths.push({ name: a.file_path.split("/").pop(), path: a.file_path });

    for (const [step, v] of Object.entries(ev) as [string, any][]) {
      if (!v) continue;
      if (v.link) add(isRepo(v.link) ? repos : lives, String(v.link).trim());
      for (const f of v.files ?? []) if (f?.path) filePaths.push({ name: f.name ?? f.path.split("/").pop(), path: f.path });
      const txt = v.reflection || v.text;
      if (txt) other.push(`${label(step)}: ${txt}`);
    }
    if (s.reflection_md) other.push(`Reflection: ${s.reflection_md}`);

    for (const f of filePaths) {
      const { data } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(f.path, FILE_LINK_SECONDS);
      if (data?.signedUrl) files.push(`${f.name}: ${data.signedUrl}`);
    }

    const mod = s.assignments?.modules;
    values.push(
      [
        p.display_name ?? "",
        p.email ?? "",
        p.github_username ? `@${p.github_username}` : "",
        mod ? `${mod.order_index}. ${mod.title}` : "",
        s.assignments?.title ?? "",
        s.assignments?.platform ?? "",
        s.assignments?.points ?? "",
        s.score ?? "",
        s.status ?? "",
        s.submitted_at ? new Date(s.submitted_at).toISOString() : "",
        s.reviewed_at ? new Date(s.reviewed_at).toISOString() : "",
        repos.join("\n"),
        lives.join("\n"),
        files.join("\n"),
        other.join("\n\n"),
        `${APP_URL}/submissions/${s.id}`,
      ].map((v) => String(v)),
    );
  }

  const spreadsheetId = await getOrCreateSpreadsheet(supabaseAdmin);

  await gateway(`/spreadsheets/${spreadsheetId}/values/${TAB}!A1:Z100000:clear`, { method: "POST", body: {} });
  await gateway(`/spreadsheets/${spreadsheetId}/values/${TAB}!A1?valueInputOption=RAW`, {
    method: "PUT",
    body: { range: `${TAB}!A1`, majorDimension: "ROWS", values },
  });

  return {
    spreadsheetId,
    rowCount: values.length - 1,
    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    downloadUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`,
  };
}
