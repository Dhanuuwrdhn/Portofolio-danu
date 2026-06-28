const DEFAULT_LOCAL_URL = "http://localhost:3000";
const PROD_FALLBACK_URL = "https://syahrialdanu.my.id";

function isValidHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeSiteUrl(url?: string) {
  const fallback =
    process.env.NODE_ENV === "production" ? PROD_FALLBACK_URL : DEFAULT_LOCAL_URL;
  if (!url) return fallback;

  // strip surrounding quotes/whitespace and trailing slashes (common env mistakes)
  const trimmedUrl = url
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/+$/, "");
  if (!trimmedUrl) return fallback;

  const candidate = /^https?:\/\//.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;

  return isValidHttpUrl(candidate) ? candidate : fallback;
}

export function getSiteUrl() {
  return normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.SITE_URL ??
      process.env.VERCEL_PROJECT_PRODUCTION_URL ??
      process.env.VERCEL_URL
  );
}

export function getSiteOrigin() {
  return new URL(getSiteUrl()).origin;
}
