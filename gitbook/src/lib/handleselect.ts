import { normalizePath } from "./path";

/**
 * Navigates to a docs page using real URLs.
 */
export function handleNavigate(rawPath: string): void {
  const normalized = normalizePath(rawPath);
  window.location.assign(normalized);
}