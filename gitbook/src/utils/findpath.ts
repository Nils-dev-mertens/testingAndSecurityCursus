import type { DocNode } from "../types"

export function findNodeByPath(node: DocNode, url: string): DocNode | null {
  if (node.path === url) return node
  for (const child of node.children) {
    const found = findNodeByPath(child, url)
    if (found) return found
  }
  return null
}