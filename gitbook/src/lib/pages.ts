import { slug } from "github-slugger";

export interface LeanFile {
  filename: string;
}

export interface LeanNode {
  path: string;
  label?: string;
  files: LeanFile[];
  children: LeanNode[];
}

export interface PageLink {
  href: string;
  label: string;
}

/**
 * Slugifies a path segment the same way Astro content ids are slugified,
 * so links built from file/folder names match the generated routes.
 */
export function slugify(segment: string): string {
  return slug(segment);
}

/**
 * Converts a content collection id (e.g. "Security/HTTPS" or "Testing/index")
 * into the public URL path in the generated site.
 */
export function pagePathForId(id: string): string {
  if (id === "index") return "/";
  const parts = id.split("/");
  if (parts[parts.length - 1] === "index") {
    return "/" + parts.slice(0, -1).join("/");
  }
  return "/" + parts.join("/");
}

/**
 * Human readable label for a page path, e.g. "/Security/HTTPS" -> "HTTPS".
 */
export function labelForPath(path: string): string {
  if (path === "/") return "Home";
  const segments = path.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  try {
    return decodeURIComponent(last ?? "Home");
  } catch {
    return last ?? "Home";
  }
}

/**
 * Builds the ordered, de-duplicated list of pages in the docs site.
 */
export function buildPageList(ids: string[]): PageLink[] {
  const seen = new Set<string>();
  const links: PageLink[] = [];
  for (const id of ids) {
    const href = pagePathForId(id);
    if (seen.has(href)) continue;
    seen.add(href);
    links.push({ href, label: labelForPath(href) });
  }
  return links.sort((a, b) => a.href.localeCompare(b.href));
}

/**
 * Returns the previous and next page links around the given path.
 */
export function getPagination(list: PageLink[], currentPath: string): { prev?: PageLink; next?: PageLink } {
  const index = list.findIndex((p) => p.href === currentPath);
  if (index === -1) return {};
  return {
    prev: index > 0 ? list[index - 1] : undefined,
    next: index < list.length - 1 ? list[index + 1] : undefined,
  };
}

/**
 * Builds a lightweight tree (paths + filenames, no content) from content ids.
 * Mirrors the structure of tree.json so sidebar and search share one shape.
 */
export function buildLeanTree(ids: string[]): LeanNode {
  const root: LeanNode = { path: "/", label: "Home", files: [], children: [] };
  for (const id of ids) {
    const parts = id.split("/");
    const fileName = `${parts[parts.length - 1]}.md`;
    const folderParts = parts.slice(0, -1);

    let cursor = root;
    for (const part of folderParts) {
      const childPath = cursor.path === "/" ? `/${part}` : `${cursor.path}/${part}`;
      let child = cursor.children.find((c) => c.path === childPath);
      if (!child) {
        child = { path: childPath, label: part, files: [], children: [] };
        cursor.children.push(child);
      }
      cursor = child;
    }

    if (!cursor.files.some((f) => f.filename === fileName)) {
      cursor.files.push({ filename: fileName });
    }
  }

  sortTree(root);
  return root;
}

function sortTree(node: LeanNode): void {
  node.files.sort((a, b) => a.filename.localeCompare(b.filename));
  node.children.sort((a, b) => a.path.localeCompare(b.path));
  for (const child of node.children) sortTree(child);
}

export function findNodeByPath(node: LeanNode, url: string): LeanNode | null {
  if (node.path === url) return node;
  for (const child of node.children) {
    const found = findNodeByPath(child, url);
    if (found) return found;
  }
  return null;
}

/**
 * Lists the non-index files of a folder, used for the "see files" buttons.
 */
export function filesInFolder(tree: LeanNode, path: string): PageLink[] {
  const node = findNodeByPath(tree, path);
  if (!node) return [];
  const links: PageLink[] = [];
  for (const file of node.files) {
    if (file.filename.toLowerCase() === "index.md") continue;
    const slugged = slugify(file.filename.replace(/\.md$/i, ""));
    links.push({
      href: node.path === "/" ? `/${slugged}` : `${node.path}/${slugged}`,
      label: file.filename.replace(/\.md$/i, ""),
    });
  }
  return links;
}