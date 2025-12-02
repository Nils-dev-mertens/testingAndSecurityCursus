import React from "react"
import { docsTree } from "../data/docstree"
import type { DocNode } from "../types"
import { findNodeByPath } from "../utils/findpath"

interface DocsPageProps {
  path: string  // e.g., "/" or "/guide/deep"
}

export function DocsPage({ path }: DocsPageProps) {
  // Try to find a folder node first
  let node: DocNode | null = findNodeByPath(docsTree, path)
  let file = null

  // If no node found, try to find the file by splitting the path
  if (!node) {
    const parts = path.split("/").filter(Boolean)
    if (parts.length > 0) {
      // Try to find parent folder and file
      const fileName = parts[parts.length - 1]
      const folderPath = "/" + parts.slice(0, -1).join("/")
      
      const parentNode = findNodeByPath(docsTree, folderPath)
      if (parentNode) {
        file = parentNode.files.find((f) => f.filename.replace(/\.md$/, "") === fileName)
        node = parentNode
      }
    }
  }

  if (!node) {
    return <div>Page not found</div>
  }

  // If a specific file is selected, show its content
  if (file) {
    return (
      <div style={{ padding: 20 }}>
        <h1>{file.filename.replace(/\.md$/, "")}</h1>
        <div>{file.content}</div>
      </div>
    )
  }

  // Show the first file's content (index.md) when viewing a folder
  const indexFile = node.files.find((f) => f.filename === "index.md")
  if (indexFile) {
    return (
      <div style={{ padding: 20 }}>
        <h1>{node.path === "/" ? "Home" : node.path}</h1>
        <div>{indexFile.content}</div>
      </div>
    )
  }

  // Fallback: show first available file content
  if (node.files.length > 0) {
    const firstFile = node.files[0]
    return (
      <div style={{ padding: 20 }}>
        <h1>{firstFile.filename.replace(/\.md$/, "")}</h1>
        <div>{firstFile.content}</div>
      </div>
    )
  }

  // If no files in folder, show folder info
  return (
    <div style={{ padding: 20 }}>
      <h1>Path: {node.path}</h1>
      <p>No files in this folder</p>
    </div>
  )
}
