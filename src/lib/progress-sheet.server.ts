/**
 * Server-only helpers that push approved student submissions into a single
 * Google Sheet. All Google calls go through the Lovable connector gateway.
 */
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";
const SHEET_TITLE = "Tech Pathways Academy — Student Progress";
const TAB = "Progress";
const SETTINGS_KEY = "progress_spreadsheet_id";

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

/** Rebuilds the whole sheet from the current set of approved submissions. */
export async function syncApprovedProgress() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: subs, error } = await supabaseAdmin
    .from("submissions")
    .select(
      "id, student_id, status, score, submitted_at, reviewed_at, assignments(title, platform, points, modules(title, order_index)), submission_artifacts(kind, url)",
    )
    .eq("status", "approved")
    .order("submitted_at", { ascending: true });
  if (error) throw new Error(error.message);

  const rows = subs ?? [];
  const ids = [...new Set(rows.map((r: any) => r.student_id))];
  const people = new Map<string, any>();
  if (ids.length) {
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, email, github_username")
      .in("id", ids);
    for (const p of profiles ?? []) people.set(p.id, p);
  }

  const values = [
    HEADERS,
    ...rows.map((s: any) => {
      const p = people.get(s.student_id) ?? {};
      const arts = s.submission_artifacts ?? [];
      const repo = arts.find((a: any) => a.kind === "github_repo")?.url ?? "";
      const live =
        arts.find((a: any) => a.kind === "github_pages" || a.kind === "live_url" || a.kind === "replit")?.url ?? "";
      const mod = s.assignments?.modules;
      return [
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
        repo,
        live,
      ].map((v) => String(v));
    }),
  ];

  const spreadsheetId = await getOrCreateSpreadsheet(supabaseAdmin);

  await gateway(`/spreadsheets/${spreadsheetId}/values/${TAB}!A1:Z100000:clear`, { method: "POST", body: {} });
  await gateway(`/spreadsheets/${spreadsheetId}/values/${TAB}!A1?valueInputOption=USER_ENTERED`, {
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
