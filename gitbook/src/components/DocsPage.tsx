import React from "react"
import ReactMarkdown from "react-markdown"
import { docsTree } from "../data/docstree"
import type { DocNode } from "../types"
import { findNodeByPath } from "../utils/findpath"

interface DocsPageProps {
  path: string // e.g., "/" or "/guide/deep"
}

export function DocsPage({ path }: DocsPageProps) {
  let node: DocNode | null = findNodeByPath(docsTree, path)
  let file = null

  if (!node) {
    const parts = path.split("/").filter(Boolean)
    if (parts.length > 0) {
      const fileName = parts[parts.length - 1]
      const folderPath = "/" + parts.slice(0, -1).join("/")
      const parentNode = findNodeByPath(docsTree, folderPath)
      if (parentNode) {
        file = parentNode.files.find(
          (f) => f.filename.replace(/\.md$/, "") === fileName
        )
        node = parentNode
      }
    }
  }

  if (!node) {
    return <div>Page not found</div>
  }

  // Helper component to render markdown
  const MarkdownContent = ({ content }: { content: string }) => (
    <ReactMarkdown>{content}</ReactMarkdown>
  )

  // If a specific file is selected
  if (file) {
    return (
      <div style={{ padding: 20 }}>
        <h1>{file.filename.replace(/\.md$/, "")}</h1>
        <MarkdownContent content={file.content} />
      </div>
    )
  }

  // Show index.md if exists
  const indexFile = node.files.find((f) => f.filename === "index.md")
  if (indexFile) {
    return (
      <div style={{ padding: 20 }}>
        <h1>{node.path === "/" ? "Home" : node.path}</h1>
        <MarkdownContent content={indexFile.content} />
      </div>
    )
  }

  // Fallback: show first available file
  if (node.files.length > 0) {
    const firstFile = node.files[0]
    return (
      <div style={{ padding: 20 }}>
        <h1>{firstFile.filename.replace(/\.md$/, "")}</h1>
        <MarkdownContent content={firstFile.content} />
      </div>
    )
  }

  // No files in folder
  return (
    <div style={{ padding: 20 }}>
      <h1>Path: {node.path}</h1>
      <p>No files in this folder</p>
    </div>
  )
}
