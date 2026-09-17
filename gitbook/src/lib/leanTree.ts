import * as fs from "node:fs";
import * as path from "node:path";
import type { LeanNode } from "./pages";
import { buildLeanTree } from "./pages";

interface TreeFileNode {
  filename: string;
  content?: string;
}

function strip(node: LeanNode & { files: TreeFileNode[] }): LeanNode {
  node.files = node.files.map((file) => ({ filename: file.filename }));
  for (const child of node.children as (LeanNode & { files: TreeFileNode[] })[]) {
    strip(child);
  }
  return node;
}

/**
 * Loads the lean navigation tree from public/tree.json (original file names,
 * slugified routes) falling back to a tree derived from content ids.
 */
export function loadLeanTree(ids: string[]): LeanNode {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "public", "tree.json"),
      "utf8",
    );
    return strip(JSON.parse(raw));
  } catch {
    return buildLeanTree(ids);
  }
}