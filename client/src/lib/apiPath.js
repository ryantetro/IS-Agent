/**
 * Static hosting (e.g. Vercel) needs an absolute API origin; local dev uses Vite's `/api` proxy.
 */
export function apiPath(path) {
  const raw = import.meta.env.VITE_API_BASE_URL;
  const base = typeof raw === "string" ? raw.replace(/\/$/, "") : "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}
