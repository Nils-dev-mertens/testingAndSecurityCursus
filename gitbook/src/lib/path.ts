export function normalizePath(raw: string | null | undefined): string {
  if (!raw) return "/";
  try {
    let p = decodeURIComponent(raw);
    if (!p.startsWith("/")) p = "/" + p;
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p;
  } catch {
    return raw || "/";
  }
}