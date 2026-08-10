// Maps assignment/module platform names to a brand domain for logo lookups.
// Uses Google's public favicon service so no API key is required.
const PLATFORM_DOMAIN: Record<string, string | string[]> = {
  GitHub: "github.com",
  ChatGPT: "chatgpt.com",
  Claude: "claude.ai",
  "Canva AI": "canva.com",
  NotebookLM: "notebooklm.google.com",
  "Gemini Notebook": "gemini.google.com",
  NapkinAI: "napkin.ai",
  "Napkin AI": "napkin.ai",
  Gamma: "gamma.app",
  "Adobe Firefly": "adobe.com",
  "Adobe Firefly & Canva AI": ["adobe.com", "canva.com"],
  Replit: "replit.com",
  Lovable: "lovable.dev",
};

function faviconUrl(domain: string, size: number) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

export function platformLogoUrls(
  platform: string | null | undefined,
  size: 32 | 64 | 128 = 64,
): string[] {
  if (!platform) return [];
  const entry = PLATFORM_DOMAIN[platform];
  if (!entry) return [];
  return (Array.isArray(entry) ? entry : [entry]).map((d) => faviconUrl(d, size));
}

export function platformLogoUrl(platform: string | null | undefined, size: 32 | 64 | 128 = 64) {
  return platformLogoUrls(platform, size)[0] ?? null;
}

export function PlatformLogo({
  platform,
  size = 32,
  className = "",
}: {
  platform: string | null | undefined;
  size?: 32 | 64 | 128;
  className?: string;
}) {
  const urls = platformLogoUrls(platform, size);
  if (urls.length === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 shrink-0">
      {urls.map((url) => (
        <img
          key={url}
          src={url}
          alt={`${platform} logo`}
          loading="lazy"
          className={"rounded-md bg-white p-1 border shrink-0 " + className}
          style={{ width: size / 2, height: size / 2 }}
        />
      ))}
    </span>
  );
}
