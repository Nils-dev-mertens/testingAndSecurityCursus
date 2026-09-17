import type { DocNode } from "../types";
import { slugify } from "./pages";

export interface SearchHit {
  /** Public URL of the matching page. */
  path: string;
  /** Short label shown as the result title. */
  label: string;
  /** Parent folder trail, e.g. "security / authorization". */
  breadcrumb: string;
  /** First meaningful line of the page, used as a preview. */
  snippet: string;
}

/** Normalizes text so queries match prose instead of markdown syntax. */
function normalize(value: string): string {
  return value.toLowerCase().replace(/[#\n]/g, " ");
}

/** Strips the leading markdown heading from a page body. */
function stripHeading(line: string): string {
  return line.replace(/^#+\s*/, "").trim();
}

function labelFor(path: string, filename: string): string {
  if (filename.toLowerCase() !== "index.md") return filename.replace(/\.md$/i, "");
  if (path === "/") return "Home";
  return path.split("/").filter(Boolean).pop() ?? "Home";
}

function breadcrumbFor(path: string, filename: string): string {
  const segments = path.split("/").filter(Boolean);
  const parents = filename.toLowerCase() === "index.md" ? segments.slice(0, -1) : segments;
  return parents.join(" / ");
}

function snippetFor(content: string, label: string): string {
  const lines = content.split("\n").map(stripHeading).filter(Boolean);
  return lines.find((line) => normalize(line).trim() !== normalize(label).trim()) ?? lines[0] ?? "";
}

function routeFor(path: string, filename: string): string {
  if (filename.toLowerCase() === "index.md") return path;
  const slug = slugify(filename.replace(/\.md$/i, ""));
  return path === "/" ? `/${slug}` : `${path}/${slug}`;
}

/**
 * Walks the docs tree depth-first and returns every page whose name or body
 * matches the query, ready to render in the search dialog.
 */
export function searchDocs(data: DocNode, query: string): SearchHit[] {
  const needle = normalize(query).trim();
  if (!needle) return [];

  const hits: SearchHit[] = [];

  const walk = (node: DocNode) => {
    for (const file of node.files) {
      if (!normalize(`${file.filename} ${file.content}`).includes(needle)) continue;
      const label = labelFor(node.path, file.filename);
      hits.push({
        path: routeFor(node.path, file.filename),
        label,
        breadcrumb: breadcrumbFor(node.path, file.filename),
        snippet: snippetFor(file.content, label),
      });
    }
    for (const child of node.children) walk(child);
  };

  walk(data);
  return hits;
}
