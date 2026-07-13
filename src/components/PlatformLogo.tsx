// Maps assignment/module platform names to a brand domain for logo lookups.
// Uses Google's public favicon service so no API key is required.
const PLATFORM_DOMAIN: Record<string, string> = {
  GitHub: "github.com",
  ChatGPT: "chatgpt.com",
  Claude: "claude.ai",
  "Canva AI": "canva.com",
  NotebookLM: "notebooklm.google.com",
  NapkinAI: "napkin.ai",
  "Napkin AI": "napkin.ai",
  Gamma: "gamma.app",
  "Adobe Firefly": "adobe.com",
  Replit: "replit.com",
};

export function platformLogoUrl(platform: string | null | undefined, size: 32 | 64 | 128 = 64) {
  if (!platform) return null;
  const domain = PLATFORM_DOMAIN[platform];
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
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
  const url = platformLogoUrl(platform, size);
  if (!url) return null;
  return (
    <img
      src={url}
      alt={`${platform} logo`}
      loading="lazy"
      className={"rounded-md bg-white p-1 border shrink-0 " + className}
      style={{ width: size / 2, height: size / 2 }}
    />
  );
}
